<script>
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";
import AppHeader from "@/views/AppHeader";
import store from "./store/";
import "./styles/main.css";

export default {
  name: "App",

  /* Local state */
  data: () => ({
    firebaseConfig: {
      apiKey: "AIzaSyBQ9Eo9cpSCRld4vpzjmV1XrgcDiWCE3Hc",
      authDomain: "team-health-check-9141c.firebaseapp.com",
      databaseURL: "https://team-health-check-9141c.firebaseio.com",
      projectId: "team-health-check-9141c",
      storageBucket: "team-health-check-9141c.appspot.com",
      messagingSenderId: "60524480289",
      appId: "1:60524480289:web:5484299aa570e5d2fb6060"
    },
    user: {},
    signedIn: false
  }),

  // Template dependencies
  components: {
    AppHeader
  },

  store,

  // Events
  created() {
    firebase.initializeApp(this.firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
      user ? this.handleSignedInUser(user) : this.handleSignedOutUser();
    });
  },

  // Non-reactive properties
  methods: {
    async handleSignedInUser({ uid, displayName, email }) {
      this.signedIn = true;

      const userExists = await this.$http.get(`users/${uid}`);

      // Check if user exists in database and add them
      if (!userExists) {
        await this.$store.dispatch("addUser", {
          uid,
          displayName,
          email
        });
      }

      // Add the user to the vue store
      this.$store.commit("updateUser", { uid, displayName, email });
    },

    async handleSignedOutUser() {
      this.signedIn = false;
      this.$store.commit("updateUser", {});
      this.$router.push({ name: "SignIn" }).catch(error => {});
    }
  }
};
</script>

<template>
  <div id="app">
    <div class="container">
      <app-header v-if="signedIn" :user="user"></app-header>
      <main>
        <router-view></router-view>
        <notifications group="app" position="bottom right" />
      </main>
    </div>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: var(--dark-grey);
  height: 100%;
}

body {
  background-color: var(--lighter-grey);
}

.custom-notification {
}

.custom-notifcation__title {
  margin-right: 20px;
}
</style>
