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
          class: 'btn--primary btn--danger',
          action: this.deleteProject
        }
      ]
    },

    editActions: function() {
      return [
        {
          name: 'Update',
          class: 'btn--primary',
          action: this.editProject
        }
      ]
    }
  },

  // Non-reactive properties
  methods: {
    
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