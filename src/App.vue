<script>
  import * as firebase from "firebase";
  import AppHeader from '@/views/AppHeader';
  import FirebaseService from '@/api/firebase-service';
  import store from './store/'
  import "./styles/main.css";

  export default {
    name: 'App',

    // Template dependencies
    components: {
      AppHeader
    },

    store,

    // Events
    created() {
      console.log('[TEST]');
      let firebaseConfig = localStorage.getItem('firebaseConfig');
      console.log('[FIREBASE CONFIG BEFORE]: ', firebaseConfig);
      debugger;
      firebaseConfig = JSON.parse(firebaseConfig);
      console.log('[FIREBASE CONFIG AFTER]: ', firebaseConfig);
      debugger;
      if (firebaseConfig) {
      debugger;
        FirebaseService.initialiseDatabase(firebaseConfig);
      } else {
        alert('You do not have a Firebase Config set, please navigate to the config page.');
      }
    }
  }
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
