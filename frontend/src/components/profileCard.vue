<template>
  <div id="name-card-container" class="card">
    <div id="name-card-title" class="uppercase"><label>Profile</label></div>
    <div id="name-card-content">
      <div class="flex-box-parent">
        <div id="name-card-img-container">
          <img :src="'/api/rcapps/photo/get-image/' + this.user.userID" />
        </div>
      </div>
      <div id="name-card-info" style="display: grid;">
        <div class="center-parent">
          <label class="uppercase vertical-center-child">Id</label>
          <label class="vertical-center-child">{{this.user.userID}}</label>
        </div>
        <div class="center-parent">
          <label class="uppercase vertical-center-child">Name</label>
          <label class="vertical-center-child">{{this.user.name}}</label>
        </div>
        <div class="center-parent">
          <label class="uppercase vertical-center-child"># auctions won</label>
          <label class="vertical-center-child">{{noOfWin}}</label>
        </div>
        <div class="center-parent">
          <label class="uppercase vertical-center-child">Selling Items</label>
          <label class="vertical-center-child">{{noOfSellingItems}}</label>
        </div>        
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: Object,
    noOfWin: Number,
    noOfSellingItems: Number
  },
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #name-card-container{
    height: 100%;
    width: 100%;
  }

  #name-card-title{
    height: 18px;
    font-size: 14px;
    color: $pri;
    text-align: center;
    width: 100%;
  }

  #name-card-img-container{
    display: inline-block;
    position: relative;
    width: 200px;
    height: 200px;
    overflow: hidden;
    border-radius: 50%;
    img{
      width: 100%;
    }
  }

  #name-card-info{
    font-size: 18px;
    div{
      border-bottom: 1px solid $pri-light;
      &:last-child{
        border-bottom: 0;
      }
      label{
        &:first-child{
          color: $pri;
        }
        &:last-child{
          right: 0;
        }
      }
    }
  }

  @media #{$tablet-landscape} {
    #name-card-container{
      padding: $lg-space;
      margin-bottom: $lg-space;
    }
    #name-card-content{
      height: calc(100% - 18px);
      display: grid;
      grid-template-columns: calc(40% - 10px) 60%;
      grid-gap: 10px;
    }
  }

  @media #{$tablet-portrait}{
    #name-card-container{
      padding: $lg-space;
    }
    #name-card-content{
      height: calc(100% - 18px);
      display: grid;
      grid-template-columns: calc(40% - 10px) 60%;
      grid-gap: 10px;
    }
  }


  @media #{$laptop} {
    #name-card-container{
      padding: $lg-space;
      margin-bottom: $lg-space;
    }
    #name-card-content{
      height: calc(100% - 18px);
      display: grid;
      grid-template-columns: 40% 60%;
    }
  }

  @media #{$mobile-portrait}{
    #name-card-container{
      padding: $sm-space;
    }
    #name-card-content{
      padding: 0 $xs-space;
      height: calc(100% - 18px);
      display: grid;
      grid-template-rows: 40% 60%;
    }
  }
</style>
