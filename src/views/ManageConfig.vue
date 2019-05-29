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
          databaseURL: '',
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
        localStorage.removeItem('firebaseConfig');
        this.$store.commit('resetStore');
        FirebaseService.initialiseDatabase(this.firebaseConfig);
        localStorage.setItem('firebaseConfig', JSON.stringify(this.firebaseConfig))
      }
    }
  }
</script>

<template>
  <div class="firebase-config">
    <div class="config">
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
      <button
        @click="updateFirebase()"
        class="btn--primary fb-update-btn">
        Update
      </button>
    </div>
    </div>
    <div class="guide">
      <h3>Step 1: Create your Firebase project</h3>
      <ol>
        <li>In the Firebase console located <a href="https://console.firebase.google.com">here</a>, select <strong>Add project</strong>.</li>
        <li>Follow the remaining setup steps in the Firebase console, then click <strong>Create project</strong> (or <strong>Add Firebase</strong>, if you're using an existing Google project).</li>
      </ol>
      <h3>Step 2: Register your App</h3>
      <ol>
        <li>In the Firebase console's project overview page, click the <strong>Web</strong> icon (code) to launch the setup workflow - If you've already added an app to your Firebase project, click <strong>Add app</strong> to display the platform options.</li>
        <li>Enter your apps nickname.</li>
        <li>(Optional) Set up Firebase Hosting for your App – for more information please follow steps 2.3 <a href="https://firebase.google.com/docs/web/setup?authuser=0">here</a>.</li>
        <li>Click <strong>Register app</strong>.</li>
      </ol>
      <h3>Step 3: Add Firebase SDKs and initialize Firebase</h3>
      <ol>
        <li>When in the Add Firebase SDK section you will be presented with a firebase config script. At this stage do not follow the steps in the official firebase guides. Instead of pasting the entire script into the body tag as instructed, simply paste the values from the firebaseConfig object located in the script into the correct fields in the Squad Health Check Firebase Config page.</li>
        <li>On the official firebase console, click <strong>Continue to console</strong>.</li>
        <li>In the Squad Health Check, click <strong>Update</strong> once you have filled in all the fields.</li>
      </ol>
      <h3>Step 4: Set read and write permissions on the database</h3>
      <ol>
        <li>In the firebase console click on your project.</li>
        <li>In the side menu on the left, click <strong>Database</strong>.</li>
        <li>In the JSON object on the screen, ensure read and write are both set to true.</li>
      </ol>
      <p>For more detailed instructions on how to set up your Firebase project, please visit the Firebase help centre <a href="https://firebase.google.com/docs/web/setup?authuser=0">here</a>.</p>
    </div>
  </div>
</template>

<style scoped>
  .firebase-config {
    display: flex;
    padding: 15px 30px 15px 15px;;
  }
  .firebase-config span {
    display: inline-block;
    width: 90%;
    margin-bottom: 15px;
  }

  .config {
    min-width: 50%;
  }

  span p {
    width: 30%;
  }

  span input {
    width: 70%;
  }

  span {
    width: 100%;
  }

  .guide {
    margin-top: 50px;
  }

  h3 {
    color: #2dc798;
  }
</style>