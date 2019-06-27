<template>
  <div class="full-size">
    <side-menu ref="sideMenu" v-if="$mq != 'mobile-landscape'"></side-menu>
    <menu-button-nav-bar v-if="$mq != 'mobile-landscape'"></menu-button-nav-bar>

    <item-laptop 
      v-if="$mq == 'laptop' && displayItem.id"
      :item="returnDisplayItem"
    ></item-laptop>

    <item-mobile 
      v-if="$mq == 'mobile-portrait' && displayItem.id"
      :item="returnDisplayItem"
    ></item-mobile>

    <item-tablet 
      v-if="($mq == 'tablet-portrait' || $mq == 'tablet-landscape') && displayItem.id"
      :item="returnDisplayItem"
    ></item-tablet>

    <unsupport v-if="$mq == 'mobile-landscape'"></unsupport>

  </div>
</template>
<script>
  // Components
  import sideMenu from '../components/sideMenu.vue'
  import menuButtonNavBar from '../components/menuButtonNavBar.vue'
  
  import itemLaptop from '../subviews/item/ItemLaptop.vue'
  import itemMobile from '../subviews/item/ItemMobile.vue'
  import itemTablet from '../subviews/item/ItemTablet.vue'
  import unsupport from './Unsupport.vue'
  export default {
    components: {
      sideMenu,
      menuButtonNavBar,
      itemLaptop,
      itemMobile,
      itemTablet,
      unsupport
    },
    data () {
      return {
        displayItem: {}
      }
    },
    created () {
      this.INITIALIZE()
        .then(() => {
          var item = this.$store.getters.SEARCH_ITEM_WITH_ID(this.$route.params.id)
          if (item && this.moment(item[0].end_at).isAfter(new Date())) {
            this.displayItem = Object.assign({}, item[0])
          } else {
            this.$router.push('/page-not-found')
          }
        })
        .catch(() => {
          this.$router.push('/page-not-found')
        })
    },
    computed: {
      // pass getter function to all child component -> make sure update child component
      returnDisplayItem () {
        var result = this.$store.getters.SEARCH_ITEM_WITH_ID(this.$route.params.id)
        return result[0]
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../vars.scss";  
</style>
