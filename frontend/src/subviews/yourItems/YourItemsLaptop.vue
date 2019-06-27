<template>
  <div id="items-table-wrapper">
    <div id="items-table-tab-bar">
      <div 
        :class="{'selected' : tab == 'sold'}" 
        @click="changeTab('sold')" 
        class="clickable"
      >
        <v-icon>send</v-icon>
        <label>Sold</label>
      </div>
      <div
        :class="{'selected' : tab == 'won'}"
        @click="changeTab('won')"
        class="clickable"
      >
        <v-icon>redeem</v-icon>
        <label>Won</label>
      </div>
      <div
        :class="{'selected' : tab == 'expired'}"
        @click="changeTab('expired')"
        class="clickable"
      >
        <v-icon>alarm</v-icon>
        <label>Expired</label>
      </div>
      <div
        :class="{'selected' : tab == 'selling'}"
        @click="changeTab('selling')"
        class="clickable"
      >
        <v-icon>store</v-icon>
        <label>Selling</label>
      </div>
      <div
        :class="{'selected' : tab == 'add'}"
        @click="changeTab('add')"
        class="clickable"
      >
        <v-icon>add_box</v-icon>
        <label>Add</label>
      </div>
    </div>
    <!-- Sold Items -->
    <div class="card items-table-card" v-show="tab == 'sold' && ($mq != 'mobile-portrait' && $mq != 'mobile-landscape')">
      <div class="items-table-header split-five">
        <label>ID</label>
        <label>Name</label>
        <label>Price</label>
        <label>Winner</label>
        <label>Action</label>
      </div>
      <div v-for="item in soldItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info split-five">
          <div class="your-item-info-id flex-box-parent">{{item.id}}</div>
          <div class="flex-box-parent">{{item.name}}</div>
          <div class="flex-box-parent">${{item.price}}</div>
          <div class="flex-box-parent">{{item.winner}}</div>
          <div class="your-item-action">
            <button 
              class="pri-btn your-item-action-btn clickable" 
              :class="{'disabled' : item.delivered}"
              @click="showDialog('delivered', item)"
            >
              Delivered <v-icon>send</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Sold Items Mobile -->
    <div class="card items-table-card" v-show="tab == 'sold' && ($mq == 'mobile-portrait' || $mq == 'mobile-landscape')">
      <div v-for="item in soldItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info">
          <div>{{item.id}}</div>
          <div><label>Name : </label>{{item.name}}</div>
          <div><label>Winner : </label>{{item.winner}}</div>
          <div><label>Hammer Price : </label>${{item.price}}</div>
          <div class="your-item-action">
            <button 
              class="pri-btn your-item-action-btn clickable" 
              :class="{'disabled' : item.delivered}"
              @click="showDialog('delivered', item)"
            >
              Delivered <v-icon>send</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Won Items -->
    <div class="card items-table-card" v-show="tab == 'won' && ($mq != 'mobile-portrait' && $mq != 'mobile-landscape')">
      <div class="items-table-header">
        <label>ID</label>
        <label>Name</label>
        <label>Price</label>
        <label>Ower</label>
        <label>Action</label>
      </div>
      <div v-for="item in wonItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info split-five">
          <div class="your-item-info-id flex-box-parent">{{item.id}}</div>
          <div class="flex-box-parent">{{item.name}}</div>
          <div class="flex-box-parent">${{item.price}}</div>
          <div class="flex-box-parent">{{item.owner}}</div>
          <div class="your-item-action">
            <button 
              class="pri-btn your-item-action-btn clickable" 
              :class="{'disabled' : item.received}"
              @click="showDialog('received', item)"
            >
              Received <v-icon>redeem</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Won Items Mobile -->
    <div class="card items-table-card" v-show="tab == 'won' && ($mq == 'mobile-portrait' || $mq == 'mobile-landscape')">
      <div v-for="item in wonItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info">
          <div>{{item.id}}</div>
          <div><label>Name : </label>{{item.name}}</div>
          <div><label>Owner : </label>{{item.owner}}</div>
          <div><label>Hammer Price : </label>${{item.price}}</div>
          <div class="your-item-action">
            <button 
              class="pri-btn your-item-action-btn clickable" 
              :class="{'disabled' : item.received}"
              @click="showDialog('received', item)"
            >
              Received <v-icon>redeem</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Expired Items -->
    <div class="card items-table-card" v-show="tab == 'expired' && ($mq != 'mobile-portrait' && $mq != 'mobile-landscape')">
      <div class="items-table-header split-four">
        <label>ID</label>
        <label>Name</label>
        <label>Price</label>
        <label>Action</label>
      </div>
      <div v-for="item in expiredItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info split-four">
          <div class="your-item-info-id flex-box-parent">{{item.id}}</div>
          <div class="flex-box-parent">{{item.name}}</div>
          <div class="flex-box-parent">${{item.price}}</div>
          <div class="your-item-action">
            <button 
              class="pri-btn your-item-action-btn clickable"
              @click="showDialog('expired', item)"
            >
              Delete <v-icon>delete</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Expired Items Mobile -->
    <div class="card items-table-card" v-show="tab == 'expired' && ($mq == 'mobile-portrait' || $mq == 'mobile-landscape')">
      <div v-for="item in expiredItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info">
          <div>{{item.id}}</div>
          <div><label>Name : </label>{{item.name}}</div>
          <div><label>Price : </label>${{item.price}}</div>
          <div class="your-item-action">
            <button 
              class="pri-btn your-item-action-btn clickable"
              @click="showDialog('expired', item)"
            >
              Delete <v-icon>delete</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Selling Items -->
    <div class="card items-table-card" v-show="tab == 'selling' && ($mq != 'mobile-portrait' && $mq != 'mobile-landscape')">
      <div class="items-table-header split-three">
        <label>ID</label>
        <label>Name</label>
        <label>Price</label>
      </div>
      <div v-for="item in sellingItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info split-three">
          <div class="your-item-info-id flex-box-parent clickable" @click="redirectTo(item.id)">{{item.id}}</div>
          <div class="flex-box-parent">{{item.name}}</div>
          <div class="flex-box-parent">${{item.price}}</div>
        </div>
      </div>
    </div>
    <!-- Selling Items Mobile -->
    <div class="card items-table-card" v-show="tab == 'selling' && ($mq == 'mobile-portrait' || $mq == 'mobile-landscape')">
      <div v-for="item in sellingItems" v-bind:key="item.id" class="your-item">
        <div class="your-item-info">
          <div class="clickable" @click="redirectTo(item.id)">{{item.id}}</div>
          <div>{{item.name}}</div>
          <div>${{item.price}}</div>
        </div>
      </div>
    </div>
    <!-- Add Item -->
    <div class="items-table-card" v-show="tab == 'add'" :class="$mq == 'tablet-portrait' ? 'flex-box-parent' : ''">
      <add-item></add-item>
    </div>
    <confirm-dialog 
      v-model="dialog.showConfirmDialog"
      :title="dialog.title"
      :text="dialog.text"
      :item='dialog.item'
      :type='dialog.type'
      v-on:delivered="markAsDelivered($event)"
      v-on:received="markAsReceived($event)"
      v-on:expired="deleteExpiredItem($event)"
    ></confirm-dialog>
  </div>
</template>
<script>
import confirmDialog from '../../components/yourItemsDialog.vue'
import addItem from '../../components/addItem.vue'

export default {
  props: {
    soldItems: Array,
    wonItems: Array,
    expiredItems: Array, // delete
    sellingItems: Array // just view
  },
  components: {
    confirmDialog,
    addItem
  },
  data () {
    return {
      tab: 'sold',
      dialog: {
        showConfirmDialog: false,
        title: '',
        text: '',
        type: '',
        item: {}
      }
    }
  },
  methods: {
    changeTab (key) {
      this.tab = key
    },
    showDialog(flag, item){
      this.dialog.showConfirmDialog = true
      this.dialog.item = Object.assign({}, item)
      this.dialog.type = flag

      if(flag == 'delivered'){
        this.dialog.title = 'Mark item as Delivered?'
        this.dialog.text = 'Press Submit if you have delivered your item to the winner. This record will be deleted after both winner and owner have confirmed.'
      } else if (flag == 'received') {
        this.dialog.title = 'Mark item as Received?'
        this.dialog.text = 'Press Submit if you have received this item from its owner. This record will be deleted after both winner and owner have confirmed.'
      } else if (flag == 'expired') {
        this.dialog.title = 'Delete expired item?'
        this.dialog.text = 'The item will be deleted within 3 days automatically.'
      }
    },
    markAsDelivered (item) {
      var payload = {
        id: item.id,
        delivered: true
      }
      this.$http.put('/api/auction/v1/item', payload)
        .then( _ => {
          this.$parent.getSoldItems()
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Unable to change value in database.'})
        })
    },
    markAsReceived (item) {
      var payload = {
        id: item.id,
        received: true
      }
      this.$http.put('/api/auction/v1/item', payload)
        .then( _ => {
          item.received = true
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Unable to change value in database.'})
        })
    },
    deleteExpiredItem (item) {
      var payload = {
        id: item.id
      }
      this.$http.delete('/api/auction/v1/item', {data : payload})
        .then( _ => {
          this.$parent.getExpiredItems()
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Unable to change value in database.'})
        })
    },
    redirectTo (itemID) {
      this.$router.push('/item/' + itemID)
    },
  }
}
</script>
<style lang="scss" scoped>
  @import "../../vars.scss";
  #items-table-wrapper{
      height: calc(100% - 40px);
    .split-five{
      grid-template-columns: repeat(5,1fr);
    }
    .split-four{
      grid-template-columns: repeat(4,1fr);
    }
    .split-three{
      grid-template-columns: repeat(3,1fr);
    }
  }
  #items-table-tab-bar{
    height: 62px;
    padding: $sm-space 0;
    display: flex;
    div{
      min-width: 52px;
      height: 42px;
      margin: 0 $sm-space;
      display: grid;
      i{
        font-size: 24px;
        color: $pri-light;
      }
      label{
        color: $pri-light;
        text-align: center;
      }
      &.selected{
        i{
          color: $pri;
        }
        label{
          color: $pri;
        }
      }
    }
  }
  .items-table-card{
    padding: $sm-space;
    height: calc(100% - 62px);
    overflow: auto;
    #items-table-title{
      height: 18px;
      font-size: 14px;
      color: $pri;
      text-align: center;
      width: 100%;
    }
    .items-table-header{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(5,1fr);      
      label{
        text-align: center;
        color: $pri;
      }
    }
    .your-item{
      padding: $sm-space $xs-space;
      .your-item-info{
        display: grid;
        div{
          font-size: 14px;
        }
        .your-item-info-id{
          font-size: 11px;
        }
      }
      .your-item-action{
        display: flex;
        .your-item-action-btn{
          width: 120px;
          margin: auto;
          box-shadow: none;
          padding: $sm-space;
          i{
            font-size: 18px;
            color: #fff;
          }
        }
      }
      &:not(:last-child){
        border-bottom: 1px solid $pri-light;
      }
    }
  }

  @media #{$mobile-portrait} {
    #items-table-wrapper{
      height: calc(100% - 28px);
    }
    .items-table-card{
      height: calc(100% - 52px);
    }
    #items-table-tab-bar{
      height: 52px;
      padding: $xs-space 0;
      div{
        min-width: 52px;
        height: 42px;
        margin: 0 auto;
        i{
          font-size: 18px;
        }
      }
    }
    .your-item{
      .your-item-info{
        grid-gap: $sm-space;
      }
      &:nth-child(odd){
        background-color: $pri-light;
        label{
          color: $pri;
        }
      }
      .oneline-info{
        display: flex;
        justify-content: space-around;
      }
      .your-item-action{
        justify-content: flex-end;
        .your-item-action-btn{
          margin: unset !important;
        }
      }
    }
  }

  @media #{$mobile-landscape} {
    #items-table-wrapper{
      height: calc(100% - 40px);
    }
    .items-table-card{
      height: calc(100% - 52px);
    }
    #items-table-tab-bar{
      height: 52px;
      padding: $xs-space 0;
      div{
        min-width: 52px;
        height: 42px;
        margin: 0 auto;
        i{
          font-size: 18px;
        }
      }
    }
    .your-item{
      .your-item-info{
        grid-gap: $sm-space;
      }
      &:nth-child(odd){
        background-color: $pri-light;
        label{
          color: $pri;
        }
      }
      .oneline-info{
        display: flex;
        justify-content: space-around;
      }
      .your-item-action{
        justify-content: flex-end;
        .your-item-action-btn{
          margin: unset !important;
        }
      }
    }
  }


</style>
