<template>
<main class="grid">
  <section 
    v-if="!hasSprints"
    class="grid__item no-data no-data--sprints">
    <p>
      <router-link 
        :to="{ name: 'ManageSprints', params: { showModal: true }}"
        class="no-data__link">
        Add a sprint
      </router-link>
      to get started.
    </p>
  </section>
  <table 
    v-if="hasSprints"
    class="grid__item healthcheck-table">
    <colgroup>
      <col class="healthcheck-table__criteria" span="1">
      <col class="healthcheck-table__team" span="10">
    </colgroup>
    <thead class="text-center">
      <tr>
        <th></th>
        <th
          v-for="(team, i) in project.teams"
          :key="i">
          {{ team }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(criteria, k) in criteria"
        :key="k"
        :class="{ 'row--even': k % 2 === 0}"
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
            :status="team[k].value">
          </TeamStatus>
        </td>
      </tr>
    </tbody>
  </table>

  <footer
    v-if="hasSprints"
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


<script>
import FirebaseService from '../utils/firebase/firebase-service.js';
import TeamStatus from './TeamStatus';

export default {
  name: 'ManageTeamHealth',

  components: {
    TeamStatus
  },


  data: () => ({
    criteria: {},
    hasChanged: false,
    showModal: false
  }),


  props: {
    project: {
      type: Object,
      required: true
    },
    sprints: {
      type: Array,
      requires: true
    }
  },


  computed: {
    currentSprint: function() {
      return this.sprints[this.sprints.length -1];
    },

    hasSprints: function() {
      return this.sprints.length > 0;
    }
  },


  created: function() {
    this.getCriteria();
  },

  methods: {
    getCriteria() {
      FirebaseService.getCriteria().then((data) => this.criteria = data);
    },

    save(data) { 
      FirebaseService.saveSprint(this.project.id, this.currentSprint);
      sessionStorage.removeItem(`${this.project.id}.sprints`);
      this.hasChanged = false;
    },

    reset() {
      this.$emit('reset');
      this.hasChanged = false;
    },

    changeStatus(team, criteria) {
      if (team[criteria].value === 3) {
          team[criteria].value = 1;
      }
      else {
          team[criteria].value++;
      }
      this.hasChanged = true;
    },
  }
}
</script>


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