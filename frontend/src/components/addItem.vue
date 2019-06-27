<template>
  <v-form id="add-item-form" v-if="state == 'info'" ref="infoForm">
    <div id="add-item-form-title">Create new item</div>
    <v-text-field
      label="Item name"
      prepend-icon="store"
      v-model="form.name"
      :rules="[rules.required, rules.noSpecialChar]"
    ></v-text-field>
    <v-text-field
      label="Starting Price"
      prepend-icon="attach_money"
      v-model="form.price"
      mask="####"
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      label="Bid Increment"
      prepend-icon="attach_money"
      mask="##"
      v-model="form.price_interval"
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      label="Ending datetime (DD/MM/YYYY HH:MM)"
      hint="Should be before last day of next year"
      prepend-icon="calendar_today"
      mask="date-with-time"
      v-model="form.end_at"
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      label="Description"
      prepend-icon="description"
      v-model="form.description"
      :rules="[rules.required, rules.noSpecialChar]"
    ></v-text-field>
    <div id="condition">Condition</div>
    <div id="condition-btn-container">
      <button
        type="button"
        v-for="(condition, index) in conditions" 
        :key="index"
        :class="form.condition == condition.condition ? 'selected' : 'unselected'"
        @click="chooseCondition(condition)"
        class="clickable secondary-btn"
      >{{condition.condition}}</button>
    </div>
    <div>
      {{conditionDescription}}
    </div>
    <div id="next-btn-container">
      <v-btn fab dark color="#5892F3" @click="validation()" type="button">
        <v-icon dark>navigate_next</v-icon>
      </v-btn>
    </div>
  </v-form>
  <div v-else id="add-item-form">
    <div id="add-item-form-title">Upload images</div>
    <upload v-on:uploadSuccess="submit($event)"></upload>
  </div>
</template>
<script>
import upload from './upload.vue'

export default {
  components:{
    upload
  },
  created () {
    this.$http.get('/api/auction/v1/conditions')
      .then(res => {
        this.conditions = res.data.Request.sort(function(a,b) {return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0)})
        this.conditionDescription = this.conditions[0].description
      })
  },
  data () {
    return {
      rules: {
        required: value => !!value || ('This information is required.'),
        noSpecialChar: value => !value.match(/[!@#$%^&*(),.?":{}|<>]/g) || ('Contain special character.'),
      },
      form: {
        name: '',
        price: '',
        price_interval: '',
        winner: '',
        end_at: '',
        description: '',
        created_by: '',
        condition: 'NEW'
      },
      conditions: [],
      conditionDescription: '',
      state: 'info',
    }
  },
  methods: {
    reset () {
      this.state = 'info'
      this.form = {
        name: '',
        price: '',
        price_interval: '',
        winner: '',
        end_at: '',
        description: '',
        created_by: '',
        condition: 'NEW'
      }
    },
    chooseCondition (condition) {
      this.form.condition = condition.condition
      this.conditionDescription = condition.description
    },
    checkDateTime () {
      if(this.form.end_at.length == 12){
        var nextYear = new Date().getFullYear() + 1
        return this.formatTime(this.form.end_at).isValid() && 
                this.formatTime(this.form.end_at).isBefore(this.moment(nextYear + '-12-31 23:59:59')) &&
                this.formatTime(this.form.end_at).isAfter(this.moment(new Date()).add(1,'days'))
      }else{
        return false
      }
    },
    formatTime (timeString) {
        var day = timeString.substring(0,2)
        var month = timeString.substring(2,4)
        var year = timeString.substring(4,8)
        var hour = timeString.substring(8,10)
        var minute = timeString.substring(10,12)
        return this.moment(year + '-' + month + '-' + day + ' ' + hour + ':' + minute)
    },
    validation () {
      if(this.$refs.infoForm.validate()){
        if(this.checkDateTime()){
          this.state = 'photo'
          this.form.end_at = this.formatTime(this.form.end_at)
        }else{
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'Invalid time.'})
        }
      }
    },
    submit (itemList) {
      var fileNameList = itemList.map(x => x.filename)
      var form = Object.assign({}, this.form)
      form.imgList = fileNameList
      form.created_by = this.$store.state.user.userID
      form.end_at = this.moment(form.end_at).format('YYYY-MM-DDTHH:mm:SS')
      this.$http.post('/api/auction/v1/item', form)
        .then( _ => {
          this.$notify({group: 'foo',type: 'success',title: 'Success.'})
          this.reset()
        })
        .catch(err => {
          this.$notify({group: 'foo',type: 'error',title: 'Error.',text: err})
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";
  #add-item-form{
    width: 50%;
    height: 100%;
    margin: auto;
    background-color: #D4E3FC99;
    padding: $lg-space;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    #add-item-form-title{
      color: $pri-light;
      font-size: 24px;
      text-align: center;
    }
    #condition{
      font-size: 17px;
      width: 100%;
      padding-left: 35px;
      margin-bottom: $md-space;
      color: rgba(0,0,0,0.54);
    }
    #condition-btn-container{
      display: flex;
      justify-content: space-around;
      margin-bottom: $md-space;
    }
    #next-btn-container{
      display: flex;
      justify-content: center;
    }
    .secondary-btn{
      padding: $sm-space;
      &.selected{
        outline: 1px solid $pri;
        background-color: $pri;
        color: #fff;
      }
      &.unselected{
        outline: 1px solid $pri-dark;
        color: $pri-dark;
      }
    }
  }
  .error--text {
    color: $danger;
  }
  @media #{$tablet-portrait} {
    #add-item-form{
      height: 80%;
      width: 80%;
    }
  }

  @media #{$mobile-portrait} {
    #add-item-form{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: $sm-space;
    }
    #condition-btn-container{
      display: block !important;
      .secondary-btn{
        padding: $xs-space;
        font-size: 14px;
      }
    }
  }

  @media #{$mobile-landscape} {
    #add-item-form{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: $sm-space;
    }
  }

</style>
