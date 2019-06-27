<template>
  <div id="recent-activity-container" class="card" v-if="user.userID">
    <div id="activity-card-title" class="uppercase"><label>Activity</label></div>
    <div class="activity-list">
        <div v-for="(activity, index) in activityList" v-bind:key="`${index}-${activity.id}`" class="activity-list-item">
          <label class="activity-time">{{activity.created_at}}</label>
          <label class="activity-name"><a :href="'/#/item/' + activity.id">{{activity.name}}</a></label>
          <label class="activity-price">${{activity.price}}</label>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: Object
  },
  data () {
    return {
      activityList: []
    }
  },
  mounted () {
    this.$http.get('/api/auction/v1/bid/' + this.user.userID)
      .then((res) => {
        this.activityList = res.data.Request.map((ele) => {
          ele.created_at = this.moment(ele.created_at).format('YYYY-MM-DD HH:mm:SS')
          return ele
        })
      })
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  #recent-activity-container{
    height: 100%;
    width: 100%;
  }
  #activity-card-title{
    height: 18px;
    font-size: 14px;
    color: $pri;
    text-align: center;
    width: 100%;
  }

  .activity-list{
    padding: 0;
    margin-top: $sm-space;
    .activity-list-item{
      color: $pri-dark;
      display: grid;
      margin: 0;
      padding: $sm-space $sm-space;
      > label{
        text-align: left;
        &:last-child{
          text-align: right;
        }
      }
      label > a {
        color: $pri-dark;
        text-decoration: none;
      }
      &:nth-child(odd){
        background-color: $pri-light;
      }
    }
  }

  @media #{$laptop} {
    #recent-activity-container{
      padding: $lg-space;
      overflow: auto;
    }
    .activity-list{
      max-height: calc(352.5px - 40px - 10px - 18px);
      overflow: auto;
    }
    .activity-list-item{
      grid-template-columns: 35% 45% 20%;
    }
  }
  @media #{$tablet-landscape} {
    #recent-activity-container{
      padding: $sm-space;
      overflow: auto;
    }
    .activity-list{
      max-height: calc(352.5px - 40px - 10px - 18px);
      overflow: auto;
    }
    .activity-list-item{
      grid-template-columns: 35% 45% 20%;
    }
  }

  @media #{$tablet-portrait} {
    #recent-activity-container{
      padding: $sm-space;
      overflow: auto;
    }
    .activity-list{
      max-height: calc(471px - 40px - 10px - 18px);
      overflow: auto;
    }
    .activity-list-item{
      grid-template-columns: 35% 45% 20%;
    }
  }

  @media #{$mobile-portrait} {
    #recent-activity-container{
      padding: $sm-space;
      overflow: auto;
    }
    .activity-list-item{
      .activity-name{
        font-weight: 700;
      }
    }
  }
</style>
