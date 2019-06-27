<template>
  <div id="tablet-item-detail" class="horizontal-scroll-parent horizontal-scroll-snapping-parent">
    <div class="tablet-item-detail-container horizontal-scroll-child horizontal-scroll-snapping-child">
      <item-detail-description :item="item"></item-detail-description>
    </div>
    <div class="tablet-item-detail-container horizontal-scroll-child horizontal-scroll-snapping-child">
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

  #tablet-item-detail{
    height: calc(100vh - 32px - 48px);
    width: 100%;
    > div:first-child{
      margin-right: $lg-space;
    }
    &::-webkit-scrollbar { 
      display: none; 
    }
  }

  .tablet-item-detail-container{
    height: calc(100vh - 32px - 48px);
    width: 100%;
    display: flex;
  }
</style>
