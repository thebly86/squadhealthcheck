<script>
  import FirebaseService from '@/utils/firebase/firebase-service.js';
  import Validator from '@/utils/validation/validation.js'
  import Modal from './Modal';
  import TeamListItem from "./TeamListItem";

  export default {
    name: 'TeamList',

    // Template dependencies
    components: {
      TeamListItem
    },

    // Local state
    data: () => ({
      newTeamName: ""
    }),

    computed: {
      project() {
        return this.$store.getters.getProject(this.$route.params.id);
      }
    },

    // Events
    created() {
      console.log(this.project);
    },

    // Non-Reactive properties
    methods: {
      
    }
  }
</script>

<template>
  <ul 
    v-if="project.teams"
    class="data-list">
    <li
      v-for="team in project.teams"
      :key="team.id"
      class="data-list__item">
      <team-list-item :team=team></team-list-item>
    </li>
  </ul>
</template>

<style scoped>
  .teams {
    padding: 5px 0px;
  }

  .error {
    margin-left: 15px;
  }

  .add-row {
    margin: 5px 0px 5px 15px;
    padding: 8px 0;
  }

  .btn--add-team {
    position: relative;
    left: 4%;
    top: 4px;
  }
  
  #add-team {
    width: 25%;
  }
</style>