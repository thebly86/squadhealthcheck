<script>
import FirebaseService from "@/api/firebase-service.js";

import TeamView from "./TeamView";
import SprintView from "./SprintView";
import TeamStatus from "@/components/TeamStatus";

import { STATUS } from "@/utils/constants";

export default {
  name: "ManageTeamHealth",

  // Template dependencies
  components: {
    TeamView,
    SprintView,
    TeamStatus
  },

  // Local state
  data: () => ({
    hasChanged: false,
    // currentSprintId: null
    selectedSprintId: null,
    selectedTeamId: null
  }),

  computed: {
    criteria: function() {
      return _.map(this.$store.getters.getCriteria, criterion => ({
        id: _.camelCase(criterion.label),
        ...criterion
      }));
    },

    project: function() {
      return this.$store.getters.getProject(this.$route.params.id);
    },

    sprints: function() {
      const sprints = _.map(this.project.sprints, (sprint, sprintId) => ({
        id: sprintId,
        ...sprint
      }));
      return _.orderBy(sprints, sprint => sprint.sprintNumber, ["asc"]);
    },

    teams: function() {
      return _.map(this.project.teams, (team, teamId) => ({
        id: teamId,
        ...team
      }));
    },

    config: function() {
      return {
        color: this.project.color
      };
    },

    sprintView: function() {
      return this.$store.getters.sprintView;
    },

    teamView: function() {
      return this.$store.getters.teamView;
    }
  },

  // Events
  created() {
    sessionStorage.setItem("sprints", JSON.stringify(this.sprints));
  },

  // Non-Reactive properties
  methods: {
    setCssProperty(property) {
      const tinycolor = require("tinycolor2");
      const color = tinycolor(this.project.color);
      color.setAlpha(0.5);
      return { [property]: color };
    },

    reset() {
      const backup = JSON.parse(sessionStorage.getItem("sprints"));
      const sprints = backup.reduce((acc, sprint) => {
        acc[sprint.id] = _.omit(sprint, "id");
        return acc;
      }, {});

      this.$store.commit("updateSprints", {
        projectId: this.$route.params.id,
        sprints
      });
      this.hasChanged = false;
    },

    selectSprint(sprintId) {
      this.selectedSprintId = sprintId;
      this.$store.commit("toggleSprintView");
    },

    selectTeam(teamId) {
      this.selectedTeamId = teamId;
      this.$store.commit("toggleTeamView");
    },

    /**
     * Compares a team's criteria value with the previous sprint value, if it exists,
     * to determine whether there was an increase or decrease.
     * @param {Object} sprint the sprint object
     * @param {String} teamId the string identifier for a team
     * @param {String} criteria the array key belonging to the criteria
     * @returns -1 for decrease, 0 for no change, 1 for increase
     */
    getStatusChange(sprint, teamId, criteria) {
      // Return 0 if this is the first sprint
      if (sprint && sprint.sprintNumber === 0) {
        return 0;
      }

      // Get the previous sprint
      const sprintNo = sprint.sprintNumber - 1;
      const previousSprint = this.sprints.find(
        sprint => sprint.sprintNumber === sprintNo.toString()
      );

      if (previousSprint) {
        const currentVal = sprint.teams[teamId][criteria].value;
        const previousVal = previousSprint.teams[teamId][criteria].value;
        if (previousVal === 0 || currentVal === 0) {
          return 0;
        } else if (currentVal > previousVal) {
          return 1;
        } else if (currentVal < previousVal) {
          return -1;
        }
      }
      return 0;
    },

    /**
     * @description Method checks if the project has sprint or team data
     * @returns {Boolean} true or false
     */
    hasProjectData() {
      return !_.isEmpty(this.project.teams) && !_.isEmpty(this.project.sprints);
    }
  }
};
</script>

<template>
  <section>
    <div v-if="sprintView">
      <SprintView
        :criteria="criteria"
        :teams="teams"
        :sprints="sprints"
        :config="config"
        :reset="reset"
        :selectTeam="selectTeam"
        :selectedSprintId="selectedSprintId"
        :getStatusChange="getStatusChange"
      />
    </div>

    <div v-else-if="teamView">
      <TeamView
        :criteria="criteria"
        :teams="teams"
        :sprints="sprints"
        :config="config"
        :reset="reset"
        :selectSprint="selectSprint"
        :selectedTeamId="selectedTeamId"
        :getStatusChange="getStatusChange"
      />
    </div>

    <!-- No sprint data section -->
    <div v-if="!hasProjectData()" class="grid__item no-data">
      <p>
        Add a
        <router-link :to="{ name: 'ManageTeams' }" class="no-data__link">team&nbsp;</router-link>and a
        <router-link :to="{ name: 'ManageSprints' }" class="no-data__link">sprint&nbsp;</router-link>to get started.
      </p>
    </div>
  </section>
</template>

<style>
.tooltip.popover .popover-inner {
  padding: 0;
}

.popover__criteria {
  display: block;
  align-items: left;
  background: white;
  border: solid 1px var(--light-grey);
  color: var(--dark-grey);
  max-width: 470px;
  font-family: "Avenir";
  font-size: 15px;
  box-shadow: 3px 3px 3px var(--grey);
}

.popover__criteria h4 {
  padding: 10px;
  margin: 0;
  color: var(--darker-grey);
  text-align: left;
  background: var(--lightest-grey);
  border-bottom: 1px solid var(--light-grey);
}

.criteria {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid var(--light-grey);
}

.criteria p {
  padding: 0;
  margin: 0 0 0 10px;
  max-width: 250px;
}

.criteria > .status {
  margin: 0;
}

.health-check__footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}

.health-check__footer button {
  margin-right: 20px;
}

.health-check__footer button:last-of-type {
  margin-right: 0;
}

.sprint-selection,
.team-selection {
  -webkit-appearance: none;
  min-width: 170px;
  height: 30px;
  padding-left: 20px;
  padding-right: 20px;
  background-image: url("../../assets/icons/icon-dropdown.svg");
  background-repeat: no-repeat;
  background-size: 11px 13px;
  background-position: right 20px center;
  background-color: white;
  border: 1px solid var(--grey);
  border-radius: 0;
  font-size: 0.8rem;
}

.health-check__table {
  width: 100%;
}

.icon--criteria {
  width: 30px;
}

.health-check__headings {
  color: var(--light);
  text-align: center;
}

.health-check__sprint-selection,
.health-check__team-selection {
  text-align: left;
  padding: 10px 20px;
}

.health-check__header {
  padding: 15px 20px;
  text-align: center;
}

.health-check__header:hover {
  cursor: pointer;
  text-decoration: underline;
}

.health-check__criteria {
  padding: 10px 20px;
  width: 20%;
}

.health-check__criteria:hover {
  cursor: pointer;
}

.health-check__status {
  width: 15%;
}

.health-check__row {
  border-bottom: 1px solid var(--grey);
  border-top: 1px solid var(--grey);
}

.health-check__row--odd {
  background-color: #fafafa;
}
</style>
