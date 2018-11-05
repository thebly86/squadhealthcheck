<script>
  export default {
    name: 'ProjectListItem',

    // Interface
    props: {
      project: {
        type: Object,
        required: true
      }
    },

    // Local state
    computed: {
      projectAcronym: function() {
        if (this.project.name.length < 2) {
          return this.project.name;
        }

        const parts = this.project.name.split(" ", 2);
        if (parts.length < 2) {
          return this.project.name.substring(0, 2).toUpperCase();
        }
        else {
          return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
        }
      }
    },

    // Non-Reactive properties
    methods: {
      getIconUrl(project) {
        let icons = require.context('../assets/', false, /\.png$/);
        return icons("./" + project + ".png");
      }
    }
  }
</script>

<template>
  <router-link 
    :to="{ name: 'ManageProject', params: { id: project.id }}"
    class="project">
    <div class="project__logo">
      <span>{{ projectAcronym }}</span>
    </div>
    <span class="project__name">{{ project.name }}</span>
  </router-link>
</template>

<style scoped>
  .project {
    display: flex;
    align-items: center;
  }

  .project__logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      margin-right: 20px;
      text-align: center;
      color: var(--light);
      background: var(--grey);
  }

  .project__logo span {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 45px;
  }

  .project__name {
    font-size: 1.1rem;
  }
</style>