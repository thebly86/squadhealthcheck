<template>
  <div id="app">
    <div class="container text-left p-3">
      <header class="header">
        <div class="header__icon">
          <i class="fa fa-heartbeat"/>
        </div>
        <h1 class="header__title">Squad Health Check</h1>
      </header>
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
    </div>
  </div>
</template>

<script>
import TabGroup from './components/TabGroup';
import Tab from './components/Tab';
import ProjectList from './components/ProjectList';
import SquadHealthCheck from './components/SquadHealthCheck';
import * as firebase from "firebase";
import { slugify } from './utils/utils';

export default {
  name: 'App',

  components: {
    TabGroup,
    Tab,
    ProjectList,
    SquadHealthCheck
  },

  data: () => ({
    projects: {},
    criteria: {},
    selectedProject: {}
  }),

  created() {
    if (!firebase.apps.length) {
      this.initialiseDatabase();
      this.loadData();
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

    /**
     * Loads the initial data from firebase
     */
    loadData() {
      let database = firebase.database();
      database.ref('projects').once('value').then(function(snapshot) {
        this.projects = snapshot.val();
      }.bind(this));

      database.ref('criteria').once('value').then(function(snapshot) {
        this.criteria = snapshot.val();
      }.bind(this));
    },

    /**
     * Loads the sprint data of the selected project from firebase 
     */
    loadProjectData() {
      // Load project sprints and sort them
      let ref = firebase.database().ref('sprints/' + this.selectedProject.id);
      return ref.orderByKey().once('value').then(function(snapshot) {
        let sprints = _.filter(snapshot.val(), (sprint) => !_.isEmpty(sprint));
        sprints = _.sortBy(sprints, (sprint) => sprint.id);
        this.selectedProject.sprints = sprints;

        // If project has at least one sprint, most recent is made active
        if (_.size(sprints) >= 1) {
          this.selectedProject.activeSprint = sprints[_.size(sprints) - 1];
        }

        // Set previous sprint to the active sprint, if present
        if (_.size(sprints) >= 2) {
          this.selectedProject.previousSprint = sprints[_.size(sprints) - 2]
        }
      }.bind(this));
    },

    /** 
     * Returns the project that was recently selected
     */
    getSelectedProject() {
      return _.find(this.projects, (project) => project.isSelected);
    },

    /**
     * Updates the project displayed in the project tab
     * @param project 
     */
    setSelectedProject(project) {
      let selectedProject = this.getSelectedProject();

      if (!_.isNil(selectedProject) && !_.isEmpty(selectedProject)) {
        selectedProject.isSelected = false;
      }

      project.isSelected = true;
      this.selectedProject = project;

      /*
       * TODO: Find a nicer way handling async stuff, other than chain 'then'.
       * This bit loads the project data then updates the view, before selecting
       * the project tab.
       */
      this.loadProjectData().then(() => {
        this.$forceUpdate();
      })
      .then(() => {
        this.$refs.tabGroup.tabs = _.map(this.$refs.tabGroup.tabs, (tab) => {
          tab.isSelected = false;
          return tab;
        });

        const projectTab = _.find(this.$refs.tabGroup.tabs, { hash: '#' + slugify(project.name) });
        projectTab.isSelected = true;
      });
    }
  }
}


</script>


<style>
/* TO DO: move global styles to external stylesheet */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E9E9E9;
}

.app-view {
  background-color: #FFF;
}

.header {
  font-size: 30px;
}

.header__icon {
  display: inline-block;
  color: #4CC797;
}

.header__title {
  display: inline-block;
  font-size: 30px;
  font-weight: lighter;
  color: #333333;
}

h2 {
  color: #4cc797;
  font-size: 1.5em;
}

label {
  display: block;
}

input[type=text] {
  width: 100%;
}
</style>
