<template>
    <main class="grid">
      <header class="grid__item u-10/12 header">
        <h2>MANAGE PROJECTS</h2>
      </header>
      <div class="grid__item u-2/12 action-bar align-right">
        <button 
          @click="openModal"
          class="btn-primary">
          ADD PROJECT
        </button>
      </div>
      <table class="grid__item projects-table">
        <colgroup>
          <col class="projects-table__icon">
          <col class="projects-table__name">
          <col class="projects-table__edit">
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>PROJECT</th>
            <th></th><th></th>
          </tr>
        </thead>
        <tbody>
          <project
            v-for="(project, i) in projects"
            :key="i"
            :project="project"
            @click.native="$emit('openTab', project)">
          </project>
        </tbody>
      </table>

      <!-- Add project modal --> 
      <Modal
        ref="addProjectModal"
        id="addProject"
        name="Add Project"
        :show="showModal">
        <form>
          <label for="projectTitle">Project title</label>
          <input id="projectTitle" name="projectTitle" type="text"></input>
        </form>
      </Modal>
    </main>
</template>


<script>
import Project from './Project';
import Modal from './Modal';
import * as firebase from "firebase";
import { slugify } from '../utils/utils';

export default {
  name: 'ProjectList',

  components: {
    Project,
    Modal
  },


  data: () => ({
    columns: [
      { heading: 'Icon', isVisible: false },
      { heading: 'Name', isVisible: true }
    ],
    rows: [],
    projects: {},
    selectedProject: {},
    newProject: "",
    showModal: false
  }),


  created() {
    this.loadData();
  },


  methods: {
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
    openProject(project) {
      let selectedProject = this.getSelectedProject();
      console.log(selectedProject);

      if (!_.isNil(selectedProject) && !_.isEmpty(selectedProject)) {
        selectedProject.isSelected = false;
      }

      project.isSelected = true;
      this.selectedProject = project;
      this.$emit('openTab', project);
    },

    openModal() {
      console.log('open');
      this.showModal = true;
    },

    closeModal() {
      console.log('close');
      this.showModal = false;
    },

    save() {
      let project = {
        icon: 'lr-logo',
        name: ''
      }

      console.log('ProjectList [save]', newProject);



      // let ref = firebase.database().ref('sprints/' + this.project.id + "/" + // this.project.activeSprint.id + "/teams");
      // ref.set(this.project.activeSprint.teams);
      
      
      /*
      let teamSprint = {};
      _.forEach(this.criteria, (criterion) => {
          teamSprint[this.camelize(criterion.label)] = { value: 0 };
      })

      this.project.teams[slugify(this.camelize(this.newTeam))] = true;
      // Add team to current sprint:
      _.forEach(this.project.sprints, (sprint) => {
          sprint.teams[slugify(this.camelize(this.newTeam))] = teamSprint;
      });
      this.newTeam = "";
      this.$forceUpdate();

      console.log(this.project);
      */
    }
  }
}
</script>


<style>
  .projects-table {
    
  }

  .projects-table__icon {
    width: 10%;
    padding-left: 10px;
  }

  .projects-table__name {
    width: 80%;
  }

  .projects-table__edit {
    width: 10%;
    color: var(--health-green);
  }
</style>