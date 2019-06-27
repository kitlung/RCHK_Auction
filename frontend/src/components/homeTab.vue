<template>
  <div id="mobile-home-title" class="home-title">
    <label class="selected-title">Featured</label>
    <label class="">Recent</label>
    <label class="">Ending soon</label>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>
@import "../vars.scss";

.home-title{
  padding: $md-space;
  display: inline-block;
  overflow-x: auto;
  width: 100%;
  height: 80px;
  label{
    color: $pri-light;
    margin: 0 $md-space;
    font-size: 18px;
    &.selected-title{
      color: #fff;
      position: relative;
      font-size: 36px;
    }
  }
}

@media #{$mobile-portrait}{
  .home-title{
    height: 60px;
    label{
      font-size: 14px;
      margin: 0 $sm-space;
      &.selected-title{
        font-size: 24px;
      }
    }
  }
}
</style>
