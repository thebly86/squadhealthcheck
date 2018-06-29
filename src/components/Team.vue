<script>
  import store from '../store/index.js'
  import FirebaseService from '../utils/firebase/firebase-service.js';

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
        @click="deleteTeam"
        class="btn-action">
        <i class="icon icon--delete fa fa-trash"></i>
      </a>
    </td>
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