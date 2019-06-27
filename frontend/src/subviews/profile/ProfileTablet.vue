<template>
  <div id="tablet-profile-container" class="horizontal-scroll-parent horizontal-scroll-snapping-parent">
    <div id="tablet-left" class="horizontal-scroll-child horizontal-scroll-snapping-child">
      <div class="tablet-profile-card">
        <profile-card
          :user="user"
          :noOfWin="wonItems.length"
          :noOfSellingItems="sellingItems.length"
          v-if="user.userID"
        ></profile-card>
      </div>
      <div>
        <recent-activity :user="user" v-if="user.userID"></recent-activity>
      </div>
    </div>
    <div id="tablet-right" class="horizontal-scroll-child horizontal-scroll-snapping-child">
      <items-slider
        :itemList="user.subscribed"
        :title="'subscribed'"
        :expand="expanded == 'subscribed'"
        :class="expanded == 'subscribed' ? 'expanded' : 'collapsed'"
        v-on:expand="expand('subscribed')"
      ></items-slider>
      <items-slider 
        :itemList="sellingItems"
        :title="'selling'"
        :expand="expanded == 'selling'"
        :class="expanded == 'selling' ? 'expanded' : 'collapsed'"
        v-on:expand="expand('selling')"
      ></items-slider>
    </div>
  </div>  
</template>
<script>
import profileCard from "../../components/profileCard.vue";
import recentActivity from "../../components/recentActivity.vue";
import itemsSlider from "../../components/itemsSlider.vue"
import wonItemList from "../../components/wonItemList.vue"

export default {
  components: {
    profileCard,
    recentActivity,
    itemsSlider,
    wonItemList
  },
  props: {
    user: Object,
    sellingItems: Array,
    wonItems: Array
  },
  data () {
    return {
      expanded: 'subscribed'
    }
  },
  methods: {
    expand (key) {
      this.expanded = key
    },
    change () {
      this.expanded = this.expanded == 'subscribed' ? 'selling' : 'subscribed'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../vars.scss";
  #tablet-profile-container{
    height: calc(100% - 40px);
  }
  #tablet-left{
    height: 100%;
    display: grid;
    grid-template-rows: calc(50% - 5px) calc(50% - 5px);
    grid-gap: 10px;
    width: 100%;
    margin-right: $xs-space;
  }
  #tablet-right{
    height: 100%;
    width: 100%;
    margin-left: $xs-space;
    .expanded {
      transition-delay: 100ms;
      height: calc(50%);
      transition: height 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
      margin-bottom: 20px;
    }
    .collapsed {
      transition-delay: 100ms;
      transition: height 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
      height: calc(50% - #{$lg-space} - #{$lg-space});
      margin-bottom: 20px;
    }

  }
</style>
