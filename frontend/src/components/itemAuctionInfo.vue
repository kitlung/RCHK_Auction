<template>
  <div id="auction-info-container">
    <div id="auction-time-container" class="auction-container">
      <div class="auction-info-title uppercase"><label>Remaining Time</label></div>
      <clock :endTime="item.end_at" style="font-size: 48px;" v-on:ended="emitEnd"></clock>
      <div id="auction-clock-description" class="uppercase">
        <label>Day</label>
        <label>Hour</label>
        <label>Min</label>
        <label>Sec</label>
      </div>
      <div id="auction-start-end">
        <div class="flex-box-parent"><label>Start:</label><label>{{start}}</label></div>
        <div class="flex-box-parent"><label>End:</label><label>{{end}}</label></div>
      </div>
    </div>
    <div id="auction-price-container" class="auction-container">
      <div class="auction-info-title uppercase"><label>Current Price</label></div>
      <div id="auction-price"><label>${{item.price}}</label></div>
      <auction-button :item="item"></auction-button>
    </div>
    <div id="bid-records-container" class="auction-container">
      <div class="auction-info-title uppercase"><label>Your Bid Records</label></div>
      <div v-for="bidRecord in bidRecords" :key="bidRecord.id" class="bid-record">
        <label>{{bidRecord.created_at}}</label>
        <label>${{bidRecord.price}}</label>
      </div>
    </div>
  </div>
</template>
<script>
import clock from './clock.vue'
import auctionButton from './auctionButton.vue'

export default {
  props:{
    item: {
      type: Object
    }
  },
  components: {
    clock,
    auctionButton
  },
  data () {
    return {
      bidRecords: [],
      start: '',
      end: ''
    }
  },
  created () {
    this.parseItemStartEndTime()
  },
  watch: {
    item: {
      handler: 'getBidRecords',
      immediate: true
    }
  },
  methods: {
    getBidRecords () {
      this.$store.dispatch('FETCH_BID_RECORDS',[localStorage.getItem('weblogin'), this.item.id])
        .then(() => {
          var temp = this.$store.getters.GET_BID_RECORDS
          if(temp && temp.length > 0){
            this.bidRecords = temp
          }
        })
    },
    parseItemStartEndTime () {
      this.start = this.moment(this.item.created_at).format('YYYY-MM-DD HH:mm:ss')
      this.end = this.moment(this.item.end_at).format('YYYY-MM-DD HH:mm:ss')
    },
    emitEnd () {
      this.$emit('ended')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #auction-info-container{
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    display: grid;
    font-size: 14px;
  }

  .auction-info-title{
    font-size: 14px;
    color: $pri;
    text-align: center;
    width: 100%;
  }

  .auction-container{
    padding: $sm-space;
    &:not(:last-child){
      border-bottom: 1px solid $pri-light;
    }
  }


  #auction-time-container{
    #auction-clock-description{
      display: grid;
      width: 100%;
      grid-template-columns: repeat(4,1fr);
      text-align: center;
      color: $pri;
    }
    #auction-start-end{
      display: grid;
      > div{
        label{
          width: 100%;
          &:first-child{
            text-align: left;
          }
          &:last-child{
            text-align: right;
          }
        }
      }
    }
  }

  #auction-price-container{
    #auction-price{
      width: 100%;
      text-align: center;
      color: $pri-dark;
      margin-bottom: $sm-space;
    }
  }

  #bid-records-container{
    .bid-record{
      width: 100%;
      display: flex;
      border-bottom: 1px solid $pri-light;
      padding: $sm-space;
      label{
        width: 100%;
        &:first-child{
          text-align: left;
        }
        &:last-child{
          text-align: right;
        }
      }
      &:last-child{
        border-bottom: 0px;
      }
    }
  }

  @media #{$laptop} {
    .auction-info-title{
      margin-bottom: $md-space;
    }
    #auction-clock-description{
      margin-bottom: $md-space;
    }
    #auction-start-end{
      grid-gap: $sm-space;
    }
    #auction-info-container{
      padding: $lg-space;
      grid-template-rows: 30% 30% 40%;
    }
    #auction-price{
      font-size: 48px;
    }
  }

  @media #{$mobile-portrait} {
    .auction-info-title{
      margin-bottom: $sm-space;
    }
    #auction-clock-description{
      margin-bottom: $md-space;
    }
    #auction-start-end{
      grid-gap: $sm-space;
    }
    #auction-info-container{
      padding: $sm-space;
      grid-template-rows: 34% 27% 39%;
    }
    #auction-price{
      font-size: 36px;
    }
  }

  @media #{$tablet-portrait} {
    #auction-start-end{
      font-size: 20px;
      grid-gap: $lg-space;
    }
    #auction-clock-description{
      margin-bottom: $lg-space;
    }
    .auction-info-title{
      margin-bottom: $lg-space;
    }
    #auction-info-container{
      padding: $lg-space;
      grid-template-rows: 30% 30% 40%;
    }
    #auction-price{
      font-size: 48px;
    }
  }

  @media #{$tablet-landscape} {
    .auction-info-title{
      margin-bottom: $md-space;
    }
    #auction-clock-description{
      margin-bottom: $md-space;
    }
    #auction-start-end{
      grid-gap: $sm-space;
    }
    #auction-info-container{
      padding: $lg-space;
      grid-template-rows: 30% 30% 40%;
    }
    #auction-price{
      font-size: 48px;
    }
  }

</style>
