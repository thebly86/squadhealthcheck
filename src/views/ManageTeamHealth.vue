<script>
import FirebaseService from '@/api/firebase-service.js';
import TeamStatus from '@/components/TeamStatus';

import { STATUS } from '@/utils/constants'

export default {
  name: 'ManageTeamHealth',

  // Template dependencies
  components: {
    TeamStatus
  },

  // Local state
  data: () => ({
    hasChanged: false,
    currentSprintId: null
  }),

  computed: {
    criteria: function() {
      return this.$store.getters.getCriteria;
    },

    project: function() {
      return this.$store.getters.getProject(this.$route.params.id);
    },

    currentSprint: {
      get: function() {
        if (this.hasSprints) {
          return this.$store.getters.getCurrentSprint(this.$route.params.id, this.currentSprintId)
        }
        return null;
      },
      set: function(sprint) {
        this.currentSprintId = this.getSprintId(sprint);
      }
    },

    sprints: function() {
      const sprints = _.map(this.project.sprints, (sprint, sprintId) =>
        ({ sprintId, ...sprint }));
      return sprints;
    },

    latestSprint: function() {
      return _.findLast(this.project.sprints);
    },

    hasSprints: function() {
      return !_.isEmpty(this.project.sprints);
    }
  },

  // Events
  created() {
    if (this.hasSprints) {
      this.currentSprint = this.latestSprint;
    }
  },

  // Non-Reactive properties
  methods: {
    setCssProperty(property) {
      const tinycolor = require('tinycolor2');
      const color = tinycolor(this.project.color);
      color.setAlpha(0.5);
      return { [property]: color };
    },

    save() {
      this.$store.dispatch('updateTeamsSprintData', {
        projectId: this.$route.params.id,
        sprintId: this.getSprintId(this.currentSprint),
        sprint: this.currentSprint
      });
      this.hasChanged = false;
    },

    reset() {
      const sprint = JSON.parse(sessionStorage.getItem('sprint_backup'));
      const sprintId = this.getCurrentSprintId()
      this.$store.commit('updateSprint', {
        projectId: this.$route.params.id,
        sprintId,
        sprint });
      this.hasChanged = false;
    },

    incrementStatus(teamId, criteria) {
      console.log('increment');
      const currentStatus = this.currentSprint.teams[teamId][criteria].value;
      let newStatus;
      if (currentStatus === STATUS.GREEN) {
        newStatus = STATUS.EMPTY;
      }
      else {
        newStatus = currentStatus + 1;
      }

      this.currentSprint.teams[teamId][criteria].value = newStatus;
      this.hasChanged = true;
    },

    /**
     * Compares a team's criteria value with the previous sprint value, if it exists,
     * to determine whether there was an increase or decrease.
     * @returns -1 for decrease, 0 for no change, 1 for increase
     */
    getStatusChange(teamId, key) {
      // Return 0 if this is the first sprint
      if (this.currentSprint.sprintNumber === 0) {
        return 0;
      }

      // Get the previous sprint
      const previousSprintNo = parseInt(this.currentSprint.sprintNumber - 1).toString()
      const previousSprint = this.getSprintByNumber(previousSprintNo);

      if (previousSprint) {
        const currentVal = this.currentSprint.teams[teamId][key].value;
        const previousVal = previousSprint.teams[teamId][key].value;

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

    getSprintByNumber(sprintNo) {
      return _.find(this.project.sprints, { sprintNumber: sprintNo.toString() });
    },

    getSprintId(sprint) {
      return _.findKey(this.project.sprints, sprint);
    },

    getLatestSprint() {
      const sprintNumbers = _.map(this.project.sprints, (sprint) => Number(sprint.sprintNumber));
      return this.getSprintByNumber(Math.max(...sprintNumbers));
    },

    getCurrentSprintId() {
      return _.findKey(this.project.sprints, (sprint) =>
        sprint.sprintNumber === this.currentSprint.sprintNumber);
    },

    getTeamCriteriaValue(teamId, criteria) {
      const teamValues = this.latestSprint.teams[teamId];
      return teamValues[criteria].value;
    },

    getCriteriaName(criteria) {
      return _.camelCase(criteria.label);
    },

    hasProjectData() {
      return !_.isEmpty(this.project.teams) && !_.isEmpty(this.project.sprints);
    }
  },

  watch: {
    currentSprint: function(sprint) {
      sessionStorage.setItem('sprint_backup', JSON.stringify(sprint));
    }
  }
}
</script>

<template>
  <section>
    <section
      v-if="hasSprints"
      class="project-health">

      <!-- Sprint data -->
      <div class="project-health__content">
        <table class="health-check__table">
          <col width="200">
          <thead
            :style="this.setCssProperty('background')"
            class="health-check__table-header">
            <tr class="health-check__headings">
              <th class="health-check__sprint-selection">
                <select
                  v-model="currentSprint"
                  name="sprints"
                  class="sprint-selection"
                  id="select-current-sprint">
                  <option
                    v-for="(sprint, sprintId) in project.sprints"
                    :key="sprintId"
                    :value="sprint"
                    :id="`health-check_sprint-${sprint.sprintNumber}`">
                    Sprint {{ sprint.sprintNumber }}
                  </option>
                </select>
              </th>
              <th
                v-for="(team, index) in project.teams"
                :key="index"
                class="health-check__header"
                :id="`health-check_team-${index}`">
                {{ team.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(criteria, k) in criteria"
              :key="k"
              :class="{ 'health-check__row--odd': k % 2 != 0}"
              class="health-check__row">
              <td class="tooltip-target health-check__criteria">
                <i class="fa icon icon--criteria" :class="criteria.icon"/>
                <span>{{ criteria.label }}</span>
              </td>
              <td
                v-for="(team, teamId) in project.teams"
                :key="teamId"
                class="health-check__status">
                <TeamStatus
                  @click.native="incrementStatus(teamId, k)"
                  :status="currentSprint.teams[teamId][k].value"
                  :statusChange="getStatusChange(teamId, k)"
                  :id="`sprint${currentSprint.sprintNumber}-${team.name}-${getCriteriaName(criteria)}`"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Sprint data actions -->
      <div class="health-check__footer">
        <button
          :disabled="!hasChanged"
          @click="save"
          class="btn--primary">
          Save
        </button>
        <button
          :disabled="!hasChanged"
          @click="reset"
          class="btn--secondary">
          Reset
        </button>
      </div>
    </section>

    <!-- No sprint data section -->
    <section
      v-if="!hasProjectData()"
      class="grid__item no-data">
      <p>
        Add a
        <router-link
          :to="{ name: 'ManageTeams' }"
          class="no-data__link">
          team
        </router-link>
        and a
        <router-link
          :to="{ name: 'ManageSprints' }"
          class="no-data__link">
          sprint
        </router-link>
        to get started.
      </p>
    </section>
  </section>
</template>

<style>
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

  .sprint-selection {
    -webkit-appearance: none;
    min-width: 120px;
    height: 30px;
    padding-left: 20px;
    padding-right: 20px;
    background-image: url('../assets/icons/icon-dropdown.svg');
    background-repeat: no-repeat;
    background-size: 11px 13px;
    background-position: right 20px center;
    background-color: white;
    border: 1px solid var(--grey);
    border-radius: 0;
    font-size: 0.8rem;
  }

  .project-health__content {

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

  .health-check__sprint-selection {
    text-align: left;
    padding: 10px 20px;
  }

  .health-check__header {
    padding: 10px 20px;
  }

  .health-check__criteria {
    padding: 10px 20px;
    width: 200px;
  }

  .health-check__row {
    border-bottom: 1px solid var(--grey);
    border-top: 1px solid var(--grey);
  }

  .health-check__row--odd {
    background-color: #fafafa;
  }
</style>