<template>
  <div id="auction-button-container">
    <div id="auction-price-container" class="flex-box-parent">
      <button class="square-btn flex-box-parent" :class="{'disabled': bidPrice == minPrice}" @click="decreasePrice()"><v-icon>remove</v-icon></button>
      <label>${{bidPrice}}</label>
      <button class="square-btn flex-box-parent" @click="increasePrice()"><v-icon>add</v-icon></button>
    </div>
    <div></div>
    <div>
      <button id="bid-button" @click="bid()" class="uppercase pri-btn">bid</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  },
  data () {
    return {
      minPrice: 0,  // minimum bid price
      bidPrice: 0   // bid price that user offers
    }
  },
  watch: {
    item: {
      handler: 'initMinBidPrice',
      immediate: true
    }
  },
  methods: {
    increasePrice () {
      this.bidPrice = parseInt(this.bidPrice) + parseInt(this.item.price_interval)
    },
    decreasePrice () {
      if(this.bidPrice > this.minPrice){
        this.bidPrice = parseInt(this.bidPrice) - parseInt(this.item.price_interval)
      }
    },
    initMinBidPrice () {
      this.minPrice = parseInt(this.item.price) + parseInt(this.item.price_interval)
      this.bidPrice = this.minPrice
    },
    async bid () {
      var payload = {
        'user_id': localStorage.getItem('weblogin'),
        'item_id': this.item.id,
        'price': this.bidPrice,
      }
      await this.GET_APP_PERMISSION()
        .then(res => {
          this.$http.put('/api/auction/v1/bid',payload)
            .then(res => {
              if(res.data.Error){
                this.$notify({group: 'foo',type: 'error',title: 'Error.',text: res.data.Message})
              }else{
                this.$notify({group: 'foo',type: 'success',title: 'Success.'})
              }
            })
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #auction-button-container{
    display: grid;
    #auction-price-container{
      *{
        margin: auto;
      }
    }
  }

  .square-btn{
    border: 1px solid $pri;
    outline: none;
    i{
      font-size: 14px;
      color: $pri;
    }

    &.disabled{
      border: 1px solid $pri-light;
      i{
        color: $pri-light;
      }
    }
  }
  label{
    font-size: 35px;
  }
  #bid-button{
    height: 100%;
    width: 100%;
  }

  @media #{$laptop} {
    #auction-button-container{
      grid-template-columns: 40% 20% 40%;
      height: 60px;
    }
    #auction-price-container{
      .square-btn{
        height: 40px;
        width: 40px;
      }
    }
  }
  
  @media #{$mobile-portrait} {
    #auction-button-container{
      grid-template-columns: 45% 10% 45%;
      height: 40px;
    }
    #auction-price-container{
      .square-btn{
        height: 30px;
        width: 30px;
      }
      label{
        font-size: 24px;
      }
    }
  }

  @media #{$tablet-portrait} {
    #auction-button-container{
      grid-template-columns: 40% 20% 40%;
      height: 60px;
    }
    #auction-price-container{
      .square-btn{
        height: 40px;
        width: 40px;
      }
      label{
        font-size: 36px;
      }
    }
  }

  @media #{$tablet-landscape} {
    #auction-button-container{
      grid-template-columns: 40% 20% 40%;
      height: 60px;
    }
    #auction-price-container{
      .square-btn{
        height: 40px;
        width: 40px;
      }
    }
  }

</style>
