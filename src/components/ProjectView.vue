<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import store from '../store/'
  import ProjectHeader from './ProjectHeader';

  export default {
    name: 'ProjectView',

    components: {
      ProjectHeader
    },

    data: () => ({
      criteria: []
    }),

    computed: {
      project() {
          return store.getters.getProject(this.$route.params.id);
      }
    },

    created() {
      this.loadData();
      this.getCriteria();
    },

    beforeMount() {
      this.$router.push({ name: 'ManageTeamHealth' });
    },

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

      loadData() {
        // Promise.all([this.getProject(), this.getSprints()])
        //   .then((results) => {
        //     const [project, sprints] = results;
        //     this.project = project;
        //     this.sprints = !_.isNil(sprints) ? sprints : [];
        //     this.updateSession();
        // });
      },

      getCriteria() {
        FirebaseService.getCriteria().then((data) => this.criteria = data);
      },

      getProject() {

        // return FirebaseService.getProject(this.$route.params.id);
      },

      getSprints() {
        return FirebaseService.getSprints(this.$route.params.id);
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
      :criteria="criteria"
      :project="project"
      class="grid__item"></router-view>
    <router-view
      :project="project"
      class="BINGO" name="manageTeams"></router-view>
    <router-view name="manageSprints"></router-view>
  </main>
</template>

<style>

</style>