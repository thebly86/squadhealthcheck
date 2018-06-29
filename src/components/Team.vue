<script>
  import store from '../store/index.js'
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Modal from './Modal';

  export default {
    name: 'Team',

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

    components: {
      Modal
    },

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
      showDeleteModal: false
    }),

    methods: {
      deleteTeam() {
        const projectId = this.$route.params.id;
        const teamId = this.team.id;
        
        if(this.sprint) {
          FirebaseService.removeTeamFromSprint(projectId, this.sprint.id, teamId);
          store.commit('removeTeamFromSprint', {
            projectId,
            sprintId: this.sprint.id,
            teamId
          });
        } else {
          FirebaseService.removeTeam(projectId, teamId);
          store.commit('removeTeamFromProject', {
            projectId,
            teamId
          });
          this.showDeleteModal = false
        }
      }
    }
  }
</script>


<template>
  <tr>
    <td>
      <span class="team-name">{{ team.name }}</span>
    </td>
    <td class="team-actions">
      <a
        v-if="!sprint"
        class="btn-action">
        <i class="icon icon--edit fa fa-edit"></i>
      </a>
      <a
        @click="showDeleteModal = true"
        class="btn-action">
        <i class="icon icon--delete fa fa-trash"></i>
      </a>
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