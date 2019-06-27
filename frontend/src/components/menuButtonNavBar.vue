<template>
  <div class="upper-nav-bar">
    <button @click="toggleSideMenu()" class="menu-btn"><i class="material-icons">view_list</i></button>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  methods: {
    toggleSideMenu () {
      this.$store.dispatch('TOGGLE_SIDEMENU')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";
  
  .menu-btn{
    color: $pri-light;
    outline: none;
    margin: auto 0;
    height: 36px;
    i{
      font-size: 36px;
    }
  }
  
  @media #{$mobile-portrait}{
    .menu-btn{
      height: 24px;
      i{
        font-size: 24px;
      }
    }
  }

</style>
