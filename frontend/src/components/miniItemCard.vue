<template>
  <div id="mini-item-card-container" @click="cardClicked()">
    <div id="mini-item-card-star-container">
      <v-icon v-bind:class="{'subscribed': item.subscribed}" @click.stop="starClicked()">star</v-icon>
    </div>
    <div id="mini-item-card-img-container"><img :src="'/api/auction/v1/image/' + item.imageList[0]"></div>
    <div id="mini-item-card-info-container">
      <div class="mini-item-card-info-wrapper flex-box-parent">
        <label class="mini-item-card-info">{{shortenID}}</label>
      </div>
      <div class="mini-item-card-info-wrapper flex-box-parent">
        <label class="mini-item-card-info">{{item.name}}</label>
      </div>
      <div class="mini-item-card-info-wrapper flex-box-parent">
        <label class="mini-item-card-info">${{item.price}}</label>
      </div>
    </div>
    <clock :endTime="item.end_at" style="display: none;" v-on:ended="end"></clock>
    <h1 v-if="ended" class="end-logo">ENDED</h1>
  </div>
</template>
<script>
import clock from './clock.vue'

export default {
  props:{
    item: {
      type: Object
    }
  },
  components: {
    clock
  },
  data () {
    return {
      shortenID: '',
      ended: false
    }
  },
  created () {
    this.shortenID = this.item.id.split('-')[0]
  },
  methods: {
    starClicked () {
      if(!this.ended){
        this.TOGGLE_SUBSCRIPTION(this.item.id)
      }
    },
    cardClicked () {
      if(!this.ended){
        this.$router.push('/item/'+this.item.id)
      }
    },
    end () {
      this.ended = true
    }
  }

}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #mini-item-card-container{
    border-radius: 5px;
    background-color: #fff;
    padding: $xs-space;
    display: grid;
    grid-gap: $xs-space;
    grid-template-rows: 50% calc(50% - 5px);
    width: 100%;
    height: 100%;
    box-shadow: 3px 3px 20px 3px rgba(0,0,0,0.25);
    position: relative;
  }
  #mini-item-card-star-container{
    position: absolute;
    top: $xs-space;
    left: $xs-space;
    z-index: $z-star-button;
    *{
      font-size: 16px;
      color: $pri-light;
      &.subscribed{
        color: $star;
      }
    }
  }
  #mini-item-card-img-container{
    img{
      max-height: 100%;
      max-width: 100%;
      display: block;
      margin: auto;
    }
  }
  #mini-item-card-info-container{
    display: grid;
    grid-template-rows: 33% 33% 33%;
  }

  .mini-item-card-info-wrapper{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
  }

  .mini-item-card-info{
    color: $pri-dark;
    overflow: auto;
    text-overflow: ellipsis;
  }
</style>
