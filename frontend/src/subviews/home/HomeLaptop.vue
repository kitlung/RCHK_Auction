<template>
    <div id="laptop-home-container">

      <div id="item-card-collection-container" class="item-card-collection-container">
        <div id="item-card-collection-content" class="item-card-collection-content">
          <div class="item-card-wrapper" v-for="i in Math.ceil(itemList.length / 4)">
            <item-card :item='item' v-for="item in itemList.slice((i - 1) * 4, i * 4)" v-bind:key="item.id"></item-card>
          </div>
        </div>
      </div>

    </div>
</template>
<script>
  import itemCard from '../../components/itemCard.vue'
  import homeTab from '../../components/homeTab.vue'

  export default {
    props:{
      itemList: {
        type: Array
      }
    },
    components: {
      itemCard,
      homeTab
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../vars.scss";

  @media #{$laptop}{
    #laptop-home-container{
      height: calc(100% - 48px);
      #item-card-collection-container{
        margin-top: $lg-space;
        height: calc(100% - 20px);
      }
      .item-card-wrapper{
        display: grid;
        grid-template-columns: calc(25% - 15px)  calc(25% - 15px) calc(25% - 15px) calc(25% - 15px);
        grid-gap: $lg-space;
        height: 400px;
        width: 1200px;
        margin: $md-space auto $md-space auto;
      }
    }
  }


</style>
