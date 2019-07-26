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
        <li>Sign up to firebase (If already have an account skip to step 1.2).</li>
        <li>In the Firebase console located <a href="https://console.firebase.google.com">here</a>, select <strong>Add project</strong>, (If you already have a project skip to step 2.1).</li>
        <li>Follow all the steps on the pop up and choose the appropriate options for your project.</li>
      </ol>
      <h3>Step 2: Register your App</h3>
      <ol>
        <li>Under the project name click the icon that looks like: '<strong></></strong>'</li>
        <li>Then enter an app name and tick the 'Firebase Hosting' checkbox and then select the project you created earlier in the dropdown (if not already selected).</li>
        <li>In the second, third and fouth steps, ignore these and continue using the 'Next'/'Continue to console' buttons.</li>
        <li>You should go back to the previously screen, if not select the 'Project Overview' from the lefthand side.</li>
      </ol>
      <h3>Step 3: Add Firebase SDKs and initialize Firebase</h3>
      <ol>
        <li>Select the App button from the overlay, select the config cog icon next to the app we created earlier.</li>
        <li>If you scroll down to the 'Your apps' section within the 'Firebase SDK snippet' select the radio button 'Config'.</li>
        <li>From here copy and paste the values into the Squad health check firebase config page matching up the values with the names.</li>
        <li>Lastly activate the 'Update' button and then you can start using the Squad Health Check tool.</li>
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