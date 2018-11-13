<script>
  import Validator from '@/utils/validation.js'
  import DataList from "@/components/DataList";

  export default {
    name: 'ManageTeams',

    // Template dependencies
    components: {
      DataList
    },

    // Local state
    data: () => ({
      actions: [
        {
          name: 'Edit',
          action: this.updateTeam,
          class: 'btn--outlined'
        },
        {
          name: 'Delete',
          action: this.deleteTeam,
          class: 'btn--danger'
        }
      ],
      keys: ['name'],
      newTeam: ""
    }),

    computed: {
      project() {
        return this.$store.getters.getProject(this.$route.params.id);
      },

      validTeam() {
        return !Validator.isEmpty(this.newTeam) &&
          Validator.isAlphaNumeric(this.newTeam) &&
          !this.teamExists();
      }
    },

    // Events
    created() {
    },

    // Non-reactive properties
    methods: {
      deleteTeam() {
        console.log('delete');
      },

      editTeam() {
        console.log('edit');
      },

      teamExists() {
        return _.find(this.project.teams, { name: this.newTeam });
      },

      save() {
        const team = {
          id: _.camelCase(this.newTeam),
          name: this.newTeam
        };

        this.$store.dispatch('addTeam', {  projectId: this.project.id, team });
        this.newTeam = "";
      }
    }
  }
</script>

<template>
  <section>
    <data-list
      :dataList="project.teams"
      :keys="keys"
      :actions="actions">
    </data-list>
    <section class="add-row">
      <form @submit.prevent="save()">
        <input
          v-model.trim="newTeam"
          type="text"
          name="teamname"
          placeholder="Enter a new team name"
          id="team-name-input"
          :class="{ invalid: teamExists() }"
          required/>
      </form>
      <div
        v-if="teamExists()" 
        class="error">
        <p class="error-message">This team already exists.</p>
      </div>
      <button
        v-if="!teamExists()"
        @click="save()"
        :disabled="!validTeam"
        class="btn--primary">
        Add Team
      </button>
    </section>
  </section>
</template>

<style scoped>
  .add-row {
    display: flex;
    align-items: center;
    padding: 20px;
    border-top: 1px solid var(--light-grey);
  }

  .add-row form {
    margin-right: 20px;
  }
</style>