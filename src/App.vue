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
        this.$router.push({ name: 'SquadHealthCheck', params: { id: project.id}});
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
