<template>
  <div id="upload-container">
    <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
      <div class="dropbox">
        <input 
          type="file" 
          multiple
          :name="'photo'" 
          :disabled="isSaving" 
          @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
          accept="image/*"
          class="input-file"
        >
          <p v-if="isInitial">
            Drag your image(s) here to begin<br> or click to browse
          </p>
          <p v-if="isSaving">
            Uploading {{ fileCount }} image...
          </p>
      </div>
    </form>
    <div v-if="isSuccess" id="upload-image-success">
      <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
      <div id="upload-images-wrapper">
        <div 
          v-for="i in Math.ceil(uploadedFiles.length / 3)" 
          :key="i" 
          id="upload-images-row"
        >
          <div 
            v-for="item in uploadedFiles.slice((i - 1) * 3, i * 3)" 
            :key="item.filename" id="upload-images-col" 
            class="flex-box-parent"
          >
            <img :src="item.url" class="img-responsive img-thumbnail" :alt="item.filename">
          </div>
        </div>
      </div>
    </div>
    <div v-if="isSuccess" id="success-btn-container">
      <div class="flex-box-parent">
        <v-btn fab dark color="#5892F3" @click="uploadSuccess()">
          <v-icon dark>navigate_next</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-if="isFailed" id="upload-image-fail">
      <h2>Uploaded failed.</h2>
      <div class="flex-box-parent">
        <v-btn fab dark color="#5892F3" @click="reset()">
          <v-icon dark>cached</v-icon>
        </v-btn>
      </div>
      <pre>{{ uploadError }}</pre>
    </div>
  </div>
</template>
<script>
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
export default {
  data () {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    upload (formData) {
      return new Promise((resolve,reject) => {
        this.$http.post('/api/auction/v1/image',formData)
          .then(res => {
            var arr = res.data.Request.map(x => {
              x.url = '/api/auction/v1/image/' + x.filename
              return x
            })
            resolve(arr)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      this.upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange(fieldName, fileList) {
      var allFilesAreImages = true

      const formData = new FormData()

      if (!fileList.length) return;

      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          if(fileList[x].type.includes('image/')){
            formData.append(fieldName, fileList[x], fileList[x].name);
          }else{
            allFilesAreImages = false
            this.reset()
            this.$notify({group: 'foo',type: 'error',title: 'Error.',text: 'You can only upload images.'})
          }
        });
      // save it
      if(allFilesAreImages){
        this.save(formData)
      }
    },
    uploadSuccess () {
      this.$emit('uploadSuccess', this.uploadedFiles)
      this.reset()
    }
  },
  mounted() {
    this.reset();
  },
}
</script>
<style lang="scss" scoped>
  @import "../vars.scss";
  #upload-container{
    height: calc(100% - 29px);
  }
  #upload-image-success{
    height: calc(95% - 29px);
    overflow: auto;
    h2{
      margin: 10px;
      text-align: center;
      color: $pri-dark;
    }
  }
  #upload-image-fail{
    div{
      margin: auto;
    }
    h2{
      margin: 10px;
      text-align: center;
      color: $pri-dark;
    }
  }
  #success-btn-container{
    height: 5%;
  }
  #upload-images-wrapper{
    height: calc(100% - 45px);
    #upload-images-row{
      height: 33%;
      display: grid;
      grid-template-columns: 33% 33% 33%;
      #upload-images-col{
        img{
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
  .dropbox {
    margin-top: $sm-space;
    outline: 2px dashed $pri-dark; /* the dash box */
    outline-offset: -10px;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
    height: 100%;
  }

  form{
    height: 100%;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 100%;
    position: absolute;
    cursor: pointer;
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

</style>
