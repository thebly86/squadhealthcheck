<template>
  <main class="grid">
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
            <button class="btn-secondary">
              Edit
            </button>
            <button
              @click="showDeleteModal = true" 
              class="btn--danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </header>

    <section 
      v-if="!project.teams"
      class="grid__item no-data">
      <p>
        <router-link 
          :to="{ name: 'ManageTeams', params: { showModal: true }}"
          class="no-data__link">
          Add a team
        </router-link>
        to get started.
      </p>
    </section>

    <Modal
      v-if="showDeleteModal"
      title="Delete Project"
      v-bind:actions="deleteActions"
      @close="showDeleteModal = false">
      <div slot="body">
        <p>
          Are you sure you want to delete this project? <br/><br/>
          <b>All team and sprint data will be lost permanently.</b>
        </p>
      </div>
    </Modal>

    <router-view 
      @reset="reset"
      @teamAdded="updateTeams"
      :project="project" 
      :sprints="sprints"
      class="grid__item"></router-view>
    <router-view class="BINGO" name="manageTeams"></router-view>
    <router-view name="manageSprints"></router-view>
  </main>
</template>


<script>
import FirebaseService from '../utils/firebase/firebase-service.js';
import Modal from './Modal';

export default {
  name: 'ProjectView',

  components: {
    Modal
  },

  data: () => ({
    project: {},
    sprints: [],
    showDeleteModal: false,
    showEditModal: false
  }),

  computed: {
    deleteActions: function() {
      return [
        {
          name: 'Delete',
          class: 'btn-primary btn--danger',
          action: this.deleteProject
        }, 
        {
          name: 'Cancel',
          class: 'btn-secondary',
          action: () => this.showDeleteModal = false
        }
      ]
    }
  },


  created() {
    this.loadData();
  },

  beforeMount() {
    this.$router.push({ name: 'ManageTeamHealth' });
  },


  methods: {
    deleteProject() {
      FirebaseService.deleteProject(this.project);
      this.$emit('closeTab', this.project);
    },

    loadData() {
      Promise.all([this.getProject(), this.getSprints()])
        .then((results) => {
          const [project, sprints] = results;
          this.project = project;
          this.sprints = !_.isNil(sprints) ? sprints : [];
          this.updateSession();
      });
    },

    getProject() {
      return FirebaseService.getProject(this.$route.params.id);
    },

    getSprints() {
      return FirebaseService.getSprints(this.$route.params.id);
    },

    reset() {
      this.sprints = sessionStorage.getItem(`${this.project.id}.sprints`);
    },

    updateTeams(team) {
      // Create teams property if it doesn't exist
      if (!this.project.teams) {
        this.project.teams = [];
      }
      let teamKey = _.camelCase(team);
      this.project.teams[teamKey] = team;
      this.updateSession();
    },

    updateSession() {
      sessionStorage.setItem(`${this.project.id}`, JSON.stringify(this.project));
      sessionStorage.setItem(`${this.project.id}.sprints`, JSON.stringify(this.sprints));
    }
  },


  watch: {
    '$route': function (to, from) {
      this.loadData();
    }
  }
}
</script>


<style>
  .subtitle {
    font-weight: 500;
    font-style: italic;
    margin: 0;
    color: var(--darker-grey);
  }

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

  .secondary__actions {

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