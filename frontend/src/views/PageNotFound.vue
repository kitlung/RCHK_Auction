<template>
  <div class="full-size center-parent">
    <div class="center-child error-page-content-container">
      <h1 class="error-page-title">404</h1>
      <h3 class="error-page-subtitle">Page Not Found</h3>
      <h4 class="error-page-text">Redirecting you to home page.</h4>
    </div>
  </div>
</template>
<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$router.push('/login')
    },3000)
  }
}
</script>
<style lang="scss" scoped>
@import "../vars.scss";
</style>
