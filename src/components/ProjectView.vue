<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import ProjectHeader from './ProjectHeader';

  export default {
    name: 'ProjectView',

    // Template dependencies
    components: {
      ProjectHeader
    },

    // Local state
    data: () => ({
      criteria: []
    }),

    computed: {
      project() {
          return this.$store.getters.getProject(this.$route.params.id);
      }
    },

    // Events
    created() {
      this.getCriteria();
    },

    beforeMount() {
      this.$router.push({ name: 'ManageTeamHealth' });
    },

    // Non-Reactive properties
    methods: {
      closeProjectTab() {
        this.$emit('closeTab', { id: this.$route.params.id });
        },

      addSprint() {
        const sprint = { teams: [] };
        _.forEach(this.project.teams, (team) => {
          _.forEach(this.criteria, (criterion) => {
            sprint.teams[team][criterion] = {
              value: 0
            }
          });
        });
      },

      getCriteria() {
        FirebaseService.getCriteria().then((data) => this.criteria = data);
      },

      reset() {
        this.sprints = JSON.parse(sessionStorage.getItem(`${this.project.id}.sprints`));
      },

      updateTeams(team) {
        // Create teams property if it doesn't exist
        if (!this.project.teams) {
          this.project.teams = [];
        }
        let teamKey = _.camelCase(team);
        this.project.teams[teamKey] = team;
      }
    }
  }
</script>

<template>
  <main
    v-if="project"
    class="grid">
    <ProjectHeader
      @closeProjectTab="closeProjectTab"
      v-if="project">
    </ProjectHeader>

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
      @createSprint="addSprint"
      :project="project"
      class="grid__item"></router-view>
    <router-view
      :project="project"
      name="manageTeams"></router-view>
    <router-view name="manageSprints"></router-view>
  </main>
</template>

<style>

</style>