<script>
  import * as firebase from "firebase";
  import FirebaseService from './utils/firebase/firebase-service';
  import store from './store/'
  import "./styles/main.css";

  export default {
    name: 'App',

    // Template dependencies
    store, 
    
    // Local state
    data: () => ({
      tabs: []
    }),

    // Events 
    created() {
      FirebaseService.initialiseDatabase();
      this.$store.commit('initialiseProjects');
      this.$store.commit('initialiseCriteria');
    }
  }
</script>

<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="app-logo">
          <i class="fa fa-heartbeat"/>
        </div>
        <h1>Squad Health Check</h1>
      </header>
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
