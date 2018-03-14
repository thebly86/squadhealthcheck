<template>
    <div class="py-2">
        <div class="col-">
            <img class="project__logo" :src="getIconUrl(project.icon)"/>
        </div>
        <div class="col ml-4 mt-3 align-items-bottom">
            <span>{{project.name}}</span>
        </div>
    </div>
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
    }

    .row {
        border-bottom: solid 1px #ccc;
    }

    .row:hover {
        cursor: pointer;
        background: #f9f9f9;
    }
</style>