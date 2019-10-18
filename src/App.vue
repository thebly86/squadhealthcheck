<script>
import * as firebase from "firebase";
import AppHeader from "@/views/AppHeader";
import FirebaseService from "@/api/firebase-service";
import store from "./store/";
import "./styles/main.css";

export default {
  name: "App",

  // Template dependencies
  components: {
    AppHeader
  },

  store,

  // Events
  created() {
    const firebaseConfig = JSON.parse(localStorage.getItem("firebaseConfig"));

    let hasAllConfigValues = false;

    for (var key in firebaseConfig) {
      if (!_.isNil(firebaseConfig[key]) && !_.isEmpty(firebaseConfig[key])) {
        hasAllConfigValues = true;
      }
    }

    if (firebaseConfig && hasAllConfigValues) {
      FirebaseService.initialiseDatabase(firebaseConfig);
    } else {
      this.$store.commit('resetStore');
      this.$router.push({ name: 'ManageConfig' });
    }
  }
};
</script>

<template>
  <div id="app">
    <div class="container">
      <app-header></app-header>
      <main>
        <router-view></router-view>
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
  background-color: var(--lighter-grey);
}

body {
  background-color: var(--lighter-grey);
}
</style>
