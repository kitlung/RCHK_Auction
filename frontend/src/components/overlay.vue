<template>
  <div id="overlay" class="flex-box-parent">
    <div id="overlay-msg-box" class="card flex-box-parent" v-bind:class="[className]">
      <v-icon>{{icon}}</v-icon>
      <label id="overlay-msg-title">{{title}}</label>
      <label id="overlay-msg-msg">{{msg}}</label>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    msg: String,
    icon: String,
    className: String,
    title: String
  },
  mounted () {
    setTimeout(() => {
      this.$router.push('/')
    }, 3000)
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #overlay{
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0; 
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: $z-overlay;
  }

  #overlay-msg-box{
    display: grid;
    grid-template-rows: 40% 30% 30%;
    position: relative;
    text-align: center;
    i{
      color: $pri;
      font-size: 2.5em;
    }
    &.danger{
      #overlay-msg-msg{
        color: $danger-light;
      }
    }
  }

  #overlay-msg-title{
    color: $pri-dark;
    font-size: 1.5em;
  }
  #overlay-msg-msg{
    font-size: 1em;
  }

  @media #{$laptop} {
    #overlay-msg-box{
      height: 30vh;
      width: 30vw;
      font-size: 24px;
    }
  }

  @media #{$mobile-portrait} {
    #overlay-msg-box{
      height: 30vh;
      width: 50vw;
      font-size: 18px;
    }
  }

  @media #{$tablet-portrait} {
    #overlay-msg-box{
      height: 25vh;
      width: 40vw;
      font-size: 24px;
    }
  }

  @media #{$tablet-landscape} {
    #overlay-msg-box{
      height: 30vh;
      width: 40vw;
      font-size: 24px;
    }
  }

  
</style>
