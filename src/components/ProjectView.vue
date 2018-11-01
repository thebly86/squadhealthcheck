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
      },

      latestSprint() {
        return _.findLast(_.orderBy(this.project.sprints, "sprintNumber", "asc"));
      }
    },

    // Events
    created() {
      this.getCriteria();

      // Persists the current sprint correctly on navigation or refreshing the app.
      this.$store.commit('updateCurrentSprint', 
        { projectId: this.project.id, ...this.latestSprint });
    },

    mounted() {
      if (this.hasProjectData()) 
      {
        this.$router.push({ name: 'ManageTeamHealth' });
      }
      else if (_.isEmpty(this.project.teams)) 
      {
        this.$router.push({ name: 'ManageTeams' });
      }
      else if (_.isEmpty(this.project.sprints)) 
      {
        this.$router.push({ name: 'ManageSprints' });
      }
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
      },

      hasProjectData() {
        return !_.isEmpty(this.project.teams) && !_.isEmpty(this.project.sprints);
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

    <router-view class="grid__item"></router-view>
    <router-view name="manageTeams"></router-view>
    <router-view name="manageSprints"></router-view>
  </main>
</template>

<style>

</style>