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
          }
        ]
      }
    },

    data: () => ({
      showDeleteModal: false,
      editMode: false,
      newTeamName: ""
    }),

    // Events
    watch: {
      editMode: function() {
        if (this.editMode) {
          this.newTeamName = this.team.name;
        } else {
          this.newTeamName = "";
        }
      }
    },

    // Non-reactive properties
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
  <li class="team">
    <section v-if="!editMode">
      <span>{{ team.name }}</span>
      <section class="team-actions">
        <button
          @click="editMode = true"
          class="btn--inline">
          <i class="icon icon--edit fa fa-edit"></i>
        </button>
        <button
          @click="showDeleteModal = true"
          class="btn--inline">
          <i class="icon icon--delete fa fa-trash"></i>
        </button>
      </section>
    </section>
    <section v-if="editMode">
      <form id="update-team">
        <input
          v-model.trim="newTeamName"
          type="text"
          name="teamName"
          id="editTeamName"/>
      </form>
      <div class="edit-actions">
        <button
          @click="updateTeam"
          class="btn-primary">
          Save
        </button>
        <button
          @click="editMode = false"
          class="btn-secondary">
          Cancel
        </button>
      </div>
    </section>
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
  </li>
</template>


<style>
.team {
  padding: 8px 15px;
}

.team:hover .team-actions {
  visibility: visible;
}

.team-name {
  padding: 2px 2px;
}

.team-actions {
  text-align: right;
  padding: 3px;
  margin-left: 25%;
  display: inline-block;
  visibility: hidden;
}

.edit-actions {
  display: inline-block; 
  margin-left: 5%;
}

#update-team {
  width: 25%;
}
</style>