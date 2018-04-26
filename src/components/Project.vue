<template>
    <tr>
        <td>
            <img class="project__logo" :src="getIconUrl(project.icon)"/>
        </td>
        <td>
            <span>{{project.name}}</span>
        </td>
        <td>
          <a class="btn-action">
            <i class="icon icon--edit fa fa-edit"></i>
          </a>
          <a class="btn-action">
            <i class="icon icon--delete fa fa-trash"></i>
          </a>
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

    .icon--edit {
      color: var(--health-green);
      margin-right: 5px;
    }

    .icon--delete {
      color: var(--grey);
    }

    .btn-action {
      margin-right: 10px;
    }
</style>