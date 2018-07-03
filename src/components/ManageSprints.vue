<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Modal from './Modal';
  import Sprint from './Sprint';
  import { DEFAULT_CRITERIA } from '../utils/constants/constants';

  export default {
    name: 'ManageSprints',

    // Template dependencies
    components: {
      Sprint,
      Modal
    },

    // Interface
    props: {
      project: {
        type: Object,
        required: true
      }
    },

    // Local state
    data: () => ({
      title: "Manage Sprints",
      newSprint: {
        id: 0,
        sprintNumber: 0,
        name: "",
        startDate: "",
        endDate: ""
      }
    }),

    computed: {
      minimumSprint: function() {
        const currentSprint = _.findLast(_.orderBy(this.project.sprints, "sprintNumber", "asc"));

        return !_.isEmpty(this.project.sprints) ?
          parseInt(currentSprint.sprintNumber) + 1 : 1;
      }
    },

    // Non-Reactive properties
    methods: {
      save() {
        this.newSprint.name = "Sprint " + this.newSprint.sprintNumber;
        this.newSprint.id = _.camelCase(this.newSprint.name);
        if(this.project.teams) {
          this.newSprint.teams = _.forEach(this.project.teams, team => team.criteria_values = DEFAULT_CRITERIA);
        }
        
        FirebaseService.saveSprint(this.project.id, this.newSprint);
        this.$store.commit('addSprint', {
          projectId: this.project.id,
          sprint: this.newSprint
        });

        this.newSprint = {id: 0, sprintNumber: 0, name: "", startDate: "", endDate: ""};
      }
    }
  }
</script>

<template>
  <main class="grid">
    <table
      v-if="project"
      class="grid__item sprints-table">
      <colgroup>
        <col class="sprints-table__sprint">
        <col class="sprints-table__dates" span="2">
        <col class="sprint-table__actions">
      </colgroup>
      <thead>
        <tr>
          <th>Sprint</th>
          <th>Start</th>
          <th>End</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <Sprint
          v-for="(sprint, s) in project.sprints"
          :key="s"
          :sprint="sprint"
          :project="project">
        </Sprint>
        <tr>
          <td>
            <span>
              <input
                type="number"
                name="sprintName"
                :min="minimumSprint"
                id="sprintName"
                placeholder="Sprint number"
                v-model="newSprint.sprintNumber"/>
            </span>
          </td>
          <td>
            <span>
              <input
                type="date"
                name="startDate"
                id="startDate"
                v-model.trim="newSprint.startDate"/>
            </span>
          </td>
          <td>
            <span>
              <input
                type="date"
                name="startDate"
                id="endDate"
                v-model.trim="newSprint.endDate"/>
            </span>
          </td>
          <td>
            <div class="sprint-actions">
              <a
                @click="this.save"
                class="btn-action">
                <i class="icon icon--plus fa fa-plus"></i>
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <footer
      v-if="project"
      class="grid__item footer">
      <section class="footer__action-bar">
      </section>
    </footer>
  </main>
</template>

<style>
  .sprints-table th {
    padding: 0px 20px 5px 20px;
  }

  .sprints-table td {
    padding: 10px 20px;
  }

  .sprints-table__sprint {
    width: 25%;
  }

  .sprints-table__dates {
    width: 25%;
  }

  .sprints-table__actions {
    width: 50%;
  }

  .icon--plus {
    color: var(--health-green)
  }

  .icon--plus:hover {
    cursor: pointer;
  }
</style>