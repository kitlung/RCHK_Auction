<template>
  <div class="full-size">
    <side-menu ref="sideMenu"></side-menu>
    <menu-button-nav-bar></menu-button-nav-bar>

    <your-items-laptop 
      :soldItems="soldItems"
      :wonItems="wonItems"
      :expiredItems="expiredItems"
      :sellingItems="sellingItems"
    ></your-items-laptop>

  </div>
</template>
<script>
import sideMenu from "../components/sideMenu.vue";
import menuButtonNavBar from "../components/menuButtonNavBar.vue";

import yourItemsLaptop from "../subviews/yourItems/YourItemsLaptop.vue"

export default {
  components: {
    sideMenu,
    menuButtonNavBar,
    yourItemsLaptop,
  },
  created() {
    this.INITIALIZE().then(() => {
      Promise.all([
        this.getSellingItems(),
        this.getExpiredItems(),
        this.getWonItems(),
        this.getSoldItems()
      ]).then(() => {
        this.inited = true;
      })
      .catch(() => {
        this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Unable to get your items. Please refresh and try again.'})
      })
    });
  },
  data() {
    return {
      inited: false,
      sellingItems: [],
      wonItems: [],
      expiredItems: [],
      soldItems: []
    };
  },
  methods: {
    getSellingItems () {
      return new Promise((resolve, reject) => {
        this.sellingItems = this.$store.state.itemList.filter(
          item => item.created_by === this.$store.state.user.userID
        );
        resolve();
      });
    },
    getExpiredItems () {
      return new Promise((resolve, reject) => {
        this.$http
          .get("/api/auction/v1/items/expire")
          .then(res => {
            if(res.data.Error){
              this.$notify({group: 'foo',type: 'error',title: 'Error.',text: res.data.Message})
              reject(res.data.Message)
            }else{
              this.expiredItems = res.data.Request.filter(ele => ele.created_by == this.$store.state.user.userID && ele.winner == '');
              resolve()
            }
          })
          .catch(err => {
            this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
            reject(err);
          });
      });
    },
    getWonItems () {
      return new Promise((resolve, reject) => {
        this.$http
          .get("/api/auction/v1/items/win/" + this.$store.state.user.userID)
          .then(res => {
            if(res.data.Error){
              this.$notify({group: 'foo',type: 'error',title: 'Error.',text: res.data.Message})
              reject(res.data.Message)
            }else{
              this.wonItems = res.data.Request
              resolve()
            }
          })
          .catch(err => {
            this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
            reject(err);
          });
      });
    },
    getSoldItems () {
      return new Promise((resolve, reject) => {
        this.$http
          .get("/api/auction/v1/items/sold/" + this.$store.state.user.userID)
          .then(res => {
            if(res.data.Error){
              this.$notify({group: 'foo',type: 'error',title: 'Error.',text: res.data.Message})
              reject(res.data.Message)
            }else{
              this.soldItems = res.data.Request
              resolve()
            }
          })
          .catch(err => {
            this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
            reject(err);
          });
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../vars.scss";
</style>
