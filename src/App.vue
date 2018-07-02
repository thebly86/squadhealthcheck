<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="app-logo">
          <i class="fa fa-heartbeat"/>
        </div>
        <h1>Squad Health Check</h1>
        <project-nav 
          @closeTab="closeTab"
          :tabs="tabs">
        </project-nav>
      </header>
      <router-view 
        @closeTab="closeTab"
        @openTab="openTab">
      </router-view>
    </div>
  </div>
</template>

<script>
  import * as firebase from "firebase";
  import ProjectNav from "./components/ProjectNav";
  import FirebaseService from './utils/firebase/firebase-service';
  import store from './store/'
  import "./styles/main.css";

  export default {
    name: 'App',

    data: () => ({
      tabs: []
    }),

    created() {
      FirebaseService.initialiseDatabase();
      this.$store.commit('initialiseProjects');

      // Open previously opened tabs:
      if (sessionStorage.getItem('tabs')) {
        this.tabs = JSON.parse(sessionStorage.getItem('tabs'));
      }
    },

    components: {
      ProjectNav
    },

    methods: {
      closeTab({ id }) {
        // Remove tab from list of open tabs
        const index = _.findIndex(this.tabs, { id });
        if (index > -1) {
          this.tabs.splice(index, 1);
        }

        // Clear any associated session data
        if (sessionStorage.getItem(id)) {
          sessionStorage.removeItem(id);
          sessionStorage.removeItem(`${id}.sprints`);
        }
        sessionStorage.setItem('tabs', JSON.stringify(this.tabs));
        this.$router.push({ name: 'ProjectList'});
      },

      openTab(tab) {
        if (!_.find(this.tabs, { id: tab.id })) {
          this.tabs.push(tab); 
          sessionStorage.setItem('tabs', JSON.stringify(this.tabs));
        }
        this.$router.push({ name: 'ProjectView', params: { id: tab.id}});
      }
    }
  }
</script>


<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: var(--dark-grey);
    background-color: #f2f2f2;
  }

  body {
    background-color: #f2f2f2;
  }
</style>
