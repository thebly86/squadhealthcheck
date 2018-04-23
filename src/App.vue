<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="app-logo">
          <i class="fa fa-heartbeat"/>
        </div>
        <h1>Squad Health Check</h1>
        <project-nav :tabs="projects"></project-nav>
      </header>
      <router-view @openTab="openTab"></router-view>
      <!--
      <tab-group ref="tabGroup">
        <tab name="My Projects">
          <project-list 
            :projects="projects"
            @projectSelected="setSelectedProject">
          </project-list>
        </tab>
        <tab 
          v-if="getSelectedProject()"
          :name="getSelectedProject().name"
          ref="projectTab">
          <squad-health-check
            :project="selectedProject"
            :criteria="criteria">
          </squad-health-check>
        </tab>
      </tab-group>
      -->
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase";
import ProjectNav from "./components/ProjectNav";
import "./styles/main.css";

export default {
  name: 'App',

  data: () => ({
    projects: []
  }),

  components: {
    ProjectNav
  },

  created() {
    if (!firebase.apps.length) {
      this.initialiseDatabase();
    }
  },
 
  methods: {
    /**  
     * Sets up the firebase connection
     * TODO: Move to external config file?
     */
    initialiseDatabase() {
      var config = {
        apiKey: "AIzaSyCaB22KDhV98fl6xyFHe5QSE6SAcYX5MZQ",
        authDomain: "squad-health-check-c6d92.firebaseapp.com",
        databaseURL: "https://squad-health-check-c6d92.firebaseio.com",
        projectId: "squad-health-check-c6d92",
        storageBucket: "squad-health-check-c6d92.appspot.com",
        messagingSenderId: "229194561034"
      };
      firebase.initializeApp(config);
    },

    onClick(event) {
      console.log('CLICK');
    },

    openTab(project) {
      console.log(project.name);
      
      this.projects.push(project); 
      console.log(this.projects);
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
