<template>
  <tr>
    <td>
      <span class="team-name">{{ team.name }}</span>
    </td>
    <td class="team-actions">
      <a class="btn-action">
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


<script>
  import store from '../store/index.js'
  import FirebaseService from '../utils/firebase/firebase-service.js';

  export default {
    name: 'Team',

    props: {
      team: {
        type: Object,
        required: true
      }
    },
    methods: {
      deleteTeam() {
        const projectId = this.$route.params.id;
        
        FirebaseService.removeTeam(projectId, this.team.id);
        store.commit('removeTeamFromProject', {
          projectId: projectId,
          teamId: this.team.id
        });
      }
    }
  }
</script>


<style>
.team-name {
  padding: 2px 2px;
}

.team-actions {
  padding: 3px;
}

tr:hover .btn-action {
  display: inline-block;
}

.btn-action {
  display: none;
}

</style>