<script>
  import TeamList from "@/components/TeamList";

  export default {
    name: 'ManageTeams',

    // Template dependencies
    components: {
      TeamList
    },

    // Local state
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

      validTeam: function() {
        return !Validator.isEmpty(this.newTeamName) &&
          Validator.isAlphaNumeric(this.newTeamName) &&
          !this.hasTeam();
      }
    },

    // Non-reactive properties
    method: {
      hasTeam() {
        return _.find(this.project.teams, { name: this.newTeamName });
      },

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
      }
    }
  }
</script>

<template>
  <section>
    <h3>Teams</h3>
    <team-list></team-list>

    <!-- Add team  -->
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

</style>