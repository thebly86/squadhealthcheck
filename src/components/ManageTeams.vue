<template>
  <main class="grid">
    <table 
      v-if="project.teams"
      class="grid__item teams-table">
      <colgroup>
        <col class="teams-table__name">
        <col class="teams-table__edit">
      </colgroup>
      <thead>
        <tr>
          <th>Team</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <team
          v-for="(team, t) in project.teams"
          :key="t"
          :team="team">
        </team>
      </tbody>
    </table>

    <footer 
      class="grid__item footer">
      <section class="footer__action-bar">
        <button 
          @click="showModal = true"
          class="btn-primary action-bar__button">
          ADD TEAM
        </button>
      </section>
    </footer>

    <!-- ADD TEAM -->
    <Modal
      v-if="showModal"
      title="Add Team"
      :actions="actions"
      @close="showModal = false">
      <div slot="body">
        <form @submit.prevent="save">
          <label for="teamName">Team name</label>
          <input type="text" name="teamName" v-model.trim="newTeamName"/>
        </form>
      </div>
    </Modal>
  </main>
</template>


<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Modal from './Modal';
  import Team from "./Team";
  import store from '../store/'

  export default {
    name: 'ManageTeams',

    components: {
      Modal,
      Team
    },

    data: () => ({
      showModal: false,
      newTeamName: ""
    }),

    props: {
      project: {
        type: Object,
        required: true
      }
    },

    computed: {
      actions: function() {
        return [
          {
            name: 'Save',
            class: 'btn-primary',
            action: this.save
          },
          {
            name: 'Cancel',
            class: 'btn-secondary',
            action: () => this.showModal = false
          }
        ]
      }
    },

    created() {
      if (this.$route.params.showModal === true) 
        this.showModal = true;
    },

    methods: {
      save() {
        const newTeam = {
          id: _.camelCase(this.newTeamName),
          name: this.newTeamName
        };
        FirebaseService.createTeam(this.project, newTeam);

        store.commit('addTeamToProject', {
          project: this.project,
          team: newTeam
        });

        this.showModal = false;
        this.newTeamName = "";
      }
    }
  }
</script>


<style>
  .teams-table th {
    padding: 0px 20px 5px 20px;
  }

  .teams-table td {
    padding: 10px 20px;
  }

  .teams-table__name {
    width: 90%;
    padding-left: 20px;
  }

  .teams-table__edit {
    width: 10%;
  }
</style>