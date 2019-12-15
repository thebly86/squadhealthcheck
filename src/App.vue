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
      apiKey: "AIzaSyCL8A5yflZF3efOjQQdIXwvpLs2hdOjCFc",
      authDomain: "shc-test1.firebaseapp.com",
      databaseURL: "https://shc-test1.firebaseio.com",
      projectId: "shc-test1",
      storageBucket: "shc-test1.appspot.com",
      messagingSenderId: "526252407185",
      appId: "1:526252407185:web:e0c839852b6c29216bc230"
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
        await this.$store.dispatch("addUser", { uid });
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
