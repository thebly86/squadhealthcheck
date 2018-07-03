<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Modal from './Modal';

  export default {
    name: 'Team',

    // Template dependencies
    components: {
      Modal
    },

    // Interface
    props: {
      team: {
        type: Object,
        required: true
      },
      sprint: {
        type: Object,
        required: false
      }
    },

    // Local state
    computed: {
      deleteActions: function() {
        return [
          {
            name: 'Delete',
            class: 'btn-primary btn--danger',
            action: this.deleteTeam
          }, 
          {
            name: 'Cancel',
            class: 'btn-secondary',
            action: () => this.showDeleteModal = false
          }
        ]
      }
    },

    data: () => ({
      showDeleteModal: false,
      editMode: false,
      newTeamName: ""
    }),

    methods: {
      deleteTeam() {
        const projectId = this.$route.params.id;
        const teamId = this.team.id;
        
        if(this.sprint) {
          FirebaseService.removeTeamFromSprint(projectId, this.sprint.id, teamId);
          this.$store.commit('removeTeamFromSprint', {
            projectId,
            sprintId: this.sprint.id,
            teamId
          });
        } else {
          FirebaseService.removeTeam(projectId, teamId);
          this.$store.commit('removeTeamFromProject', {
            projectId,
            teamId
          });
          this.showDeleteModal = false
        }
      },
      updateTeam() {
        const updatedTeam = {
          id: this.team.id,
          name: this.newTeamName
        }

        FirebaseService.saveTeam(this.$route.params, updatedTeam);
        this.$store.commit('addTeamToProject', {
          projectId: this.$route.params.id,
          team: updatedTeam
        });

        return this.editMode = false;
      },
      setUpdateModel() {
        this.newTeamName = this.team.name
        this.editMode = true
      }
    }
  }
</script>


<template>
  <tr>
    <td>
      <span
        v-if="!editMode"
        class="team-name">{{ team.name }}</span>
      <input
        v-if="editMode"
        type="text"
        name="teamName"
        id="teamName"
        class="edit-team"
        placeholder="Team Name"
        v-model.trim="newTeamName"/>
    </td>
    <td
      v-if="!editMode"
      class="team-actions">
      <a
        v-if="!sprint"
        @click="setUpdateModel"
        class="btn-action">
        <i class="icon icon--edit fa fa-edit"></i>
      </a>
      <a
        @click="showDeleteModal = true"
        class="btn-action">
        <i class="icon icon--delete fa fa-trash"></i>
      </a>
    </td>

    <td v-if="editMode">
      <div class="team-actions">
        <button
          @click="updateTeam"
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
      v-if="showDeleteModal"
      title="Delete Team"
      :actions="deleteActions"
      @close="showDeleteModal = false">
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this team? <br/><br/>
          <b v-if="!sprint">The team will be deleted permanently.</b>
          <b v-if="sprint">The team will be deleted from this sprint permanently..</b>
        </p>
      </div>
    </Modal>
  </tr>
</template>


<style>
.team-name {
  padding: 2px 2px;
}

.team-actions {
  text-align: right;
  padding: 3px;
}

tr:hover .btn-action {
  display: inline-block;
}

.btn-action {
  display: inline-block;
}

</style>