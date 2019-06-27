<template>
  <div v-bind:class="{'ending': ending}">
    <label></label>
    <label>{{days}}</label>
    <label>:</label>
    <label>{{hours}}</label>
    <label>:</label>
    <label>{{minutes}}</label>
    <label>:</label>
    <label>{{seconds}}</label>
    <label></label>
  </div>
</template>
<script>
export default {
  props:{
    endTime: String
  },
  data () {
    return {
      currentTime: this.moment().format('X'),
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      ending: false,
      ended: false
    }
  },
  created () {
    this.addOneSecondToActualTimeEverySecond()    
  },
  watch: {
    currentTime: {
      handler: 'compute',
      immediate: true
    }
  },
  methods: {
    addOneSecondToActualTimeEverySecond () {
      this.currentTime = this.moment().format('X')
      setTimeout(() => {
        this.addOneSecondToActualTimeEverySecond()
      }, 1000);
    },
    getDiffInSeconds () {
      return this.moment(this.endTime).format('X') - this.currentTime
    },
    compute () {
      var duration = this.moment.duration(this.getDiffInSeconds(), "seconds")
      this.days = duration.days() > 0 ? (duration.days() < 10 ? '0' + duration.days() : duration.days()) : '00'
      this.hours = duration.hours() > 0 ? (duration.hours() < 10 ? '0' + duration.hours() : duration.hours()) : '00'
      this.minutes = duration.minutes() > 0 ? (duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes()) : '00'
      this.seconds = duration.seconds() > 0 ? (duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds()) : '00'
      if(duration.days() <= 0 && this.ending == false){
        this.ending = true
      }
      if(this.ended == false && duration.days() <= 0 &&  duration.hours() <= 0 && duration.minutes() <= 0 && duration.seconds() <= 0) {
        this.ended = true
        this.$emit('ended')
      }
    }
  },

}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";
  div{
    display: grid;
    grid-template-columns: 2.5% 20% 5% 20% 5% 20% 5% 20% 2.5%;
    text-align: center;
  }
  label{
    font-size: 1em;
    color: $pri-dark;
  }
  .ending > label{
    color: $danger-light !important;
  }
</style>
