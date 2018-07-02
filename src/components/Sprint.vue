<script>
  import Modal from './Modal';
  import Team from "./Team";
  import FirebaseService from '../utils/firebase/firebase-service';
  import store from '../store/'
  import { constants } from '../utils/constants/constants.js';

  export default {
    name: 'Sprint',

    props: {
      sprint: {
        type: Object,
        required: true
      },
      project: {
        type: Object,
        required: true
      }
    },

    data: () => ({
      showModal: false,
      teamToAdd: ""
    }),

    components: {
      Modal,
      Team
    },

    methods: {
      saveTeam() {
        const newTeam = {
          id: _.camelCase(this.teamToAdd.id),
          name: this.teamToAdd.name,
          criteria_values: constants.DEFAULT_CRITERIA
        };

        FirebaseService.addTeamToSprint(this.project.id, this.sprint.id, newTeam);

        store.commit('addTeamToSprint', {
          projectId: this.project.id,
          sprintId: this.sprint.id,
          team: newTeam
        });

        this.teamToAdd = "";
      }
    },
  }
</script>



<template>
  <tr>
    <td>
      <span>{{ sprint.name }}</span>
    </td>
    <td>
      <span>{{ sprint.startDate }}</span>
    </td>
    <td>
      <span>{{ sprint.endDate }}</span>
    </td>
    <td>
      <div class="sprint-actions">
        <a
        @click="showModal = true"
        class="btn-action">
          <i class="icon icon--users fa fa-users"></i>
        </a>
        <a class="btn-action">
          <i class="icon icon--edit fa fa-edit"></i>
        </a>
        <a class="btn-action">
          <i class="icon icon--delete fa fa-trash"></i>
        </a>
      </div>
    </td>
    <Modal
      v-if="showModal"
      title="Add team to sprint"
      :actions="actions"
      @close="showModal = false">
      <div slot="body">
        <form ref="addSprintForm">
          <div class="grid">
            <table class="grid__item teams-table">
              <thead>
                <tr>
                  <th>Teams in {{ sprint.name }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <team
                  v-for="(team, t) in sprint.teams"
                  :key="t"
                  :team="team"
                  :sprint="sprint">
                </team>
              </tbody>
            </table>
          </div>
          <span class="team-selection">
            <select v-model.trim="teamToAdd">
              <option
                v-for="(team, pt) in project.teams"
                :key="pt"
                v-bind:value="team">
                {{ team.name }}
              </option>
            </select>
            <div class="sprint-actions">
              <a
                @click="this.saveTeam"
                class="btn-action">
                <i class="icon icon--plus fa fa-plus"></i>
              </a>
            </div>
          </span>
        </form>
      </div>
    </Modal>
  </tr>
</template>

<style>
.sprint-actions {
  float: right;
}

.team-selection {
  display: flex;
  justify-content: start;
  padding-top: 20px;
}

.team-selection div {
  padding-left: 10px;
}
</style>