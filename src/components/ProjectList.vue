<script>
import ProjectListItem from './ProjectListItem';

export default {
  name: 'ProjectList',
  
  // Template dependencies
  components: {
    ProjectListItem
  },

  // Interface
  props: {
    projects: {
      type: Object,
      required: true
    }
  },

  // Non-Reactive properties
  methods: {

  }
}
</script>

<template>
  <ul class="data-list">
    <li
      v-for="project in projects"
      :key="project.id"
      class="data-list__item">
      <project-list-item :project=project></project-list-item>
    </li>
  </ul>
</template>

<style scoped>

</style>