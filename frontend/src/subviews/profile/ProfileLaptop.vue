<template>
  <div id="laptop-profile-container">
    <div id="laptop-profile-container-left">
      <div>
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
    <div id="laptop-profile-container-right">
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
import profileCard from '../../components/profileCard.vue'
import recentActivity from '../../components/recentActivity.vue'
import itemsSlider from '../../components/itemsSlider.vue'
import wonItemList from '../../components/wonItemList.vue'

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
  #laptop-profile-container{
    height: calc(100% - 48px);
    display: grid;
    grid-template-columns: calc((100% - 20px) / 2) calc((100% - 20px) / 2);
    grid-gap: $lg-space;
    margin-top: $sm-space;
  }
  #laptop-profile-container-left{
    display: grid;
    grid-template-rows: calc((100% - 20px) / 2) calc((100% - 20px) / 2);
    grid-gap: $lg-space;
    max-height: 725px;
  }
  #laptop-profile-container-right{
    > div:last-child {
      margin-bottom: 0px;
    } 
    .expanded {
      transition-delay: 100ms;
      height: calc(66%);
      transition: height 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
      margin-bottom: 20px;
    }
    .collapsed {
      transition-delay: 100ms;
      transition: height 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
      height: calc(34% - #{$lg-space});
      margin-bottom: 20px;
    }
  }
</style>
