<script>
  import ProjectList from '@/components/ProjectList';
  import Modal from '@/components/Modal';
  import FirebaseService from '@/utils/firebase/firebase-service';

  export default {
    name: 'Projects',

    // Template dependencies
    components: {
      ProjectList,
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

      projects() {
        return this.$store.state.projects
      }
    },

    // Non-reactive properties
    methods: {
      hasProjects() {
        return !_.isEmpty(this.projects);
      },

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
          window.location.reload();

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
  <section class="background--white">
    <!-- Projects Header -->
    <header class="header">
      <div>
        <div>
          <h2>MANAGE PROJECTS</h2>
        </div>
        <div class="action-bar--project-list">
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
      class="no-data no-data--projects">
      <p>
        <a
          @click="showModal = true"
          class="no-data__link">
          Add a project
        </a>
        to get started.
      </p>
    </section>

    <!-- Project List -->
    <project-list
      v-if="hasProjects"
      :projects="projects">
    </project-list>

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
  </section>
</template>