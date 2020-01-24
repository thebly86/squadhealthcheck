<script>
import DataList from "@/components/DataList";
import Modal from "@/components/Modal";
import Validator from "@/utils/validation.js";
import Spinner from "@/components/Spinner";

export default {
  name: "Dashboard",
  /* Template dependencies */
  components: {
    DataList,
    Modal,
    Spinner
  },

  /* Local state */
  data: () => ({
    fields: [
      {
        field: "name",
        visible: true
      },
      {
        field: "color",
        visible: false
      }
    ],

    newProject: {
      name: "",
      color: "#cccccc"
    },

    modals: {
      add: false,
      edit: false,
      delete: false
    },

    loading: false,
    error: false
  }),

  computed: {
    actions: function() {
      return [
        {
          type: "edit",
          name: "Edit",
          action: this.openModal,
          class: "btn--outlined"
        },
        {
          type: "delete",
          name: "Delete",
          action: this.openModal,
          class: "btn--danger"
        }
      ];
    },

    projects: function() {
      return this.$store.state.projects;
    },

    selectedProject: function() {
      return this.$store.getters.getActiveProject;
    },

    user: function() {
      return this.$store.getters.getUser;
    },

    validProject: function() {
      return project =>
        !this.projectExists(project) &&
        !Validator.isEmpty(project.name) &&
        Validator.isAlphaNumeric(project.name);
    }
  },

  /* Events */
  /**
   * @summary when Dashboard first loads, we send a request to load all the available projects from
   * firebase.
   */
  created() {
    if (this.user && this.user.uid) {
      this.loadProjects();
    }
  },

  /* Non-reactive properties */
  methods: {
    /**
     * @summary routes the user to the 'ManageProject' screen
     */
    openProject(id) {
      this.$router.push({ name: "ManageProject", params: { id } });
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
      this.$store.commit("setActiveProject", _.clone(project));
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
      let projects = this.projects;
      if (project.id) {
        projects = _.omit(projects, project.id);
      }
      return _.find(projects, { name: project.name });
    },

    /**
     *
     */
    async loadProjects() {
      try {
        this.loading = true;
        await this.$store.dispatch("getProjects", this.user.uid);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = true;
      }
    },

    /**
     * @summary dispatches action to save the new team to firevase and the vuex store,
     * then closes the add modal.
     */
    async addProject() {
      const project = { ...this.newProject, owner: this.user.uid };

      try {
        await this.$store.dispatch("addProject", project);

        this.newProject = {
          name: "",
          color: "#cccccc"
        };
        this.$notify({
          group: "app",
          text: "New project added.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }
      this.modals.add = false;
    },

    /**
     * @summary dispatches action to update the selected in firebase and the vuex store,
     * then closes the edit modal.
     */
    async updateProject() {
      const keys = _.map(this.fields, field => field.field);

      try {
        await this.$store.dispatch("updateProject", {
          ...this.selectedProject,
          keys
        });
        this.$notify({
          group: "app",
          text: "Project updated successfully.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }

      this.modals.edit = false;
    },

    /**
     * @summary dispatches action to delete the selected project from firebase and the vuex store,
     * then closes the delete modal.
     */
    deleteProject() {
      try {
        this.$store.dispatch("deleteProject", this.selectedProject.id);
        this.$notify({
          group: "app",
          text: "Project deleted succesfully.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }

      this.modals.delete = false;
    }
  }
};
</script>

<template>
  <section class="dashboard">
    <header class="header dashboard__header">
      <h2>My Projects</h2>
      <ul class="action-bar">
        <li class="action-bar__item">
          <button @click="modals.add = true" class="btn--primary">New Project</button>
        </li>
      </ul>
    </header>

    <div class="dashboard__content">
      <section v-if="!hasProjects()" class="no-data no-data--projects">
        <p>
          <a @click="modals.add = true" class="no-data__link">Add a project</a>
          to get started.
        </p>
      </section>

      <!-- Project List -->
      <data-list
        v-if="hasProjects() && !loading && !error"
        :dataList="projects"
        :fields="fields"
        :actions="actions"
        :showIcon="true"
        @onClick="openProject"
        class="dashboard__items"
      ></data-list>

      <Spinner :visible="loading" />

      <div v-if="error" class="error">
        <p>Unable to retrieve any projects. Please try again soon.</p>
      </div>
    </div>

    <!-- Add Project modal -->
    <Modal v-if="modals.add" title="Add Project" @close="modals.add = false">
      <div slot="body">
        <form @submit.prevent="addProject" id="form-add-project">
          <div>
            <label for="projectName">Project name</label>
            <input
              v-model.trim="newProject.name"
              type="text"
              name="projectName"
              id="input_add-project-name"
            />
          </div>
          <div>
            <label for="projectColor">Project colour</label>
            <input
              v-model="newProject.color"
              type="color"
              name="projectColor"
              value="#CCCCCC"
              class="project-color"
              id="input_add-project-color"
            />
          </div>
        </form>
        <div v-if="projectExists(newProject)" class="error">
          <p class="error__text">This project already exists.</p>
        </div>
      </div>
      <div slot="buttons">
        <button
          @click="addProject()"
          :disabled="!validProject(newProject)"
          class="button btn--primary"
          id="btn_add-project"
        >Save</button>
      </div>
    </Modal>

    <!-- Edit project modal -->
    <Modal v-if="modals.edit" title="Edit Project" @close="modals.edit = false">
      <div slot="body">
        <form @submit.prevent="updateProject">
          <div>
            <label for="projectName">Project name</label>
            <input
              v-model.trim="selectedProject.name"
              type="text"
              name="projectName"
              id="input_edit-project-name"
            />
          </div>
          <div>
            <label for="projectColor">Project colour</label>
            <input
              v-model.trim="selectedProject.color"
              type="color"
              name="projectColor"
              class="project-color"
              id="input_edit-project-color"
            />
          </div>
        </form>
        <div v-if="projectExists(selectedProject)" class="error">
          <p class="error__text">This project already exists.</p>
        </div>
      </div>
      <div slot="buttons">
        <button
          @click="updateProject()"
          :disabled="!validProject(selectedProject)"
          class="button btn--primary"
          id="btn_update-project"
        >Save</button>
      </div>
    </Modal>

    <!-- Delete project modal -->
    <Modal v-if="modals.delete" title="Delete Project" @close="modals.delete = false">
      <div slot="header" class="text--danger"></div>
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this project?
          <br />
          <br />
          <b>All team and sprint data will be lost permanently.</b>
        </p>
      </div>
      <div slot="buttons">
        <button @click="deleteProject()" class="button btn--danger" id="btn_delete-project">Delete</button>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.dashboard {
  height: 100%;
}

.dashboard__header {
  background-color: var(--dark-grey);
  color: var(--light);
}

.dashboard__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 75px);
}

.dashboard__items {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: var(--light);
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
