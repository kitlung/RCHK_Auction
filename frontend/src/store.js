import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    filterKeyWord: '',        // value of searching input in upper nav bar 
    itemList: [],             // all items inside database
    sideMenu: {
      opened: false,          // the flag of status of sidemenu
    },
    displayingItemID: '',     // displaying item
    bidRecords: [],
    user: {
      userID: '',
      name: '',
      subscribed: []
    }
  },

  getters: {
    FILTER_ITEM_LIST: state => {
      if (state.filterKeyWord) {
        return state.itemList.filter(item => item.id.includes(state.filterKeyWord))
      } else {
        return state.itemList
      }
    },
    GET_BID_RECORDS: state => {
      if (state.bidRecords.length > 0) {
        state.bidRecords.forEach(bidRecord => {
          bidRecord.created_at = moment(bidRecord.created_at).format('YYYY-MM-DD HH:mm:ss')
        })
        return state.bidRecords
      }
    },
    SEARCH_ITEM_WITH_ID: state => keyword =>{
      return state.itemList.filter(item => {
        return item.id === keyword
      })
    },
  },

  actions: {
/*****************************************************/
/* Items
/*****************************************************/
    FETCH_ITEM_LIST ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get('/api/auction/v1/items')
        .then(res => {
          if(!!!res.data.Error){
            var itemList = res.data.Request
            axios.get('/api/auction/v1/bidders')
              .then(bidderRes => {
                commit('SET_ITEMLIST', [itemList, bidderRes.data.Request])
                resolve()
              })
          }
        })
        .catch(err => {
          commit('SET_ITEMLIST', [])
          reject(err)
        })
      })
    },
/*****************************************************/
/* User
/*****************************************************/
    FETCH_USER_INFO ({dispatch}, userID) {
      return new Promise((resolve, reject) => {
        Promise.all([
          dispatch('FETCH_USER_BASIC_INFO', userID),
          dispatch('FETCH_USER_SUBSCRIPTION_LIST', userID)
        ])
        .then(() => {resolve()})
        .catch(() => {reject()})
      })
    },
    FETCH_USER_BASIC_INFO ({commit}, userID) {
      return new Promise((resolve, reject) => {
        axios.get('/api/rcapps/user/'+ userID)
          .then(res => {
            commit('SET_USER_BASIC_INFO', [userID, res.data.response[0].full_name])
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    FETCH_USER_SUBSCRIPTION_LIST ({commit}, userID) {
      return new Promise((resolve, reject) => {
        axios.get('/api/auction/v1/subscription/' + userID)
          .then(res => {
            var sub_list = res.data.Request.map(ele => ele.item_id);
            commit('SET_USER_SUBSCRIBE_LIST', sub_list)
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
/*****************************************************/
/* Others
/*****************************************************/
    FETCH_BID_RECORDS ({commit}, [userID, itemID]) {
      return new Promise((resolve, reject) => {
        axios.get('/api/auction/v1/bid-record?user_id=' + userID + '&item_id=' + itemID)
          .then(res => {
            if(!!!res.data.Error){
              commit('SET_BID_RECORDS', res.data.Request)
              resolve()
            }else{
              commit('SET_BID_RECORDS', [])
              reject()
            }
          })
          .catch(err => {
            commit('SET_BID_RECORDS', [])
            reject(err)  
          })
      })
    },
    TOGGLE_SIDEMENU ({commit}) {
      return new Promise((resolve,reject) => {
        commit('SET_SIDEMENU')
        resolve()
      })
    },
    CHANGE_FILTER_KEYWORD ({commit}, keyword) {
      return new Promise((resolve, reject) => {
        commit('SET_FILTER_KEYWORD', keyword)
      })
    },
/*****************************************************/
/* Socket
/*****************************************************/
    SOCKET_ITEM_UPDATE ({dispatch}) {
      dispatch('FETCH_ITEM_LIST')
    },
    SOCKET_BID_INSERT ({dispatch}) {
      dispatch('FETCH_ITEM_LIST')
    }
  },

  mutations: {
/*****************************************************/
/* Items
/*****************************************************/
    SET_ITEMLIST (state, data) {
      state.itemList = data[0].map(ele => {
        ele['subscribed'] = state.user.subscribed.includes(ele.id)
        var bidder = data[1].find(count => count.group === ele.id)
        ele['bidders'] = bidder ? bidder.reduction : 0
        return ele
      })
    },
    SET_FILTER_KEYWORD (state, data) {
      state.filterKeyWord = data
    },
/*****************************************************/
/* User
/*****************************************************/
    SET_USER_BASIC_INFO (state, data) {
      state.user.userID = data[0]
      state.user.name = data[1]
    },
    SET_USER_SUBSCRIBE_LIST (state, data) {
      state.user.subscribed = [].concat(data)
    },
/*****************************************************/
/* Others
/*****************************************************/
    SET_SIDEMENU (state) {
      state.sideMenu.opened = !state.sideMenu.opened
    },
    SET_BID_RECORDS (state, data) {
      state.bidRecords = data
    },
  }
})
