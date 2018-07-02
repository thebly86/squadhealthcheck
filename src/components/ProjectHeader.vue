<script>
import store from '../store/';
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
    showEditModal: false
  }),

  computed: {
    project() {
        return store.getters.getProject(this.$route.params.id);
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
          name: 'Save',
          class: 'btn-primary',
          action: this.editProject
        }
      ]
    }
  },

  // Non-reactive properties
  methods: {
    editProject() {
      console.log('edit');

    },

    deleteProject() {
      console.log('delete')
      FirebaseService.deleteProject(this.project);
      store.commit('removeProject', { ...this.project })
      this.$emit('closeTab', this.project);
    }
  }
}
</script>

<template>
  <header class="grid__item header">
    <div class="grid">
      <div class="grid__item u-8/12">
        <h2 class="project-title">{{ project.name }}</h2>
        <ul class="actions">
          <router-link 
            to="health" 
            tag="li" 
            class="actions__item">
            <i class="fa fa-heartbeat icon--action"/>
            <span>TEAM HEALTH</span>
          </router-link>
          <router-link 
            to="teams" 
            tag="li" 
            class="actions__item">
            <i class="fa fa-user icon--action"/>
            <span>TEAMS</span>
          </router-link>
          <router-link 
            to="sprints" 
            tag="li" 
            class="actions__item">
            <i class="fa fa-bolt icon--action"/>
            <span>SPRINTS</span>
          </router-link>
        </ul>
      </div>

      <div class="grid__item u-4/12">
        <div class="action-bar--project">
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
        </div>
      </div>

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

    <Modal
      v-if="showEditModal"
      title="Edit Project"
      :actions="editActions"
      @close="showEditModal = false">
      <div slot="body">
        <form>

        </form>
      </div>
    </Modal>
    </div>
  </header>
</template>

<style>
  .actions {
    display: inline-block;
    list-style: none;
    color: var(--darker-grey);
    font-weight: 500;
  }

  .actions__item {
    cursor: pointer;
    text-decoration: underline;
  }

  li.actions__item .tab__link--active {
    color: var(--health-green);
  } 

  .actions__item span:hover {
    text-decoration: underline;
  }

  .action-bar--project {
    float: right;
  }

  .tab__link--active span {
    color: var(--health-green);
    text-decoration: underline;
  }

  .tab__link--active .icon--action {
    color: var(--health-green);
  }

  .project-title {
    display: inline-block;
    margin-right: 40px;
  }
</style>