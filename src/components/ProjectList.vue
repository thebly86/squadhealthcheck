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
        :showModal="showModal">
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
import FirebaseService from '../utils/firebase/firebase-service';
import ProjectService from '../utils/firebase/project-service';
import { slugify } from '../utils/utils';

export default {
  name: 'ProjectList',

  components: {
    Project,
    Modal
  },


  data: () => ({
    projects: {},
    newProject: "",
    showModal: true
  }),


  created() {
    FirebaseService.getProjects().then((data) => this.projects = data);
  },


  methods: {
    openModal() {
      
    },

    closeModal() {
      
    },

    save() {


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