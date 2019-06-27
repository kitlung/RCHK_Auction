<template>
  <v-dialog v-model="dialog" max-width="300px">
    <v-card>
      <v-card-title class="headline">{{title}}</v-card-title>
      <v-card-text>{{text}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat @click="hide()">Cancel</v-btn>
        <v-btn color="green darken-1" flat @click="submit()">Submit.</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean,
    title: String,
    text: String,
    item: Object,
    type: String
  },
  computed: {
    dialog: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    hide () {
      this.dialog = false
    },
    submit () {
      this.dialog = false
      this.$emit(this.type, this.item)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";
  .v-dialog__content--active{
    background-color: rgba(0,0,0,0.5);
  }
</style>
