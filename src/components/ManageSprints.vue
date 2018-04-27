<template>
  <main class="grid">
  </main>
</template>


<script>
  export default {
    name: 'ManageSprints',

    data: () => ({
      title: "Manage Sprints"
    }),

    props: {
      project: {
        type: Object,
        required: true
      }
    }
  }
</script>


<style>

</style>