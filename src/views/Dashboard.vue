<script>
  import DataList from '@/components/DataList';
  import Modal from '@/components/Modal';
  import Validator from '@/utils/validation.js'
  export default {
    name: 'Dashboard',
    /* Template dependencies */
    components: {
      DataList,
      Modal
    },
    /* Local state */
    data: () => ({
      fields: [
        {
          field: 'name',
          visible: true,
        },
        {
          field: 'color',
          visible: false
        }
      ],
      newProject: {
        name: '',
        color: '#cccccc'
      },
      modals: {
        add: false,
        edit: false,
        delete: false
      }
    }),
    computed: {
      actions: function() {
        return [
          {
          type: 'edit',
          name: 'Edit',
          action: this.openModal,
          class: 'btn--outlined'
        },
        {
          type: 'delete',
          name: 'Delete',
          action: this.openModal,
          class: 'btn--danger'
        }
        ]
      },
      projects: function() {
        return this.$store.state.projects;
      },
      selectedProject: function() {
        return this.$store.getters.getActiveProject;
      },
      validProject: function() {
        return (project) => !this.projectExists(project) &&
          !Validator.isEmpty(project.name) &&
          Validator.isAlphaNumeric(project.name)
      },
    },
    /* Events */
    /**
     * @summary when Dashboard first loads, we send a request to load all the available projects from
     * firebase.
     */
    created() {
      let firebaseConfig = localStorage.getItem('firebaseConfig');
      firebaseConfig = JSON.parse(firebaseConfig);

      let hasAllConfigValues = false

      for (var key in firebaseConfig) {
        if (firebaseConfig[key] !== null && firebaseConfig[key] != "") {
          hasAllConfigValues = true;
        }
      }

      if (firebaseConfig && hasAllConfigValues) {
        this.$store.dispatch('loadProjects');
      }
    },
    /* Non-reactive properties */
    methods: {
      /**
       * @summary routes the user to the 'ManageProject' screen
       */
      openProject(id) {
        this.$router.push({ name: 'ManageProject', params: { id }});
      },
      /**
       * @summary method is triggered when user clicks the edit or delete action for
       * a project - determining which modal to open and updating the selected project
       * in the vuex store.
       * @param {Object} action the action which the user selected 'edit' or 'delete'
       * @param {Object} project the project the user selected the action on
       * @param {String} projectId the unique identifier for a project
       */
      openModal({ type }, project, projectId) {
        this.modals[type] = true;
        project.id = projectId;
        this.$store.commit('setActiveProject', _.clone(project));
      },
      /**
       * @summary checks if there are any projects in the vuex store
       * @returns {Boolean} true or false
       */
      hasProjects() {
        return !_.isEmpty(this.projects);
      },
      /**
       * @summary checks if the project with a given name already exists
       * @param {Object} project the project to find
       * @returns {Boolean} true or false
       */
      projectExists(project) {
        // omits the project from the list to check against when editing, so it doesn't validate against itself
        let projects = this.projects
        if (project.id) {
          projects = _.omit(projects, project.id);
        }
        return _.find(projects, { name: project.name });
      },
      /**
       * @summary dispatches action to save the new team to firevase and the vuex store,
       * then closes the add modal.
       */
      addProject() {
        this.$store.dispatch('addProject', this.newProject);
        // Reset new project and close modal
        this.newProject = {
          name: '',
          color: '#cccccc'
        };
        this.modals.add = false;
      },
      /**
       * @summary dispatches action to update the selected in firebase and the vuex store,
       * then closes the edit modal.
       */
      updateProject() {
        const keys = _.map(this.fields, (field) => field.field );
        this.$store.dispatch('updateProject', { ...this.selectedProject, keys });
        this.modals.edit = false;
      },
      /**
       * @summary dispatches action to delete the selected project from firebase and the vuex store,
       * then closes the delete modal.
       */
      deleteProject() {
        this.$store.dispatch('deleteProject', this.selectedProject.id);
        this.modals.delete = false;
      }
    }
  }
</script>

<template>
  <section>
    <header class="header">
      <h2>Dashboard</h2>
      <ul class="action-bar">
        <li class="action-bar__item">
          <button
            @click="modals.add = true"
            class="btn--primary">
            New Project
          </button>
        </li>
      </ul>
    </header>

    <section
      v-if="!hasProjects()"
      class="no-data no-data--projects">
      <p>
        <a
          @click="modals.add = true"
          class="no-data__link">
          Add a project
        </a>
        to get started.
      </p>
    </section>

    <!-- Project List -->
    <data-list
      v-if="hasProjects()"
      :dataList="projects"
      :fields="fields"
      :actions="actions"
      @onClick="openProject">
    </data-list>

     <!-- Add Project modal -->
    <Modal
      v-if="modals.add"
      title="Add Project"
      @close="modals.add = false">
      <div slot="body">
        <form
          @submit.prevent="addProject"
          id="form-add-project">
          <div>
            <label for="projectName">Project name</label>
            <input
              v-model.trim="newProject.name"
              type="text"
              name="projectName"
              id="input_add-project-name"/>
          </div>
          <div>
            <label for="projectColor">Project colour</label>
            <input
              v-model="newProject.color"
              type="color"
              name="projectColor"
              value="#CCCCCC"
              class="project-color"
              id="input_add-project-color"/>
          </div>
        </form>
        <div
          v-if="projectExists(newProject)"
          class="error">
          <p class="error__text">This project already exists.</p>
        </div>
      </div>
      <div slot="buttons">
        <button
          @click="addProject()"
          :disabled="!validProject(newProject)"
          class="button btn--primary"
          id="btn_add-project">
          Save
        </button>
      </div>
    </Modal>

    <!-- Edit project modal -->
    <Modal
      v-if="modals.edit"
      title="Edit Project"
      @close="modals.edit = false">
      <div slot="body">
        <form @submit.prevent="updateProject">
          <div>
            <label for="projectName">Project name</label>
            <input
              v-model.trim="selectedProject.name"
              type="text"
              name="projectName"
              id="input_edit-project-name">
          </div>
          <div>
            <label for="projectColor">Project colour</label>
            <input
              v-model.trim="selectedProject.color"
              type="color"
              name="projectColor"
              class="project-color"
              id="input_edit-project-color">
          </div>
        </form>
        <div
          v-if="projectExists(selectedProject)"
          class="error">
          <p class="error__text">This project already exists.</p>
        </div>
      </div>
      <div slot="buttons">
        <button
          @click="updateProject()"
          :disabled="!validProject(selectedProject)"
          class="button btn--primary"
          id="btn_update-project">
          Save
        </button>
      </div>
    </Modal>

    <!-- Delete project modal -->
    <Modal
        v-if="modals.delete"
        title="Delete Project"
        @close="modals.delete = false">
      <div slot="header" class="text--danger"></div>
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this project? <br/><br/>
          <b>All team and sprint data will be lost permanently.</b>
        </p>
      </div>
      <div slot="buttons">
        <button
          @click="deleteProject()"
          class="button btn--danger"
          id="btn_delete-project">
          Delete
        </button>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
  .data-list-item:hover {
    cursor: pointer;
    background-color: var(--lightest-grey);
  }
  .project-color {
    -webkit-appearance: none;
    border: none;
    padding: 0;
    margin: 0;
    min-width: 50px;
    min-height: 50px;
  }
</style>
