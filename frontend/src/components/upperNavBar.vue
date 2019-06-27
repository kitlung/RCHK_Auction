<template>
  <div class="upper-nav-bar">
    <button @click="toggleSideMenu()" class="menu-btn">
      <i class="material-icons">view_list</i>
    </button>
    <input class="search-bar" placeholder="Search" v-model="filter">

    <v-menu offset-y content-class="dropdown-menu" transition="slide-y-transition">
      <v-btn flat slot="activator" color="#D4E3FC" large v-if="$mq != 'mobile-portrait'">
        <v-icon>filter_list</v-icon>
      </v-btn>
      <v-btn flat slot="activator" color="#D4E3FC" small v-if="$mq == 'mobile-portrait'">
        <v-icon>filter_list</v-icon>
      </v-btn>
      <v-card>
        <v-list dense>
          <v-list-tile
            v-for="sortKey in sortings"
            :key="sortKey.text"
            class="sorting-list"
            v-bind:class="{sorted : currentKey == sortKey.text}"
            @click="sortBy(sortKey)"
          >
            <v-list-tile-title v-text="sortKey.text"/>
            <v-icon v-if="currentKey == sortKey.text">done</v-icon>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
export default {
  computed: {
    filter: {
      get() {
        return this.$store.state.filterKeyWord;
      },
      set(value) {
        this.$store.dispatch("CHANGE_FILTER_KEYWORD", value);
      }
    }
  },
  data() {
    return {
      sortings: [
        { text: "Name (A-Z)", val: "nameAsc" },
        { text: "Name (Z-A)", val: "nameDesc" },
        { text: "Popularity (High)", val: "popularityDesc" },
        { text: "Popularity (Low)", val: "popularityAsc" },
        { text: "Price (High)", val: "priceDesc" },
        { text: "Price (Low)", val: "priceAsc" },
        { text: "Remaining Time (Long)", val: "timeDesc" },
        { text: "Remaining Time (Short)", val: "timeAsc" }
      ],
      currentKey: "Name (A-Z)"
    };
  },
  created () {
    this.$emit("sort_items",'nameAsc');
  },
  methods: {
    toggleSideMenu() {
      this.$store.dispatch("TOGGLE_SIDEMENU");
    },
    sortBy(key) {
      this.currentKey = key.text;
      this.$emit("sort_items",key.val);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../vars.scss";
.sorting-list {
  cursor: pointer;
}
.sorted {
  color: $pri;
}

.menu-btn{
  color: $pri-light;
  outline: none;
  margin: auto 0;
  height: 36px;
  i{
    font-size: 36px;
  }
}

.upper-nav-bar{
  display: flex;
  height: 48px;
  justify-content: space-between;
  .search-bar{
    border-bottom: 1px solid $pri-light;
    margin: auto;
    outline: none;
    color: $pri-light;
    width: 70%;
    padding: 6px;
    font-size: 29px;
    &::placeholder{
      color: $pri-light;
    }
  }
}


@media #{$mobile-portrait}{
  .menu-btn{
    height: 24px;
    i{
      font-size: 24px;
    }
  }
  
  .upper-nav-bar{
    height: 36px;
    .search-bar{
      font-size: 18px;
      width: 50%;
    }
  }
}

</style>
