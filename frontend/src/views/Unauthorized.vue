<template>
  <div class="full-size center-parent">
    <div class="center-child error-page-content-container">
      <h1 class="error-page-title">403</h1>
      <h3 class="error-page-subtitle">Access Denied</h3>
      <h4 class="error-page-text">You don't have permission to access this page.<br> Redirecting you to home page.</h4>
    </div>
  </div>
</template>
<script>
export default {
  mounted () {
    localStorage.removeItem('jwtKey')
    localStorage.removeItem('user')
    localStorage.removeItem('weblogin')
    setTimeout(() => {
      this.$router.push('/login')
    },3000)
  }
}
</script>
<style lang="scss" scoped>
@import "../vars.scss";
</style>
