<template>
  <div id="unsupport-container" class="full-size center-parent">
    <div class="center-child error-page-content-container">
      <h1 class="error-page-title">Error</h1>
      <h3 class="error-page-subtitle">Unsupported Orientation</h3>
      <h4 class="error-page-text">Please use portrait mode on your phone for better experience.</h4>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="scss" scoped>
@import "../vars.scss";
#unsupport-container{
  height: calc(100vh - 36px);
}
</style>
