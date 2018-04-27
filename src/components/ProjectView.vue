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
            <button class="btn--danger">
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

    <router-view 
      @teamAdded="updateTeams"
      :project="project" 
      class="grid__item"></router-view>
  </main>
</template>


<script>
import FirebaseService from '../utils/firebase/firebase-service.js';

export default {
  name: 'ProjectView',

  data: () => ({
    project: {},
    subtitle: "Squad Health"
  }),


  created() {
    this.getProject();
    console.log(sessionStorage);
  },

  beforeMount() {
    this.$router.push({ name: 'ManageTeamHealth' });
  },


  methods: {
    getProject() {
      let id = this.$route.params.id;

      // Load project data from session storage or firebase
      if (sessionStorage.getItem(id)) {
        this.project = JSON.parse(sessionStorage.getItem(id));
      }
      else {
        FirebaseService.getProject(id).then((data) => {
          this.project = data;
          this.updateSession();
        }); 
      }
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
      console.log('set project');
      sessionStorage.setItem(`${this.project.id}`, JSON.stringify(this.project));
      console.log('updateSession', sessionStorage);
    }
  },


  watch: {
    '$route': function (to, from) {
      this.getProject();
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

  .no-data {
    text-align: center;
    background: var(--lightest-grey);
  }

  .no-data__link {
    color: var(--health-green);
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }

  .no-data__link:visited {
    color: var(--health-green);
    background-color: var(--lightest-grey);
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