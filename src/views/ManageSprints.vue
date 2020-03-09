<script>
import dayjs from "dayjs";

import DataList from "@/components/DataList";
import Modal from "@/components/Modal";
import Validator from "@/utils/validation.js";

export default {
  name: "ManageSprints",

  /* Template dependencies */
  components: {
    DataList,
    Modal
  },

  /* Local state */
  data: () => ({
    fields: [
      {
        field: "sprintName",
        label: "Sprint",
        visible: true
      },
      {
        field: "startDate",
        label: "Start date",
        visible: true
      },
      {
        field: "endDate",
        label: "End date",
        visible: true
      }
    ],
    newSprint: {
      sprintName: "",
      startDate: "",
      endDate: "",
      teams: {}
    },
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

    project: function() {
      return this.$store.getters.getProject(this.$route.params.id);
    },

    selectedSprint: function() {
      return this.$store.getters.getActiveSprint;
    },

    validSprint: function() {
      return sprint =>
        !this.sprintExists(sprint) &&
        !Validator.isEmpty(sprint.sprintName) &&
        this.hasValidDates(sprint);
    }
  },

  /* Non-reactive properties */
  methods: {
    _addTeamsToSprint() {
      this.newSprint.teams = {};
      // For each team, set the default sprint values
      if (this.project.teams) {
        _.forEach(this.project.teams, (team, teamId) => {
          this.newSprint.teams[teamId] = this._defaultSprintData();
        });
      }
    },

    _defaultSprintData() {
      const defaultCriteria = this.criteria.map(criterion => ({
        criteria: criterion.label,
        value: 0
      }));
      return defaultCriteria;
    },

    async addSprint() {
      // Generate default sprint data
      this._addTeamsToSprint();

      try {
        await this.$store.dispatch("addSprintToProject", {
          projectId: this.$route.params.id,
          sprint: this.newSprint
        });

        // We want to reload the project data when a new sprint/team is added
        // await this.$store.dispatch("getProject", {
        //   projectId: this.$route.params.id
        // });

        // Notify of success
        this.$notify({
          group: "app",
          text: "Sprint added successfully.",
          type: "success"
        });

        // Resets new sprint to its default
        this.newSprint = { sprintName: "" };
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }
    },

    async deleteSprint() {
      try {
        await this.$store.dispatch("deleteSprintFromProject", {
          projectId: this.$route.params.id,
          sprintId: this.selectedSprint.id
        });

        // Notify of success
        this.$notify({
          group: "app",
          text: "Sprint deleted successfully.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }

      this.modals.delete = false;
    },

    async updateSprint() {
      try {
        await this.$store.dispatch("updateSprint", {
          projectId: this.$route.params.id,
          sprintId: this.selectedSprint.id,
          sprint: this.selectedSprint
        });

        this.$notify({
          group: "app",
          text: "Sprint updated successfully.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }

      this.modals.edit = false;
    },

    openModal(action, sprint, sprintId) {
      this.modals[action.type] = true;
      sprint.id = sprintId;
      this.$store.commit("setActiveSprint", _.clone(sprint));
    },

    sprintExists(sprint) {
      let sprints = this.project.sprints;
      if (sprint.id) {
        sprints = _.omit(sprints, sprint.id);
      }

      return _.find(sprints, { sprintName: sprint.sprintName });
    },

    hasSprints() {
      return !_.isEmpty(this.project.sprints);
    },

    hasValidDates(sprint) {
      return (
        !Validator.isEmpty(sprint.startDate) &&
        !Validator.isEmpty(sprint.endDate)
      );
    }
  }
};
</script>

<template>
  <div class="manage-sprints">
    <!-- Probably change this to a table components -->
    <data-list
      v-if="hasSprints()"
      :dataList="project.sprints"
      :fields="fields"
      :actions="actions"
      :showKeys="true"
    ></data-list>

    <!-- Add sprint inline -->
    <section class="add-sprint">
      <form @submit.prevent="addSprint()">
        <div class="field">
          <label v-if="!hasSprints()" for="sprintName">Sprint</label>
          <input
            v-model="newSprint.sprintName"
            type="text"
            name="sprintName"
            id="add-sprint-sprintName"
          />
        </div>
        <div class="field">
          <label v-if="!hasSprints()" for="startDate">Start date</label>
          <input
            v-model="newSprint.startDate"
            type="date"
            name="startDate"
            id="add-sprint-startDate"
          />
        </div>
        <div class="field">
          <label v-if="!hasSprints()" for="endDate">End date</label>
          <input v-model="newSprint.endDate" type="date" name="endDate" id="add-sprint-endDate" />
        </div>
      </form>
      <button
        @click="addSprint()"
        :disabled="!validSprint(newSprint)"
        class="btn--primary"
        id="add-sprint-save"
      >Add Sprint</button>
    </section>

    <!-- Edit project modal -->
    <Modal v-if="modals.edit" title="Edit Sprint" @close="modals.edit = false">
      <div slot="body">
        <form @submit.prevent="updateSprint">
          <div class="edit-field">
            <label for="sprintName">Sprint name</label>
            <input
              v-model="selectedSprint.sprintName"
              type="text"
              name="sprintName"
              id="edit-sprint-sprintName"
            />
          </div>
          <div class="edit-field">
            <label for="startDate">Start date</label>
            <input
              v-model="selectedSprint.startDate"
              type="date"
              name="startDate"
              id="edit-sprint-startDate"
            />
          </div>
          <div class="edit-field">
            <label for="startDate">End date</label>
            <input
              v-model="selectedSprint.endDate"
              type="date"
              name="endDate"
              id="edit-sprint-endDate"
            />
          </div>
        </form>
      </div>
      <div slot="buttons">
        <button
          @click="updateSprint()"
          :disabled="!validSprint(selectedSprint)"
          class="button btn--primary"
          id="edit-sprint-save"
        >Save</button>
      </div>
    </Modal>

    <!-- Delete sprint modal -->
    <Modal v-if="modals.delete" title="Delete Sprint" @close="modals.delete = false">
      <div slot="header" class="text--danger"></div>
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this sprint?
          <br />
          <br />
          <b>All team data will be lost permanently.</b>
        </p>
      </div>
      <div slot="buttons">
        <button @click="deleteSprint()" class="button btn--danger" id="delete-sprint">Delete</button>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.manage-sprints {
  background: var(--light);
}

.add-sprint {
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.add-sprint form {
  display: flex;
  margin-right: 20px;
}

.field {
  margin-right: 10px;
}

.edit-field {
  margin-bottom: 10px;
}

.edit-field:last-of-type {
  margin-bottom: 0;
}

.field:last-of-type {
  margin-right: 0;
}

.field input {
  height: 20px;
  margin: 0;
  padding: 6px;
}

.field label {
  font-size: 0.7rem;
}
</style>
