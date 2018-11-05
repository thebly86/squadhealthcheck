<script>
import FirebaseService from '../utils/firebase/firebase-service.js';

import DropdownMenu from './DropdownMenu';
import DropdownMenuButton from './DropdownMenuButton';
import Modal from './Modal';

export default {
  name: 'ProjectHeader',

  // Template dependencies
  components: {
    DropdownMenu,
    DropdownMenuButton,
    Modal
  },

  // Local state
  data: () => ({
    showDeleteModal: false,
    showEditModal: false,
    newProjectName: ""
  }),

  computed: {
    project() {
        return this.$store.getters.getProject(this.$route.params.id);
    },

    deleteActions: function() {
      return [
        {
          name: 'Delete',
          class: 'btn-primary btn--danger',
          action: this.deleteProject
        }
      ]
    },

    editActions: function() {
      return [
        {
          name: 'Update',
          class: 'btn-primary',
          action: this.editProject
        }
      ]
    }
  },

  // Non-reactive properties
  methods: {
    editProject() {
      this.project.name = this.newProjectName;
      FirebaseService.saveProject(this.project);
      this.newProjectName = ""
      this.showEditModal = false;

    },

    deleteProject() {
      FirebaseService.deleteProject(this.project);
      this.$store.commit('removeProject', { ...this.project })
      this.$emit('closeProjectTab', this.project);
    }
  }
}
</script>

<template>
  <header class="header">
    <h2 class="project-title">{{ project.name }}</h2>

    <!-- Project navigation -->
    <ul class="project-nav">
      <li class="project-nav__item">
        <router-link
          to="health">
          <i class="fa fa-heartbeat icon--action"/>
          <span>TEAM HEALTH</span>
        </router-link>
      </li>
      <li class="project-nav__item">
        <router-link
          to="teams">
          <i class="fa fa-user icon--action"/>
          <span>TEAMS</span>
        </router-link>
      </li>
      <li class="project-nav__item">
        <router-link
          to="sprints">
          <i class="fa fa-bolt icon--action"/>
          <span>SPRINTS</span>
        </router-link>
      </li>
    </ul>

    <!-- Action bar -->
    <ul class="action-bar">
      <li class="action-bar__item">
        <DropdownMenu title="OPTIONS">
          <DropdownMenuButton
            text="Edit project"
            @click.native="showEditModal = true"
            :class="['dropdown__button', 'dropdown__button--edit']">
          </DropdownMenuButton>
          <DropdownMenuButton
            text="Delete project"
            @click.native="showDeleteModal = true"
            :class="['dropdown__button', 'dropdown__button--delete']">
          </DropdownMenuButton>
        </DropdownMenu>
      </li>
    </ul>

    <!-- Delete project modal -->
    <Modal
        v-if="showDeleteModal"
        title="Delete Project"
        v-bind:actions="deleteActions"
        @close="showDeleteModal = false">
      <div slot="header" class="text--danger">

      </div>
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this project? <br/><br/>
          <b>All team and sprint data will be lost permanently.</b>
        </p>
      </div>
    </Modal>

    <!-- Edit project modal -->
    <Modal
      v-if="showEditModal"
      title="Edit Project"
      :actions="editActions"
      @close="showEditModal = false">
      <div slot="body">
        <form>
          <label for="projectName">Project Name</label>
          <input v-model.trim="newProjectName" type="text" name="projectName">
        </form>
      </div>
    </Modal>
  </header>
</template>

<style scoped>
  .project-title {
    margin-right: 20px;
  }

  .project-nav {
    display: flex;
    align-items: center;
  }

  .project-nav__item {
    margin-right: 15px;
  }

  li.actions__item .tab__link--active {
    color: var(--health-green);
  } 

  .tab__link--active span {
    color: var(--health-green);
    text-decoration: underline;
  }

  .tab__link--active .icon--action {
    color: var(--health-green);
  }
</style>