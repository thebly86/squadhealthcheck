<script>
import FirebaseService from '../utils/firebase/firebase-service.js';
import TeamStatus from './TeamStatus';

import { STATUS } from '../utils/constants/constants'

export default {
  name: 'ManageTeamHealth',

  // Template dependencies
  components: {
    TeamStatus
  },

  // Local state
  data: () => ({
    hasChanged: false,
    showModal: false
  }),

  computed: {
    currentSprint: {
      get: function () {
        return this.$store.getters.getCurrentSprint(this.project.id);
      },
      set: function(sprint) {
        this.$store.commit('updateCurrentSprint', { projectId: this.project.id, ...sprint });
      }
    },

    latestSprint() {
      return _.findLast(_.orderBy(this.project.sprints, "sprintNumber", "asc"));
    },

    project() {
      return this.$store.getters.getProject(this.$route.params.id);
    },

    hasSprint: function() {
      return !_.isEmpty(this.project.sprints);
    },

    criteria() {
      return this.$store.getters.getCriteria;
    }
  },

  // Events
  created() {
    // Set sprint to the latest, if currentSprint not set
    if (_.isNil(this.currentSprint)) {
      this.currentSprint = this.latestSprint;
    }
  },

  // Non-Reactive properties
  methods: {
    save(data) {
      FirebaseService.saveSprint(this.project.id, this.currentSprint, this.project.sprints.length -1);
      this.hasChanged = false;
    },

    reset() {
      // TODO: Reset i
      this.hasChanged = false;
    },

    changeStatus(team, key) {
      this.hasChanged = false;
      if (team.criteria_values[key] === STATUS.GREEN) {
          team.criteria_values[key] = STATUS.RED;
      }
      else {
          team.criteria_values[key]++;
      }
      this.hasChanged = true;
    },

    /**
     * Compares a team's criteria value with the previous sprint value, if it exists, 
     * to determine whether there was an increase or decrease. 
     * @returns -1 for decrease, 0 for no change, 1 for increase
     */
    getStatusChange(team, key) {
      // Return 0 if this is the first sprint
      if (this.currentSprint.sprintNumber === 0) {
        return 0;
      }

      // Get the previous sprint
      const previousSprintNo = parseInt(this.currentSprint.sprintNumber - 1).toString() 
      const previousSprint = this.getSprintByNumber(previousSprintNo);

      if (!_.isUndefined(previousSprint)) {
        // Get the two sprint team values to compare
        const currentVal = team.criteria_values[key];
        const previousVal = previousSprint.teams[team.id].criteria_values[key];

        if (currentVal === previousVal) {
          return 0; // No change
        }
        else if (currentVal > previousVal) {
          return 1; // Value increased
        }
        else {
          return -1; // Value decreased
        }
      }
      return 0;
    },

    getSprintByNumber(sprintNo) {
      return _.find(this.project.sprints, { sprintNumber: sprintNo });
    },

    hasProjectData() {
      return !_.isEmpty(this.project.teams) && !_.isEmpty(this.project.sprints);
    }
  }
}
</script>

<template>
  <main class="grid project-data">
    <header 
      v-if="hasSprint"
      class="grid__item">
      <section class="sprint-selection">
        <label class="sprint-selection__label">Current sprint: </label>
        <select 
          v-model="currentSprint"
          name="sprints"
          class="sprint-selection__list">
          <option
            v-for="(sprint, s) in project.sprints"
            :key="s"
            :value="sprint">
            {{ sprint.name }}
          </option>
        </select>
      </section>
    </header>

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

    <table 
      v-if="hasProjectData()"
      class="grid__item healthcheck-table">
      <colgroup>
        <col class="healthcheck-table__criteria" span="1">
        <col class="healthcheck-table__team" span="10">
      </colgroup>
      <thead class="text-center">
        <tr>
          <th></th>
          <th
            v-for="(team, i) in currentSprint.teams"
            :key="i">
            {{ team.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(criteria, k) in criteria"
          :key="k"
          :class="{ 'row--even': k % 2 === 0 }"
          class="row">
          <td>
            <i class="fa icon icon--criteria" :class="criteria.icon"/>
            <span>{{ criteria.label }}</span>
          </td>
          <td
            v-for="(team, t) in currentSprint.teams"
            :key="t">
            <TeamStatus 
              @click.native="changeStatus(team, k)"
              :status="team.criteria_values[k]"
              :statusChange="getStatusChange(team, k)">
            </TeamStatus>
          </td>
        </tr>
      </tbody>
    </table>

    <footer
      v-if="hasProjectData()"
      class="grid__item footer">
      <section class="footer__action-bar">
        <button
          :disabled="!hasChanged"
          @click="save"
          class="btn-primary">
          Save
        </button>
        <button
          :disabled="!hasChanged"
          @click="reset"
          class="btn-secondary">
          Reset
        </button>
      </section>
    </footer>
  </main>
</template>

<style>
  .project-data {
    padding: 10px 0;
  }

  .healthcheck-table {
    color: var(--darker-grey);
    font-size: 13px;
    font-weight: 500;
  }

  .healthcheck-table td {
    padding: 8px;
  }

  .healthcheck-table__headings {
    text-align: center;
  }

  .healthcheck-table__criteria {
    width: 20%;
    padding-left: 20px;
  }

  .healthcheck-table__team {
    padding: 10px;
  }

  .icon--criteria {
    width: 40px;   
    padding-left: 10px;
  }

  .sprint-selection {
    margin: 0 15px;
  }

  .sprint-selection__label {
    display: inline-block;
    font-size: 12px;
    color: var(--dark-grey);
  }

  .sprint-selection__list {
    color: red;
  }
</style>