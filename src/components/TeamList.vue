<script>
  import TeamListItem from "./TeamListItem";

  export default {
    name: 'TeamList',

    // Template dependencies
    components: {
      TeamListItem
    },

    // Local state
    computed: {
      project() {
        return this.$store.getters.getProject(this.$route.params.id);
      }
    },

    // Events
    created() {
      
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
      <team-list-item :team="team"></team-list-item>
    </li>
  </ul>
</template>

<style scoped>

</style>