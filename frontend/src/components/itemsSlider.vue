<template>
  <div class="card" id="item-slider-container" v-if="itemList">
    <div id="subscribed-card-title" class="uppercase"><label>{{title}}</label></div>
    <transition name="fade" mode="out-in">
      <div class="horizontal-scroll-parent" id="item-slider" v-if="itemObjectList.length > 0 && expand" key="info">
        <div v-for="item in itemObjectList" v-bind:key="item.id" class="item-card-wrapper horizontal-scroll-child">
          <item-card :item='item'></item-card>
        </div>
      </div>
      <div id="open-btn-container" class="flex-box-parent" v-else key="btn">
        <button id="open-btn" class="pri-btn" @click="expandBtnClicked()">Open</button>
      </div>
    </transition>
  </div>
  <div class="card" v-else>
    <h1>No subscribed list</h1>
  </div>
</template>
<script>
import itemCard from './itemCard.vue'

export default {
  props: {
    itemList: Array,
    expand: Boolean,
    title: String
  },
  components: {
    itemCard
  },
  data () {
    return {
      itemObjectList: []
    }
  },
  watch: {
    itemList: {
      handler: 'refreshSubscribeList',
      immediate: true
    }
  },
  methods: {
    refreshSubscribeList () {
      if(this.itemList){
        this.itemObjectList = this.itemList.map(ele => {
          if(typeof ele === 'object' && ele !== null){
            return ele
          }else{
            var result = this.$store.getters.SEARCH_ITEM_WITH_ID(ele.toString())
            return result[0]
          }
        }).filter(item => item)
      }
    },
    expandBtnClicked () {
      this.$emit('expand')
    }
  },
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #item-slider-container{
    padding: $sm-space;
    overflow: auto;
  }

  #open-btn-container{
    margin-top: $md-space;
    height: calc(100% - 18px - 15px);
    #open-btn{
      height: 40px;
      width: 120px;
    }
  }

  ::-webkit-scrollbar {
    height: 0px;
    width: 0px;
    background: transparent;
  }

  .item-card-wrapper{
    margin: auto 10px;
    width: 285px;
    height: 90%;
    #item-card-container{
      box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.27) !important;
    }
  }

  #subscribed-card-title{
    height: 18px;
    font-size: 14px;
    color: $pri;
    text-align: center;
    width: 100%;
  }
  
  #item-slider{
    margin-top: $sm-space;
    height: calc(100% - 18px - 10px);
  }

  .fade-enter-active { // appear
    transition-delay: 200ms;
    transition: opacity 300ms;
  }
  .fade-leave-active { // disappear
    transition: opacity 100ms;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  @media #{$mobile-portrait} {
    #item-slider-container{
      height: 100%;
    }
  }

</style>
