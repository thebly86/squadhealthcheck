<template>
  <main class="grid">
    <ProjectHeader
      :project="project">
    </ProjectHeader>

    <section 
      v-if="!project.teams"
      class="grid__item no-data">
      <p>
        <router-link 
          :to="{ name: 'ManageTeams', params: { showModal: true }}"
          class="no-data__link">
          Add a team
        </router-link>
        to get started.
      </p>
    </section>

    <Modal
      v-if="showDeleteModal"
      title="Delete Project"
      v-bind:actions="deleteActions"
      @close="showDeleteModal = false">
      <div slot="header" class="text--danger">

      </div>
      <div slot="body">
        <p class="text-center">
          Are you sure you want to delete this project? <br/><br/>
          <b>All team and sprint data will be lost permanently.</b>
        </p>
      </div>
    </Modal>

    <Modal
      v-if="showEditModal"
      title="Edit Project"
      v-bind:actions="editActions"
      @close="showEditModal = false">
      <div slot="body">
        <form>

        </form>
      </div>
    </Modal>

    <router-view 
      @reset="reset"
      @teamAdded="updateTeams"
      @createSprint="addSprint"
      :criteria="criteria"
      :project="project" 
      :sprints="sprints"
      class="grid__item"></router-view>
    <router-view class="BINGO" name="manageTeams"></router-view>
    <router-view name="manageSprints"></router-view>
  </main>
</template>


<script>
import FirebaseService from '../utils/firebase/firebase-service.js';
import Modal from './Modal';
import ProjectHeader from './ProjectHeader';

export default {
  name: 'ProjectView',

  components: {
    Modal,
    ProjectHeader
  },

  data: () => ({
    criteria: {},
    project: {},
    sprints: [],
    showDeleteModal: false,
    showEditModal: false
  }),

  computed: {
    deleteActions: function() {
      return [
        {
          name: 'Delete',
          class: 'btn-primary btn--danger',
          action: this.deleteProject
        }, 
        {
          name: 'Cancel',
          class: 'btn-secondary',
          action: () => this.showDeleteModal = false
        }
      ]
    },

    editActions: function() {
      return [
        {
          name: 'Save', 
          class: 'btn-primary',
          action: this.editProject
        },
        {
          name: 'Cancel',
          class: 'btn-secondary',
          action: this.showEditModal = false
        }
      ]
    }
  },


  created() {
    this.loadData();
    this.getCriteria();
  },

  beforeMount() {
    this.$router.push({ name: 'ManageTeamHealth' });
  },

  mounted() {
    this.$el.addEventListener("deleteProject", () => this.deleteProject());
    this.$el.addEventListener("editProject", () => this.editProject());
  },


  methods: {
    deleteProject() {
      FirebaseService.deleteProject(this.project);
      this.$emit('closeTab', this.project);
    },

    editProject() {
      console.log('edit project');
    },

    addSprint() {
      const sprint = { teams: [] };
      console.log('project', this.project);
      _.forEach(this.project.teams, (team) => {
        console.log('team', team);
        _.forEach(this.criteria, (criterion) => {
          sprint.teams[team][criterion] = {
            value: 0
          }
        });
      });

      console.log('sprint', sprint);

      //FirebaseService.createSprint();
      
      console.log('addSprint', this.project);
    },

    loadData() {
      Promise.all([this.getProject(), this.getSprints()])
        .then((results) => {
          const [project, sprints] = results;
          this.project = project;
          this.sprints = !_.isNil(sprints) ? sprints : [];
          this.updateSession();
      });
    },

    getCriteria() {
      FirebaseService.getCriteria().then((data) => this.criteria = data);
    },

    getProject() {
      return FirebaseService.getProject(this.$route.params.id);
    },

    getSprints() {
      return FirebaseService.getSprints(this.$route.params.id);
    },

    reset() {
      this.sprints = JSON.parse(sessionStorage.getItem(`${this.project.id}.sprints`));
    },

    updateTeams(team) {
      // Create teams property if it doesn't exist
      if (!this.project.teams) {
        this.project.teams = [];
      }
      let teamKey = _.camelCase(team);
      this.project.teams[teamKey] = team;
      this.updateSession();
    },

    updateSession() {
      sessionStorage.setItem(`${this.project.id}`, JSON.stringify(this.project));
      sessionStorage.setItem(`${this.project.id}.sprints`, JSON.stringify(this.sprints));
    }
  },


  watch: {
    '$route': function (to, from) {
      this.loadData();
    }
  }
}
</script>


<style>

</style>