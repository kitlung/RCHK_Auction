<template>
  <div class="card" id="item-slider-container" v-if="itemList">
    <div id="subscribed-card-title" class="uppercase"><label>{{title}}</label></div>
    <transition name="fade" mode="out-in">
      <div class="horizontal-scroll-parent" id="item-slider" v-if="expand" key="info">
        <ul class="won-list">
          <li v-for="(item, index) in itemList" v-bind:key="`${index}-${item.id}`" class="won-list-item">
            <label>{{item.name}}</label>
            <label>${{item.price}}</label>
            <label>Done</label>
          </li>
        </ul>
      </div>
      <div id="open-btn-container" class="flex-box-parent" v-else key="btn">
        <button id="open-btn" class="pri-btn" @click="expandBtnClicked()">Open</button>
      </div>
    </transition>
  </div>
  <div class="card" v-else>
    <h1>No items</h1>
  </div>
</template>
<script>

export default {
  props: {
    itemList: Array,
    expand: Boolean,
    title: String
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
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

  .won-list{
    padding: 0;
    margin-top: $sm-space;
    width: 100%;
    overflow: auto;
    .won-list-item{
      color: $pri-dark;
      display: grid;
      list-style: none;
      margin: 0;
      grid-template-columns: 35% 45% 20%;
      padding: $sm-space $sm-space;
      > label{
        text-align: left;
        &:last-child{
          text-align: right;
        }
      }
      label > a {
        color: $pri-dark;
        text-decoration: none;
      }
      &:nth-child(odd){
        background-color: $pri-light;
      }
    }
  }

  @media #{$mobile-portrait}{
    #item-slider-container{
      height: 100%;
    }
  }

</style>
