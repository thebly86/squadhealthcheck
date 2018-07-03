<script>
import Project from './Project';
import Modal from './Modal';
import FirebaseService from '../utils/firebase/firebase-service';
import { SSL_OP_NETSCAPE_CHALLENGE_BUG } from 'constants';

export default {
  name: 'ProjectList',
  
  // Template dependencies
  components: {
    Project,
    Modal
  },

  // Local state
  data: () => ({
    newProject: "",
    showModal: false
  }),

  computed: {
    actions() {
      return [
        {
          name: 'Save',
          class: 'btn-primary',
          action: this.save
        }
      ]
    },

    hasProjects() {
      return !_.isEmpty(this.projects);
    },
    projects() {
      return this.$store.state.projects
    }
  },

  // Non-Reactive properties
  methods: {
    save() {
      const project = {
        id: _.camelCase(this.newProject),
        name: this.newProject,
        sprints: {},
        teams: {}
      };
      FirebaseService.saveProject(project);
      this.$store.commit('addProject', { project })

      // If this is first project to be added, reload:
      if (_.isEmpty(this.projects)) {
        location.reload();
      }
      else {
        this.projects[project.id] = project;
        this.showModal = false;
        this.newProject = "";
      }
    }
  }
}
</script>

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
      <section 
        v-if="!hasProjects"
        class="grid__item no-data no-data--projects">
        <p>
          <a
            @click="showModal = true"
            class="no-data__link">
            Add a project
          </a>
          to get started.
        </p>
      </section>
      <table 
        v-if="hasProjects"
        class="grid__item projects-table">
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
          <form submit.prevent="save">
            <label>Project name</label>
            <input type="text" name="text" v-model.trim="newProject"/>
          </form>
        </div>
      </Modal>
    </main>
</template>

<style>
  .projects-table tr:hover {
    cursor: pointer;
  }

  .projects-table__icon {
    width: 10%;
  }

  .projects-table__name {
    width: 90%;
  }

  .action-bar__button {
    float: right;
  }
</style>