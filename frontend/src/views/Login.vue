<template>
    <div id="login-page-container" class="full-size">
      <div id="login-page-text-container" v-show="!loginForm">
        <h1 id="login-page-title">RCHK Auction</h1>
        <div id="login-page-content">Bid it.</div>
        <v-btn large color="#5892F3" style="color: #fff;" @click="start()">Start</v-btn>
      </div>
      <div v-show="loginForm" id="login-form">
        <div>
          <label>Weblogin ID</label>
          <input type="text" v-model="user.username">
        </div>
        <div>
          <label>Password</label>
          <input type="password" v-model="user.password">
        </div>
        <div class="flex-box-parent">
          <v-btn large color="#5892F3" style="color: #fff; width: 100%;" @click="login()">Login</v-btn>
        </div>
        <div class="flex-box-parent">
          <v-btn large color="#fff" style="color: #5892F3; width: 100%;" @click="hideLoginForm()">Cancel</v-btn>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: false,
      user: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    this.$nextTick(() => {
      var textContainer = document.getElementById('login-page-text-container')
      textContainer.classList.add('animated','fadeInDown')
      function textContainerAnimationEnd() {
        textContainer.classList.remove('animated', 'fadeInDown')
        textContainer.removeEventListener('animationend', textContainerAnimationEnd)
      }
      textContainer.addEventListener('animationend', textContainerAnimationEnd)
    })
  },
  methods: {
   checkBrowser(){
      var sBrowser, sUsrAg = navigator.userAgent;
      if (sUsrAg.indexOf("Firefox") > -1) {
        sBrowser = "Firefox";
      } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
        sBrowser = "Opera";
      } else if (sUsrAg.indexOf("Trident") > -1) {
        sBrowser = "IE";
      } else if (sUsrAg.indexOf("Edge") > -1) {
        sBrowser = "Microsoft Edge";
      } else if (sUsrAg.indexOf("Chrome") > -1) {
        sBrowser = "Chrome";
      } else if (sUsrAg.indexOf("Safari") > -1) {
        sBrowser = "Safari";
      } else {
        sBrowser = "unknown";
      }
      return sBrowser
    },
    start () {
      if(this.checkBrowser() != "Chrome"){ // LDAP login
        this.showLoginForm()
      } else { // get xdLocalStorage
        this.getXdLocalStorage()
      }
    },
    showLoginForm () {
      var textContainer = document.getElementById('login-page-text-container')
      textContainer.classList.add('animated','fadeOutUp')

      setTimeout(() => {
        this.loginForm = true

        var loginForm = document.getElementById('login-form')
        var loginContainer = document.getElementById('login-page-container')
        loginContainer.classList.add('flex-box-parent')
        loginForm.classList.add('animated','fadeInUp')

        function loginFormAnimationEnd() {
          loginForm.classList.remove('animated', 'fadeInUp')
          loginForm.removeEventListener('animationend', loginFormAnimationEnd)
          textContainer.classList.remove('animated', 'fadeOutUp')
        }
        loginForm.addEventListener('animationend',loginFormAnimationEnd)
      },400)
    },
    hideLoginForm () {
      var loginForm = document.getElementById('login-form')
      loginForm.classList.add('animated','fadeOutDown')
      setTimeout(() => {
        var loginContainer = document.getElementById('login-page-container')
        loginContainer.classList.remove('flex-box-parent')

        var textContainer = document.getElementById('login-page-text-container')
        textContainer.classList.add('animated','fadeInDown')

        function textContainerAnimationEnd() {
          textContainer.classList.remove('animated', 'fadeInDown')
          loginForm.classList.remove('animated', 'fadeOutDown')
          textContainer.removeEventListener('animationend', textContainerAnimationEnd)
        }

        textContainer.addEventListener('animationend', textContainerAnimationEnd)
        this.loginForm = false        
      },400)
    },
    login () {
      this.$http.post('/api/ldap-auth', this.user)
        .then(response => {
            if (response && response.data.result === 'Logged In') {
              this.getUserInfo(this.user)
            } else {
              this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Incorrect weblogin id or password.'})
            }
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
        })
    },
    getUserInfo (user) {
      this.$http.get('/api/rcapps/user/'+ user.username)
        .then(res => {
          if (res.data.Error) {
            this.$notify({group: 'foo',type: 'error',title: 'Error.',text: res.data.Message})
          } else {
            localStorage.setItem('weblogin', res.data.response[0].weblogin)
            localStorage.setItem('user', res.data.response[0].full_name)
            this.generateJwtKey(user.username)
          }
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
        })

    },
    generateJwtKey (username) {
      this.$http.post('/api/rcapps/user/jwtKey',{username: username})
        .then(res => {
          if (res.data.Error) {
            this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Unable to generate jwtkey. Please try again later.'})
          } else {
            localStorage.setItem("jwtKey", res.data.jwtKey)
            this.checkAppPermission(res.data.jwtKey)
          }
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
        })
    },
    checkAppPermission (jwtKey) {
      this.$http.post('/api/rcapps/app-permission', {'jwtKey': jwtKey, 'url': 'auction.rchk.edu.hk'})
        .then(res => {
          if (res.data.result != 'Success' || res.data.permission == false) {
            this.$router.push('unauthorized')
          } else {
            this.$router.push('/')
          }
        })
    },
    getXdLocalStorage () {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname.includes('local.')){
          var appUrl = "http://dev.rdapps.rchk.edu.hk"
          var auctionUrl = "http://local.auction.rchk.edu.hk"
        } else {
          var appUrl = "https://rdapps.rchk.edu.hk"
          var auctionUrl = "https://auction.rchk.edu.hk"
        }
        xdLocalStorage.init({
          iframeUrl: appUrl + '/#/iframe',
          initCallback: () => {
            xdLocalStorage.getItem('jwtKey', (response) => {
              if (!response.value || response.value == 'undefined') {
                window.location.href = appUrl
              }
              else if (response.value && response.value != 'undefined') {
                localStorage.setItem('jwtKey',response.value)
                xdLocalStorage.getItem('user', (userResponse) => {
                  if (!userResponse.value || userResponse.value == 'undefined') {
                    window.location.href = appUrl
                  } else {
                    var fullName = JSON.parse(userResponse.value).name + ' ' + JSON.parse(userResponse.value).familyName
                    var weblogin = JSON.parse(userResponse.value).weblogin
                    localStorage.setItem('user',fullName)
                    localStorage.setItem('weblogin',weblogin)
                    window.location.href = auctionUrl
                  }
                })
              }
            })
          }
        })
    }
  },
}
</script>
<style lang="scss" scoped>
@import "../vars.scss";

  #login-page-text-container{
    text-align: left;
    #login-page-title{
      font-size: 72px;
      color: #fff;
    }
    #login-page-content{
      color: $pri-light;
      font-weight: 700;
      font-size: 20px;
    }
    *{
      margin-bottom: 20px;
    }
  }

  #login-form{
    background-color: rgba(0,0,0,0.2);
    border-radius: 10px;
    display: grid;
    grid-gap: 10px;
    padding: 30px 20px;

    label{
      color: $pri-light;
    }
    input{
      background-color: rgba(0,0,0,0.1);
      width: 100%;
      color: $pri-light;
      padding-left: 15px;
      font-size: 18px;
      outline: none;
      height: 60px;
      margin: 10px 0;

    }
  }


  @media #{$laptop} {
    #login-page-text-container{
      padding: 200px 100px;
    }

    #login-form{
      width: 400px;
      margin: auto;
      padding: 30px 20px;
    }
  }

  @media #{$tablet-portrait} {
    #login-page-text-container{
      padding: 200px 70px;
    }

    #login-form{
      width: 400px;
    }
  }


  @media #{$mobile-portrait}{
    #login-page-text-container{
      padding: 200px 0 0 30px;
    }

    #login-page-title{
      font-size: 30px !important;
    }

    #login-form{
      width: 80vw;
    }
  }

  @media #{$mobile-landscape}{
    #login-page-text-container{
      padding: 100px 0 0 30px;
    }

    #login-page-title{
      font-size: 30px !important;
    }

    #login-form{
      width: 60vw;
      input{
        height: 40px !important;
      }
    }
  }

  @media #{$tablet-landscape}{
    #login-page-text-container{
      padding: 200px 0 0 30px;
    }

    #login-form{
      width: 50vw;
    }
  }

</style>
