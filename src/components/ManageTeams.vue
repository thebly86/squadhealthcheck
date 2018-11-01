<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Validator from '../utils/validation/validation.js'
  import Modal from './Modal';
  import Team from "./Team";

  export default {
    name: 'ManageTeams',

    // Template dependencies
    components: {
      Team
    },

    // Local state
    data: () => ({
      newTeamName: ""
    }),

    computed: {
      actions: function() {
        return [
          {
            name: 'Save',
            class: 'btn-primary',
            action: this.save
          }
        ]
      },

      project() {
        return this.$store.getters.getProject(this.$route.params.id);
      },

      validTeam: function() {
        return !Validator.isEmpty(this.newTeamName) &&
          Validator.isAlphaNumeric(this.newTeamName) &&
          !this.hasTeam();
      }
    },

    // Events
    created() {
      console.log(this.project);
    },

    // Non-Reactive properties
    methods: {
      save() {
        const newTeam = {
          id: _.camelCase(this.newTeamName),
          name: this.newTeamName
        };

        FirebaseService.saveTeam(this.project, newTeam);
        this.$store.commit('addTeamToProject', {
          projectId: this.project.id,
          team: newTeam
        });

        this.newTeamName = "";
      },

      hasTeam() {
        return _.find(this.project.teams, { name: this.newTeamName });
      }
    }
  }
</script>

<template>
  <section class="teams">
    <section>
      <h3 class="subtitle">Teams</h3>
      <ul 
        v-if="project.teams"
        class="list">
        <team
          v-if="project.teams"
          v-for="team in project.teams"
          :key="team.id"
          :team="team"
          class="list__item">
        </team>
      </ul>
    </section>

    <!-- Add team -->
    <section class="add-row">
      <form id="add-team">
        <input
          v-model.trim="newTeamName"
          type="text"
          name="teamname"
          id="teamName"
          placeholder="Enter a new team..."
          required/>
      </form>
      <button
        @click="save"
        :disabled="!validTeam"
        class="btn--inline btn--add-team">
        <i class="icon icon--plus fa fa-plus"></i>
      </button>
    </section>
    <section 
      v-if="hasTeam()"
      class="error">
      <p class="error-message">This team already exists.</p>
    </section>
  </section>
</template>

<style scoped>
  .teams {
    padding: 5px 0px;
  }

  .error {
    margin-left: 15px;
  }

  .add-row {
    margin: 5px 0px 5px 15px;
    padding: 8px 0;
  }

  .btn--add-team {
    position: relative;
    left: 4%;
    top: 4px;
  }
  
  #add-team {
    width: 25%;
  }
</style>