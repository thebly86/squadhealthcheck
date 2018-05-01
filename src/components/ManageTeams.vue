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
      v-if="project.teams"
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
          <input type="text" name="teamName" v-model.trim="newTeam"/>
        </form>
      </div>
    </Modal>
  </main>
</template>


<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Modal from './Modal';
  import Team from "./Team";

  export default {
    name: 'ManageTeams',

    components: {
      Modal,
      Team
    },

    data: () => ({
      showModal: false,
      newTeam: ""
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
        FirebaseService.saveTeam(this.project, this.newTeam)
        this.$emit('teamAdded', this.newTeam);
        this.showModal = false;
        this.newTeam = "";
      }
    }
  }
</script>


<style>


  .teams-table th {
    padding: 0px 20px;
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