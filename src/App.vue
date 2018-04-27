<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="app-logo">
          <i class="fa fa-heartbeat"/>
        </div>
        <h1>Squad Health Check</h1>
        <project-nav 
          ref="tabs" 
          :tabs="projects">
        </project-nav>
      </header>
      <router-view @openTab="openTab"></router-view>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase";
import ProjectNav from "./components/ProjectNav";
import FirebaseService from './utils/firebase/firebase-service';
import "./styles/main.css";

export default {
  name: 'App',

  data: () => ({
    projects: []
  }),

  created() {
    FirebaseService.initialiseDatabase();
  },

  components: {
    ProjectNav
  },

  methods: {
    openTab(project) {
      if (!_.find(this.projects, { id: project.id })) {
        this.projects.push(project); 
        this.$router.push({ name: 'ProjectView', params: { id: project.id}});
      }
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
