<template>
    <div id="tablet-home-container">

<!-- PORTRAIT -->

      <div id="item-card-collection-container" class="item-card-collection-container" v-if="$mq == 'tablet-portrait'">
        <div id="item-card-collection-content" class="item-card-collection-content">
          <div class="item-card-wrapper" v-for="i in Math.ceil(itemList.length / 2)">
            <item-card :item='item' v-for="item in itemList.slice((i - 1) * 2, i * 2)" v-bind:key="item.id"></item-card>
          </div>
        </div>
      </div>

<!-- LANDSCAPE -->

      <div id="item-card-collection-container" class="item-card-collection-container" v-if="$mq == 'tablet-landscape'">
        <div id="item-card-collection-content" class="item-card-collection-content">
          <div class="item-card-wrapper" v-for="i in Math.ceil(itemList.length / 3)">
            <item-card :item='item' v-for="item in itemList.slice((i - 1) * 3, i * 3)" v-bind:key="item.id"></item-card>
          </div>
        </div>
      </div>

    </div>
</template>
<script>
  import homeTab from '../../components/homeTab.vue'
  import itemCard from '../../components/itemCard.vue'

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


  @media #{$tablet-portrait}{
    #tablet-home-container{
      height: calc(100% - 68px);
      #item-card-collection-container{
        margin-top: $lg-space;
        height: 100%;
      }
      .item-card-wrapper{
        display: grid;
        grid-template-columns: calc(50% - 10px)  calc(50% - 10px);
        grid-gap: $lg-space;
        height: 400px;
        width: 650px;
        margin: 0 auto $md-space auto;
        &:first-child{
          margin-top: $md-space;
        }
      }
    }

  }

  @media #{$tablet-landscape}{
    #tablet-home-container{
      height: calc(100% - 68px);
      #item-card-collection-container{
        margin-top: $lg-space;
        height: 100%;
      }
      .item-card-wrapper{
        display: grid;
        grid-template-columns: calc(33% - 13px)  calc(33% - 13px) calc(34% - 14px);
        grid-gap: $lg-space;
        height: 400px;
        width: 960px;
        margin: $md-space;
      }
    }
  }


</style>
