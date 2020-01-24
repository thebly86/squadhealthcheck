<script>
import Vue from "vue";

import DataList from "@/components/DataList";
import Modal from "@/components/Modal";
import Validator from "@/utils/validation.js";

export default {
  name: "ManageTeams",

  /* Template dependencies */
  components: {
    DataList,
    Modal
  },

  /* Local state */
  data: () => ({
    fields: [{ field: "name", visible: "true" }],
    newTeam: { name: "" },
    modals: {
      edit: false,
      delete: false
    }
  }),

  computed: {
    actions: function() {
      return [
        {
          type: "edit",
          name: "Edit",
          action: this.openModal,
          class: "btn--outlined"
        },
        {
          type: "delete",
          name: "Delete",
          action: this.openModal,
          class: "btn--danger"
        }
      ];
    },

    criteria: function() {
      return this.$store.getters.getCriteria;
    },

    project() {
      return this.$store.getters.getProject(this.$route.params.id);
    },

    selectedTeam: function() {
      return this.$store.getters.getActiveTeam;
    },

    validTeam: function() {
      return team =>
        !this.teamExists(team) &&
        !Validator.isEmpty(team.name) &&
        Validator.isAlphaNumeric(team.name);
    }
  },

  // Non-reactive properties
  methods: {
    /**
     * @summary method is triggered when user clicks the edit or delete action for
     * a team; determines which modal to open.
     * @param {Object} action the action which the user selected 'edit' or 'delete'
     * @param {Object} team the team the user selected the action on
     * @param {String} teamId the unique identifier for a team
     */
    openModal(action, team, teamId) {
      this.modals[action.type] = true;
      team.id = teamId;
      this.$store.commit("setActiveTeam", _.clone(team));
    },

    /**
     * @summary
     */
    _addTeamToSprints(teamId) {
      _.forEach(this.project.sprints, sprint => {
        if (!sprint.teams) {
          sprint.teams = {};
        }
        sprint.teams[teamId] = this._defaultSprintData();
      });
    },

    _deleteTeamFromSprints(teamId) {
      _.forEach(this.project.sprints, sprint => {
        if (sprint.teams) {
          Vue.delete(sprint.teams, teamId);
        }
      });
    },

    _defaultSprintData() {
      const defaultCriteria = this.criteria.map(criterion => ({
        criteria: criterion.label,
        value: 0
      }));
      return defaultCriteria;
    },

    /**
     * @summary dispatches action to add team to firebase and vuex store
     */
    async addTeamToProject() {
      // This bit added to prevent a submission when a keyboard shortcut is used
      if (!this.validTeam(this.newTeam)) {
        return;
      }

      try {
        // Adds team to project and returns the team id
        const teamId = await this.$store.dispatch("addTeamToProject", {
          projectId: this.$route.params.id,
          team: this.newTeam
        });

        // Adds the new team to any existing sprints
        if (this.project.sprints) {
          this._addTeamToSprints(teamId);
          await this.$store.dispatch("updateSprints", {
            projectId: this.$route.params.id,
            sprints: this.project.sprints
          });

          // We want to reload the project data when a new sprint/team is added
          // await this.$store.dispatch("loadProject", {
          //   projectId: this.$route.params.id
          // });
        }

        // Notify user of success
        this.$notify({
          group: "app",
          text: "Team added successfully",
          type: "success"
        });

        // Resets the new team to its default
        this.newTeam = { name: "" };
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }
    },

    /**
     * @summary dispatches action to update the selected team in
     * the current projet, then closes the edit modal.
     */
    async updateTeam() {
      try {
        await this.$store.dispatch("updateTeam", {
          projectId: this.$route.params.id,
          ...this.selectedTeam
        });
        this.$notify({
          group: "app",
          text: "Team updated successfully.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }

      this.modals.edit = false;
    },

    /**
     * @summary dispatches action to delete the selected team from the
     * current project, then closes the delete modal.
     */
    async deleteTeam() {
      try {
        await this.$store.dispatch("deleteTeamFromProject", {
          projectId: this.$route.params.id,
          teamId: this.selectedTeam.id,
          sprints: this.project.sprints
        });

        // Delete the team from existing sprints
        if (this.project.sprints) {
          this._deleteTeamFromSprints(this.selectedTeam.id);
          await this.$store.dispatch("updateSprints", {
            projectId: this.$route.params.id,
            sprints: this.project.sprints
          });
        }

        this.$notify({
          group: "app",
          text: "Team deleted successfully.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }

      this.modals.delete = false;
    },

    /**
     * @summary checks if a given team already exists in a list of teams
     * @returns {Boolean} true if it exists, otherwise false
     */
    teamExists(team) {
      return _.find(this.project.teams, { name: team.name });
    },

    /**
     * @summary checks if the current project has any teams
     * @returns {Boolean} true or false
     */
    hasTeams() {
      return !_.isEmpty(this.project.teams);
    }
  }
};
</script>

<template>
  <div class="manage-teams">
    <data-list v-if="hasTeams()" :dataList="project.teams" :fields="fields" :actions="actions"></data-list>

    <!-- Add team inline -->
    <div class="add-team">
      <form @submit.prevent="addTeamToProject">
        <input
          v-model.trim="newTeam.name"
          type="text"
          name="teamname"
          placeholder="Enter a new team name"
          id="team-name-input"
          required
        />
      </form>
      <div v-if="teamExists(newTeam)" class="error">
        <p class="error__text">This team already exists.</p>
      </div>
      <button
        v-if="!teamExists(newTeam)"
        @click="addTeamToProject()"
        :disabled="!validTeam(newTeam)"
        class="btn--primary"
      >Add Team</button>
    </div>

    <!-- Edit project modal -->
    <Modal v-if="modals.edit" title="Edit Team" @close="modals.edit = false">
      <div slot="body">
        <form @submit.prevent="updateTeam">
          <label for="teamName">Team Name</label>
          <input v-model.trim="selectedTeam.name" type="text" name="teamName" />
        </form>
      </div>
      <div slot="buttons">
        <button
          @click="updateTeam()"
          :disabled="!validTeam(selectedTeam)"
          class="button btn--primary"
        >Save</button>
      </div>
    </Modal>

    <!-- Delete project modal -->
    <Modal v-if="modals.delete" title="Delete Team" @close="modals.delete = false">
      <div slot="header" class="text--danger"></div>
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this team?
          <br />
          <br />
          <b>All team data will be lost permanently.</b>
        </p>
      </div>
      <div slot="buttons">
        <button @click="deleteTeam()" class="button btn--danger">Delete</button>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.manage-teams {
  background: var(--light);
}

.add-team {
  display: flex;
  align-items: center;
  padding: 20px;
}

.add-team form {
  display: flex;
  margin-right: 20px;
}
</style>
