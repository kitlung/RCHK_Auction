<template>
  <div id="mobile-profile-container">
    <transition name="fade">
      <div class="mobile-profile-card" v-if="selected == 'account'">
        <profile-card
          :user="user"
          :noOfWin="wonItems.length"
          :noOfSellingItems="sellingItems.length"
          v-if="user.userID"
        ></profile-card>
      </div>
    </transition>

    <transition name="fade">
      <div class="mobile-profile-card" v-if="selected == 'activity'">
        <recent-activity :user="user" v-if="user.userID"></recent-activity>
      </div>
    </transition>

    <transition name="fade">
      <div class="mobile-profile-card" v-if="selected == 'subscribed'">
        <items-slider
          :itemList="user.subscribed"
          :title="'subscribed'"
          :expand="true"
        ></items-slider>
      </div>
    </transition>

    <transition name="fade">
      <div class="mobile-profile-card" v-if="selected == 'selling'">
        <items-slider
          :itemList="sellingItems"
          :title="'selling'"
          :expand="true"
        ></items-slider>
      </div>
    </transition>

    <div id="mobile-nav-bar">
      <div :class="{'selected' : selected == 'account'}" @click="switchCard('account')">
        <v-icon>account_box</v-icon>
      </div>
      <div :class="{'selected' : selected == 'activity'}" @click="switchCard('activity')">
        <v-icon>attach_money</v-icon>
      </div>
      <div :class="{'selected' : selected == 'subscribed'}" @click="switchCard('subscribed')">
        <v-icon>bookmark</v-icon>
      </div>
      <div :class="{'selected' : selected == 'selling'}" @click="switchCard('selling')">
        <v-icon>store</v-icon>
      </div>
    </div>
  </div>
</template>
<script>
import profileCard from "../../components/profileCard.vue";
import recentActivity from "../../components/recentActivity.vue";
import itemsSlider from "../../components/itemsSlider.vue"

export default {
  components: {
    profileCard,
    recentActivity,
    itemsSlider,
  },
  props: {
    user: Object,
    sellingItems: Array,
    wonItems: Array
  },
  data() {
    return {
      selected: "account"
    };
  },
  methods: {
    switchCard(nextCard) {
      if (this.selected != nextCard) {
        this.selected = ""; // make sure current card is out before next card in
        setTimeout(() => {
          this.selected = nextCard;
        }, 300); // this time = leave-active time
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../vars.scss";
#mobile-nav-bar {
  height: 42px;
  margin-top: $xs-space;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  div {
    &.selected {
      border-bottom: 1px solid $pri-light;
    }
    i {
      color: $pri-light;
      font-size: 36px;
      width: 100%;
    }
  }
}

#mobile-profile-container {
  overflow: auto;
  height: calc(100% - 32px);
}
.mobile-profile-card {
  height: calc(100% - 52px);
  width: 100%;
}

.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
