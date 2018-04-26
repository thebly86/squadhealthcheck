<template>
    <main class="grid">
      <header class="grid__item u-9/12 header">
        <h2>MANAGE PROJECTS</h2>
      </header>
      <div class="grid__item u-3/12 action-bar">
        <button 
          @click="openModal"
          class="btn-primary action-bar__button">
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

    }
  }
}
</script>


<style>
  .projects-table tr:hover {
    cursor: pointer;
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

  .action-bar__button {
    float: right;
  }
</style>