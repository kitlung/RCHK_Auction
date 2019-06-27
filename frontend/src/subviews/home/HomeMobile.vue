<template>
  <div id="mobile-home-container">
    <div id="mini-item-card-collection-container" v-if="$mq == 'mobile-portrait'" class="item-card-collection-container">
      <div id="mini-item-card-collection-content" class="item-card-collection-content">
        <div class="mini-item-card-wrapper" v-for="i in Math.ceil(itemList.length / 2)">
          <mini-item-card :item='item' v-for="item in itemList.slice((i - 1) * 2, i * 2)" v-bind:key="item.id"></mini-item-card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import miniItemCard from '../../components/miniItemCard.vue'
  import homeTab from '../../components/homeTab.vue'

  export default {
    props:{
      itemList: {
        type: Array
      }
    },
    components: {
      miniItemCard,
      homeTab
    },
    data () {
      return {
      }
    },
    methods: {
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../vars.scss";

  @media #{$mobile-portrait}{
    #mobile-home-container{
      height: calc(100% - 56px);
      #mini-item-card-collection-container{
        margin-top: $lg-space;
        height: 100%;
      }
      .mini-item-card-wrapper{
        display: grid;
        grid-template-columns: calc(50% - 5px)  calc(50% - 5px);
        grid-gap: $sm-space;
        height: 200px;
        width: 310px;
        margin: 0 auto $sm-space auto;
        &:first-child{
          margin-top: $md-space;
        }
      }
    }
  }
  
</style>
