<template>
  <div id="laptop-item-detail-container">
    <div style="max-height: calc(100vh - 48px - 48px); display: flex;">
      <item-detail-description :item="item"></item-detail-description>
    </div>
    <item-auction-info :item="item" v-on:ended="emitEnd"></item-auction-info>
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
  },
}
</script>
<style lang="scss" scoped>
  @import "../../vars.scss";

  #laptop-item-detail-container{
    display: grid;
    grid-template-columns: calc(50% - 10px) calc(50% - 10px);
    grid-gap: $lg-space;
    height: calc(100% - 48px);
  }
</style>
