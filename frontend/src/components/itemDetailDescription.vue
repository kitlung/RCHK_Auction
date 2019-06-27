<template>
  <div id="detail-description-container">
    <div id="detail-description-header-row">
      <div id="detail-description-header-text">
        <div id="detail-description-item-name"><label>{{item.name}}</label></div>
        <div id="detail-description-created-detail-container">
          <div class="flex-box-parent"><v-icon>date_range</v-icon><label>{{created_date}}</label></div>
          <div class="flex-box-parent"><v-icon>person</v-icon><label>{{item.created_by}}</label></div>
        </div>
      </div>
      <v-icon v-bind:class="{'subscribed': item.subscribed}" @click.stop="starClicked()">star</v-icon>      
    </div>
    
    <div id="detail-description-img-container">

      <div id="detail-description-sm-imgs" v-if="$mq == 'laptop' || $mq == 'tablet-portrait' || $mq == 'tablet-landscape'" >
        <div v-for="(image,index) in item.imageList" :key="index" @click="selectImage(image)">
          <img :src="'/api/auction/v1/image/' + image">
        </div>
      </div>
      <div id="detail-description-lg-img" class="flex-box-parent" v-if="$mq == 'laptop' || $mq == 'tablet-portrait' || $mq == 'tablet-landscape'">
        <img :src="'/api/auction/v1/image/' + selectedImg">
      </div>

      <div id="detail-description-mobile-img-gallery" v-if="$mq == 'mobile-portrait'" class="horizontal-scroll-parent">
        <img 
          :src="'/api/auction/v1/image/' + image" 
          v-for="(image,index) in item.imageList" 
          :key="index" 
          class="horizontal-scroll-child"
        >
      </div>
    </div>
    <div id="detail-description-tabs-container">
      <v-tabs id="detail-description-tabs">
        <v-tab href="#description" class="info-tab">Description</v-tab>
        <v-tab href="#condition" class="info-tab">Condition</v-tab>

        <v-tabs-slider color="#5892F3"></v-tabs-slider>

        <v-tab-item :value="'description'" class="tab-content"><div>{{item.description}}</div></v-tab-item>
        <v-tab-item :value="'condition'" class="tab-content">
          <div id="condition-title">{{item.condition}}</div>
          <div>{{conditionDescription}}</div>
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    item: {
      type: Object
    }
  },
  data () {
    return {
      created_date: '',
      selectedImg: '',
      conditions: [],
      conditionDescription: ''
    }
  },
  created () {
    this.created_date = this.moment(this.item.created_at).format('DD/MM/YYYY')
    this.$http.get('/api/auction/v1/conditions')
      .then(res => {
        this.conditions = res.data.Request
        this.conditionDescription = this.conditions.find(x => x.condition === this.item.condition).description
      })
  },
  methods: {
    starClicked () {
      this.TOGGLE_SUBSCRIPTION(this.item.id)
    },
    selectImage (img) {
      this.selectedImg = img
    }
  },
  mounted () {
    this.selectedImg = this.item.imageList[0]
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #detail-description-container{
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    display: grid;
  }

  #detail-description-header-row{
    display: grid;
    grid-template-columns: 90% 10%;
    border-bottom: 1px solid $pri-light;
    #detail-description-header-text{
      display: grid;
      grid-template-rows: 50% 50%;
      #detail-description-item-name{
        color: $pri-dark;
      }
      #detail-description-created-detail-container{
        display: flex;
        font-size: 14px;
        color: $pri;
        & > div:last-child{
          margin: 0 $sm-space;
        }
        i{
          font-size: 16px;
          margin: 0 $xs-space;
          color: $pri-light;
        }
      }
    }
  }

  #detail-description-header-row > i{
    font-size: 36px;
    color: $pri-light;
    &.subscribed{
      color: $star;
    }
  }


  #detail-description-sm-imgs{
    overflow-y: auto;
    border-right: 1px solid $pri-light;
    img{
      width: 100%;
    }
  }

  #detail-description-lg-img{
    img{
      max-width: 100%;
      max-height: 100%;
    }
  }

  #detail-description-tabs-container{
    #detail-description-tabs{
      height: 100%;
      display: grid;
    }
    .tab-content{
      // calc((full_height - (upper+lower_padding) - navbar - card_upper_padding - card_lower_padding) * grid_ratio - tab_height - margin_top)
      height: calc((100vh - 48px - 48px - 20px - 20px) * 0.27 - 48px - 10px); 
      overflow: auto;
      margin-top: $sm-space;
    }
  }

  #condition-title{
    color: $pri;
    font-size: 18px;
    margin: $sm-space 0;
  }

  .info-tab{
    color: $pri !important;
  }

  @media #{$laptop} {
    #detail-description-container{
      grid-template-rows: 13% 60% 27%;
      padding: $lg-space;
    }
    #detail-description-img-container{
      display: grid;
      grid-template-columns: 25% 75%;
      border-bottom: 1px solid $pri-light;
      padding: $md-space;
      .tab-content{
        overflow: auto;
      }
    }
    #detail-description-item-name{
      font-size: 36px;
    }

  }

  @media #{$mobile-portrait} {
    #detail-description-container{
      width: 100%;
      grid-template-rows: 15% 50% 35%;
      padding: $md-space;
    }
    #detail-description-img-container{
      padding: $md-space 0;
      overflow: auto;
    }
    #detail-description-mobile-img-gallery{
      height: 100%;
      width: 100%;
      img{
        max-height: 100%;
        width: auto;
      }
    }
    #detail-description-item-name{
      font-size: 24px;
      position: relative;
      label{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  @media #{$tablet-portrait}{
    #detail-description-container{
      grid-template-rows: 10% 60% 30%;
      padding: $lg-space;
    }
    #detail-description-item-name{
      font-size: 36px;
    }
    #detail-description-img-container{
      display: grid;
      grid-template-columns: 25% 75%;
      border-bottom: 1px solid $pri-light;
      padding: $md-space;
      .tab-content{
        overflow: auto;
      }
    }
  }
  @media #{$tablet-landscape}{
    #detail-description-container{
      grid-template-rows: 10% 60% 30%;
      padding: $lg-space;
    }
    #detail-description-item-name{
      font-size: 36px;
    }
    #detail-description-img-container{
      display: grid;
      grid-template-columns: 25% 75%;
      border-bottom: 1px solid $pri-light;
      padding: $md-space;
      .tab-content{
        overflow: auto;
      }
    }

  }

</style>
