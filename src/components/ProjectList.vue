<template>
    <main class="grid">
      <header class="grid__item header">
        <div class="grid">
          <div class="grid__item u-9/12">
            <h2>MANAGE PROJECTS</h2>
          </div>
          <div class="grid__item u-3/12 action-bar--project-list">
            <button 
              @click="showModal = true"
              class="btn-primary action-bar__button">
              ADD PROJECT
            </button>
          </div>
        </div>
      </header>
      <table class="grid__item projects-table">
        <colgroup>
          <col class="projects-table__icon">
          <col class="projects-table__name">
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>PROJECT</th>
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
      
      <!-- Add Project modal -->
      <Modal
        v-if="showModal"
        title="Add Project"
        v-bind:actions="actions"
        @close="showModal = false">
        <div slot="body">
          <form>
            <label>Project name</label>
            <input type="text" name="text"/>
          </form>
        </div>
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
    showModal: false
  }),

  created() {
    FirebaseService.getProjects().then((data) => this.projects = data);
  },

  computed: {
    actions: function() {
      return [
        {
          name: 'Save',
          class: 'btn-primary',
          action: this.save
        }, 
        {
          name: 'Cancel',
          class: 'btn-secondary',
          action: () => this.showModal = false
        }
      ]
    }
  },

  methods: {
    save() {
      console.log('you saved');
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
    width: 90%;
  }

  .action-bar__button {
    float: right;
  }
</style>