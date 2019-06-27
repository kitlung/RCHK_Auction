<template>
  <div id="mobile-item-detail" class="vertical-scroll-snapping-parent">
    <div class="vertical-scroll-snapping-child mobile-item-detail-container">
      <item-detail-description :item="item"></item-detail-description>
    </div>
    <div class="vertical-scroll-snapping-child mobile-item-detail-container">
      <item-auction-info :item="item" v-on:ended="emitEnd"></item-auction-info>
    </div>
    <overlay :title="'Oops!'" :msg="'Auction Ended'" :icon="'alarm'" :className="'danger'" v-if="end"></overlay>
  </div>
</template>
<script>
import itemDetailDescription from '../../components/itemDetailDescription.vue'
import itemAuctionInfo from '../../components/itemAuctionInfo.vue'
import overlay from '../../components/overlay.vue'

export default {
  props:{
    item: {
      type: Object
    }
  },
  components: {
    itemDetailDescription,
    itemAuctionInfo,
    overlay
  },
  data () {
    return {
      end: false
    }
  },
  methods: {
    emitEnd () {
      this.end = true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../vars.scss";  

  #mobile-item-detail{
    height: calc(100vh - 32px - 36px);
    width: 100%;
    > div:first-child{
      margin-bottom: $lg-space;
    }
    &::-webkit-scrollbar { 
      display: none; 
    }
  }
  .mobile-item-detail-container{
    height: calc(100vh - 32px - 36px);
    display: flex;
  }
</style>
