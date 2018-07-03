<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Modal from './Modal';
  import Team from "./Team";

  export default {
    name: 'ManageTeams',

    // Template dependencies
    components: {
      Modal,
      Team
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
      showModal: false,
      newTeamName: ""
    }),

    computed: {
      actions: function() {
        return [
          {
            name: 'Save',
            class: 'btn-primary',
            action: this.save
          }
        ]
      }
    },

    // Events
    created() {
      if (this.$route.params.showModal === true) 
        this.showModal = true;
    },

    // Non-Reactive properties
    methods: {
      save() {
        const newTeam = {
          id: _.camelCase(this.newTeamName),
          name: this.newTeamName
        };

        FirebaseService.saveTeam(this.project, newTeam);
        this.$store.commit('addTeamToProject', {
          projectId: this.project.id,
          team: newTeam
        });

        this.showModal = false;
        this.newTeamName = "";
      }
    }
  }
</script>

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
        <tr>
          <td>
            <span>
              <input
                type="text"
                name="teamName"
                id="teamName"
                class="edit-team"
                placeholder="Team Name"
                v-model.trim="newTeamName"/>
            </span>
          </td>
          <td>
            <div class="edit-team-actions sprint-actions">
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
      class="grid__item footer">
      <section class="footer__action-bar">
      </section>
    </footer>
  </main>
</template>

<style>
  .teams-table th {
    padding: 0px 20px 5px 20px;
  }

  .teams-table td {
    padding: 10px 20px;
  }

  .teams-table__name {
    width: 80%;
    padding-left: 20px;
  }

  .teams-table__edit {
    width: 20%;
  }

  .edit-team {
    width: 25%;
  }

  .edit-team-actions {
    text-align: right;
  }
</style>