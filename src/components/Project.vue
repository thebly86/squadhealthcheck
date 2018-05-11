<template>
  <tr>
    <td>
      <!--<img class="project__logo" :src="getIconUrl(project.icon)"/>-->
      <div class="project__logo">
        <span class="test">{{ projectAcronym }}</span>
      </div>
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
        width: 45px;
        height: 45px;
        margin: 0px 0px 5px 20px;
        text-align: center;
        color: var(--light);
        background: var(--grey);
    }

    .project__logo span {
      position: relative;
      top: 5px;
      font-size: 26px;
      font-weight: 600;
      margin: 0 5px;
    }
</style>