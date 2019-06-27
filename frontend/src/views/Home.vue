<template>
  <div class="full-size">
    <side-menu ref="sideMenu" v-if="$mq != 'mobile-landscape'"></side-menu>
    <upper-nav-bar v-if="$mq != 'mobile-landscape'" v-on:sort_items="sortItems"></upper-nav-bar>

    <home-mobile 
      v-if="$mq == 'mobile-portrait' && displayItemList.length > 0"
      :itemList="displayItemList"
    ></home-mobile>

    <home-tablet 
      v-if="($mq == 'tablet-landscape' || $mq == 'tablet-portrait') && displayItemList.length > 0"
      :itemList="displayItemList"
    ></home-tablet>

    <home-laptop v-if="$mq == 'laptop' && displayItemList.length > 0" :itemList="displayItemList"></home-laptop>

    <unsupport v-if="$mq == 'mobile-landscape'"></unsupport>
  </div>
</template>

<script>
  // Components
  import sideMenu from '../components/sideMenu.vue'
  import upperNavBar from '../components/upperNavBar.vue'
  // Subviews
  import homeMobile from '../subviews/home/HomeMobile.vue'
  import homeTablet from '../subviews/home/HomeTablet.vue'
  import homeLaptop from '../subviews/home/HomeLaptop.vue'
  import unsupport from './Unsupport.vue'

  export default {
    components: {
      sideMenu,
      upperNavBar,
      homeMobile,
      homeTablet,
      homeLaptop,
      unsupport
    },
    data () {
      return {
        sortKey: ''
      }
    },
    computed:{
      // BUG
      // After input filterKeyword
      // Sorting function is not working
      displayItemList () {
        if(this.sortKey){
          var tempList = this.$store.getters.FILTER_ITEM_LIST
          switch (this.sortKey) {
            case 'nameAsc':
              tempList.sort((a,b) => {
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)
              })
              break
            case 'nameDesc':
              tempList.sort((a,b) => {
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                return nameB < nameA ? -1 : (nameB > nameA ? 1 : 0)
              })
              break
            case 'popularityDesc':
              tempList.sort((a,b) => b.bidders - a.bidders)
              break
            case 'popularityAsc':
              tempList.sort((a,b) => a.bidders - b.bidders)
              break
            case 'priceDesc':
              tempList.sort((a,b) => b.price - a.price)
              break
            case 'priceAsc':
              tempList.sort((a,b) => a.price - b.price)
              break
            case 'timeDesc':
              tempList.sort((a,b) => {
                return new Date(b.end_at) - new Date(a.end_at)
              })
              break
            case 'timeAsc':
              tempList.sort((a,b) => {
                return new Date(a.end_at) - new Date(b.end_at)
              })
              break
            default:
              tempList.sort((a,b) => {
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)
              })
          }
          return tempList
        }else{
          return this.$store.getters.FILTER_ITEM_LIST
        }
      }
    },
    created () {
      this.INITIALIZE()
    },
    methods: {
      sortItems (key) {
        this.sortKey = key
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

</style>