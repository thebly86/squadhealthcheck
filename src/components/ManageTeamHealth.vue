<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import TeamStatus from './TeamStatus';

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
    currentSprint() {
      return _.findLast(_.orderBy(this.project.sprints, "sprintNumber", "asc"))
    },

    project() {
      return this.$store.getters.getProject(this.$route.params.id);
    },

    hasSprint: function() {
      return _.isEmpty(this.currentSprint);
    },

    criteria() {
      return this.$store.getters.getCriteria;
    }
  },

  // Non-Reactive properties
  methods: {
    save(data) {
      FirebaseService.saveSprint(this.project.id, this.currentSprint, this.project.sprints.length -1);
      this.hasChanged = false;
    },

    reset() {
      this.$emit('reset');
      this.hasChanged = false;
    },

    changeStatus(team, key) {
      this.hasChanged = false;
      if (team.criteria_values[key] === 3) {
          team.criteria_values[key] = 1;
      }
      else {
          team.criteria_values[key]++;
      }
      this.hasChanged = true;
    },
  }
}
</script>

<template>
  <main class="grid">
    <!--
    <header class="grid__item">
      <select>
        <option>

        </option>
      </select>
    </header>
    -->

    <table 
      v-if="project.sprints"
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
              :status="team.criteria_values[k]">
            </TeamStatus>
          </td>
        </tr>
      </tbody>
    </table>

    <footer
      v-if="project.sprints"
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

</style>