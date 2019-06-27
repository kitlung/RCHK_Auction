<template>
  <div>
    <div>This is home</div>
    <ul>
      <li v-for="show in shows" :key="show.id" v-on:click="deleteRecord(show.id)">{{show.name}}</li>
    </ul>
    <input type="text" v-model="name">
    <button @click="submit()">Submit</button>
  </div>
</template>

<script>
  export default {
    components: {
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      update: function (data) {
        console.log(data)
      },
      insert: function (data) {
        this.shows.push(data)
      },
      delete: function (data) {
        var removeIndex = this.shows.map(function(item) { return item.id; }).indexOf(data.id);
        this.shows.splice(removeIndex, 1);
      }
    },
    data () {
      return {
        shows: [],
        name: ''
      }
    },
    methods: {
      submit () {
        if(this.name){
          this.$http.post('/api/auction/tv-shows',{name: this.name})
            .then(res => {
              this.name = ''
            })
        }
      },
      deleteRecord (id) {
          console.log(id)
          this.$http.post('/api/auction/delete-tv-shows',{id: id})
      }
    },
    mounted () {
      this.$http.get('/api/auction/tv-shows')
        .then(res => {
          this.shows = res.data.Request
        })
    }
  }
</script>
