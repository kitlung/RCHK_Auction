<!-- Best size h:400px w:300px -->
<template>
  <div id="item-card-container" class="card" @click="cardClicked()">
    <div id="item-card-star-container">
      <v-icon v-bind:class="{'subscribed': item.subscribed}" @click.stop="starClicked()">star</v-icon>
    </div>
    <div id="item-card-id-container"><label>{{shortenID}}</label></div>
    <div id="item-card-img-container"><img :src="'/api/auction/v1/image/' + item.imageList[0]"></div>
    <div id="item-card-info-container">
      <div class="item-card-info-subcontainer">
        <div><label class="item-card-info-title uppercase">Name</label></div>
        <div class="item-card-info-wrapper"><label class="item-card-info">{{item.name}}</label></div>
      </div>
      <div class="item-card-info-subcontainer">
        <label class="item-card-info-title uppercase">Price</label>
        <div class="item-card-info-wrapper"><label class="item-card-info">${{item.price}}</label></div>
      </div>
      <div class="item-card-info-subcontainer">
        <label class="item-card-info-title uppercase">Time</label>
        <clock :endTime="item.end_at" style="font-size: 14px;" v-on:ended="end"></clock>
      </div>
      <div class="item-card-info-subcontainer">
        <label class="item-card-info-title uppercase">Bidders</label>
        <div class="item-card-info-wrapper"><label class="item-card-info">{{item.bidders}}</label></div>
      </div>
    </div>
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
  },
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #item-card-container{
    position: relative;
    padding: $sm-space;
    display: grid;
    grid-gap: $sm-space;
    grid-template-rows: calc(15% - 20px) 50% 35%;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  #item-card-star-container{
    i{
      cursor: pointer;
      font-size: 24px;
      color: $pri-light;
      &.subscribed{
        color: $star;
      }
    }
  }

  #item-card-id-container{
    position: absolute;
    top: $sm-space;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
    font-size: 18px;
    color: $pri-dark;
    font-size: 14px;
    text-align: center;
  }


  #item-card-img-container{
    img{
      max-height: 100%;
      max-width: 100%;
      display: block;
      margin: auto;
    }
  }
  #item-card-info-container{
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    .item-card-info-subcontainer{
      display: grid;
      text-align: center;
      padding: $sm-space;
      position: relative;

      &:nth-child(1) ::after{
        content:""; 
        background: $pri-light; 
        position: absolute; 
        right: 0; 
        top: 0;
        height: 80%; 
        width: 0.5px;
      }
      &:nth-child(1) ::before{
        content:""; 
        background: $pri-light; 
        position: absolute; 
        bottom: 0;
        left: 0;
        width: 90%; 
        height: 0.5px;
      }
      &:nth-child(2) ::after{
        content:""; 
        background: $pri-light; 
        position: absolute; 
        top: 0; 
        left: 0; 
        height: 80%; 
        width: 0.5px;
      }
      &:nth-child(2) ::before{
        content:""; 
        background: $pri-light; 
        position: absolute; 
        bottom: 0;
        right: 0;
        width: 90%; 
        height: 0.5px;
      }
      &:nth-child(3) ::after{
          content:""; 
          background: $pri-light; 
          position: absolute; 
          bottom: 0; 
          right: 0;
          height: 80%; 
          width: 0.5px;
      }
      &:nth-child(3) ::before{
          content:""; 
          background: $pri-light; 
          position: absolute; 
          top: 0; 
          left: 0;
          height: 0.5px; 
          width: 90%;
      }
      &:nth-child(4) ::after{
          content:""; 
          background: $pri-light; 
          position: absolute; 
          bottom: 0; 
          left: 0; 
          height: 80%; 
          width: 0.5px;
      }
      &:nth-child(4) ::before{
          content:""; 
          background: $pri-light; 
          position: absolute; 
          top: 0; 
          right: 0; 
          height: 0.5px; 
          width: 90%;
      }
    }
  }

  .item-card-info-title{
    color: $pri;
    font-weight: 700;
    font-size: 14px;
  }

  .item-card-info-wrapper{
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
  }

  .item-card-info{
    color: $pri-dark;
    &.count-down{
      color: $danger-light;
    }
  }
</style>
