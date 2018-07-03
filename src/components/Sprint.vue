<script>
  import Modal from './Modal';
  import Team from "./Team";
  import FirebaseService from '../utils/firebase/firebase-service';
  import { DEFAULT_CRITERIA } from '../utils/constants/constants';

  export default {
    name: 'Sprint',

    // Template dependencies
    components: {
      Modal,
      Team
    },

    // Interface
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

    // Local state
    data: () => ({
      showModal: false,
      showDeleteModal: false,
      editMode: false,
      teamToAdd: "",
      updatedSprint: {
        startDate: "",
        endDate: ""
      }
    }),

    computed: {
      deleteActions: function() {
        return [
          {
            name: 'Delete',
            class: 'btn-primary btn--danger',
            action: this.deleteSprint
          }
        ]
      }
    },

    methods: {
      saveTeam() {
        const newTeam = {
          id: _.camelCase(this.teamToAdd.id),
          name: this.teamToAdd.name,
          criteria_values: DEFAULT_CRITERIA
        };

        FirebaseService.addTeamToSprint(this.project.id, this.sprint.id, newTeam);

        this.$store.commit('addTeamToSprint', {
          projectId: this.project.id,
          sprintId: this.sprint.id,
          team: newTeam
        });

        this.teamToAdd = "";
      },
      deleteSprint() {
        const projectId = this.project.id;
        const sprintId = this.sprint.id;
        
        FirebaseService.removeSprint(projectId, sprintId);
        this.$store.commit('removeSprintFromProject', {
          projectId,
          sprintId
        });
      },
      setUpdateModel() {
        this.updatedSprint = {
          startDate: this.sprint.startDate,
          endDate: this.sprint.endDate
        }
        return this.editMode = true;
      },
      updateSprint() {
        this.updatedSprint = {
          ...this.sprint,
          startDate: this.updatedSprint.startDate,
          endDate: this.updatedSprint.endDate
        };

        FirebaseService.saveSprint(this.project.id, this.updatedSprint);
        this.$store.commit('addSprint', { projectId: this.project.id, sprint: this.updatedSprint });
        this.editMode = false;
        
      }
    },
  }
</script>

<template>
  <tr>
    <td>
      <span>{{ sprint.name }}</span>
    </td>
    <td v-if="!editMode">
      <span>{{ sprint.startDate }}</span>
    </td>
    <td v-if="!editMode">
      <span>{{ sprint.endDate }}</span>
    </td>
    <td v-if="!editMode">
      <div class="sprint-actions">
        <a
        @click="showModal = true"
        class="btn-action">
          <i class="icon icon--users fa fa-users"></i>
        </a>
        <a
          @click="setUpdateModel"
          class="btn-action">
          <i class="icon icon--edit fa fa-edit"></i>
        </a>
        <a
          @click="showDeleteModal = true"
          class="btn-action">
          <i class="icon icon--delete fa fa-trash"></i>
        </a>
      </div>
    </td>

    <!-- *********** Edit Mode *********** -->
    <td v-if="editMode">
      <span>
        <input
          type="date"
          name="startDate"
          id="startDate"
          v-model.trim="updatedSprint.startDate"/>
      </span>
    </td>
    <td v-if="editMode">
      <span>
        <input
          type="date"
          name="startDate"
          id="endDate"
          v-model.trim="updatedSprint.endDate"/>
      </span>
    </td>
    <td v-if="editMode">
      <div class="sprint-actions">
        <button
          @click="updateSprint"
          class="btn-primary">
          Update
        </button>
        <a
          @click="editMode = false"
          class="btn-action">
          <i class="icon icon--close fa fa-times"></i>
        </a>
      </div>
    </td>

    <Modal
      v-if="showModal"
      title="Add team to sprint"
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

    <!-- DELETE Sprint modal -->
    <Modal
      v-if="showDeleteModal"
      title="Delete Team"
      :actions="deleteActions"
      @close="showDeleteModal = false">
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this sprint? <br/><br/>
          <b>The sprint will be deleted permanently.</b>
        </p>
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