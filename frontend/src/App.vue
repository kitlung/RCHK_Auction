<template>
  <v-container fluid id="app">
    <router-view/>
    <notifications group="foo" />
  </v-container>
</template>

<style>
  @import "../node_modules/animate.css/animate.min.css";

  #app {
    height: 100vh;
    width: 100vw;
    font-family: 'Montserrat', sans-serif;
    background-image: url("./assets/bg.jpg");
    background-size: cover;
  }
</style>

<script>
export default {
  name: 'App',
}
</script>
