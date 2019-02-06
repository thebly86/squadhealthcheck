<script>
  import FirebaseService from '@/api/firebase-service';

  export default {
    name: 'ManageConfig',

    /* Template dependencies */
    components: {
    },

    /* Local state */
    data: () => ({
      firebaseConfig: function() {
        let config = localStorage.getItem('firebaseConfig');
        if (config) {
          config = JSON.parse(config);
        }

        return config || {
          apiKey: '',
          authDomain: '',
          databaseURL:  '',
          projectId: '',
          storageBucket: '',
          messagingSenderId: ''
        }
      }()
    }),

    computed: {
    },

    /* Events */
    /**
     * @summary when Dashboard first loads, we send a request to load all the available projects from
     * firebase.
     */
    created() {
    },

    /* Non-reactive properties */
    methods: {
      updateFirebase() {
        this.$store.commit('resetStore');
        debugger;
        FirebaseService.initialiseDatabase(this.firebaseConfig);
        debugger;
        localStorage.setItem('firebaseConfig', JSON.stringify(this.firebaseConfig))
      }
    }
  }
</script>

<template>
  <div class="firebase-config">
    <h1>Firebase configuration</h1>
    <div>
      <div>
        <span>
        <p for="apiKey">API Key:</p>
        <input
          v-model="firebaseConfig.apiKey"
          type="text"
          name="apiKey"
          id="apiKey">
      </span>
      <span>
        <p for="authDomain">Auth Domain:</p>
        <input
          v-model="firebaseConfig.authDomain"
          type="text"
          name="authDomain"
          id="authDomain">
      </span>
      <span>
        <p for="databaseURL">Database URL:</p>
        <input
          v-model="firebaseConfig.databaseURL"
          type="text"
          name="databaseURL"
          id="databaseURL">
      </span>
      <span>
        <p for="projectId">Project ID:</p>
        <input
          v-model="firebaseConfig.projectId"
          type="text"
          name="projectId"
          id="projectId">
      </span>
      <span>
        <p for="storageBucket">Storage Bucket:</p>
        <input
          v-model="firebaseConfig.storageBucket"
          type="text"
          name="storageBucket"
          id="storageBucket">
      </span>
      <span>
        <p for="messagingSenderId">Messaging Sender ID:</p>
        <input
          v-model="firebaseConfig.messagingSenderId"
          type="text"
          name="messagingSenderId"
          id="messagingSenderId">
      </span>
      </div>
      <button @click="updateFirebase()" class="btn--primary fb-update-btn">Update</button>
    </div>
  </div>
</template>

<style scoped>
  .firebase-config span {
    display: inline-block;
    width: 70%;
    margin-bottom: 15px;
  }

  span p {
    width: 20%;
  }

  span input {
    width: 40%;
  }
  .firebase-config {
    padding: 15px;
  }
</style>