<template>
  <tr>
    <td>
      <img class="project__logo" :src="getIconUrl(project.icon)"/>
    </td>
    <td>
      <span>{{project.name}}</span>
    </td>
  </tr>
</template>


<script>
    export default {
        name: 'Project',

        props: {
          project: {
            type: Object,
            required: true
          }
        },

        methods: {
          getIconUrl(project) {
            let icons = require.context('../assets/', false, /\.png$/);
            return icons("./" + project + ".png");
          }
        }
    }
</script>


<style>
    .project__logo {
        max-width: 45px;
        margin-left: 20px;
    }
</style>