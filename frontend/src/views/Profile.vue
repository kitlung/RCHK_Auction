<template>
  <div class="full-size">
    <side-menu ref="sideMenu" v-if="$mq != 'mobile-landscape'"></side-menu>
    <menu-button-nav-bar v-if="$mq != 'mobile-landscape'"></menu-button-nav-bar>

    <profile-laptop
      :user="returnUser"
      :sellingItems="sellingItems"
      :wonItems="wonItems"
      v-if="inited && returnUser && ($mq == 'laptop' || $mq == 'tablet-landscape')"
    ></profile-laptop>

    <profile-mobile
      :user="returnUser"
      :sellingItems="sellingItems"
      :wonItems="wonItems"
      v-if="inited && returnUser && $mq == 'mobile-portrait'"
    ></profile-mobile>

    <profile-tablet
      :user="returnUser"
      :sellingItems="sellingItems"
      :wonItems="wonItems"
      v-if="inited && returnUser && $mq == 'tablet-portrait'"
    ></profile-tablet>

    <unsupport v-if="$mq == 'mobile-landscape'"></unsupport>
  </div>
</template>
<script>
import sideMenu from "../components/sideMenu.vue";
import menuButtonNavBar from "../components/menuButtonNavBar.vue";

import profileLaptop from "../subviews/profile/ProfileLaptop.vue";
import profileMobile from "../subviews/profile/ProfileMobile.vue";
import profileTablet from "../subviews/profile/ProfileTablet.vue";
import unsupport from "./Unsupport.vue";

export default {
  components: {
    sideMenu,
    menuButtonNavBar,
    profileLaptop,
    profileMobile,
    profileTablet,
    unsupport
  },
  computed: {
    returnUser() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      inited: false,
      sellingItems: [],
      wonItems: []
    };
  },
  created() {
    this.INITIALIZE().then(() => {
      Promise.all([
        this.getSellingItems(),
        this.getWonItems(),
        ]).then(() => {
        this.inited = true;
      });
    });
  },
  methods: {
    getSellingItems() {
      return new Promise((resolve, reject) => {
        this.sellingItems = this.$store.state.itemList.filter(
          item => item.created_by === this.$store.state.user.userID
        );
        resolve();
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
              this.wonItems = res.data.Request;
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
