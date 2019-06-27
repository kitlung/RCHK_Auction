<template>
    <v-navigation-drawer id="side-menu" absolute temporary v-model="sideMenu.opened" >
      <div id="side-menu-icon-container"><v-icon id="side-menu-icon">gavel</v-icon></div>
      <v-list id="side-menu-list-container">
        <v-list-tile v-for="item in items" :key="item.title" class="side-menu-list uppercase" :class="{'selected' : item.path == currentRoute}" @click="jumpTo(item.path)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div id="side-menu-user-info" class="center-parent" @click="jumpTo('/profile')">
        <img :src="'/api/rcapps/photo/get-image/' + user.weblogin" id="side-menu-user-img">
        <label id="side-menu-user-name">{{user.name}}</label>
      </div>
    </v-navigation-drawer>
</template>
<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState([
      'sideMenu',
    ])
  },
  data () {
    return {
      items: [
        { title: 'Home', icon: 'home', path: '/' },
        { title: 'Your Items', icon: 'store', path: '/your-items' },
        { title: 'Logout', icon: 'exit_to_app', path: 'logout' },
      ],
      user: {
        name: '',
        weblogin: ''
      },
      currentRoute: '',
    }
  },
  created () {
    this.user.name = localStorage.getItem('user')
    this.user.weblogin = localStorage.getItem('weblogin')
    this.currentRoute = this.$router.currentRoute.path
  },
  methods: {
    jumpTo (path) {
      if(path == 'logout'){
        localStorage.removeItem('weblogin')
        localStorage.removeItem('user')
        localStorage.removeItem('jwtKey')
        this.$router.push('/login')
      }else{
        this.$router.push(path)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";

  @media #{$mobile-portrait}{
    #side-menu-icon{
      font-size: 36px;
    }
  }
  @media #{$mobile-landscape}{
    #side-menu-icon{
      font-size: 36px;      
    }
  }
  @media #{$tablet-portrait}{
    #side-menu-icon{
      font-size: 60px;      
    }
  }
  @media #{$tablet-landscape}{
    #side-menu-icon{
      font-size: 48px;      
    }
  }
  @media #{$laptop}{
    #side-menu-icon{
      font-size: 48px;
    }
  }

  #side-menu{
    background-color: $pri-dark;
    color: $pri-light;
  }

  #side-menu-icon-container{
    text-align: center;
    padding: 10px 0;
    #side-menu-icon{
      color: $pri-light;
      text-align: center;
    }
  }
  .side-menu-list{
    background-color: $pri-light !important;
    color: $pri;
    cursor: pointer;
    &.selected{
      border-left: 5px solid $pri;
    }
    * {
      color: $pri;
    }
  }
  #side-menu-list-container{
    height: calc(100% - 100px - 56px);
    overflow: auto;
    padding: 0;
  }
  #side-menu-user-info{
    display: grid;
    grid-template-columns: 40% 60%;
    height: 100px;
    position: absolute;
    width: 100%;
    bottom: 0;
    cursor: pointer;
    #side-menu-user-img{
      height: 80%;
      clip-path: circle(30px at center);
      margin: auto;
    }
    #side-menu-user-name{
      margin: auto;
      font-size: 20px;
    }
    *{
      cursor: pointer;
    }
  }
</style>
