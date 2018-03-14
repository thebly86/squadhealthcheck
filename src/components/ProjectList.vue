<template>
    <section>
        <header>
            <h2>MANAGE PROJECTS</h2>
        </header>
        <section class="data-table container my-4">
            <div class="data-table__header row">
                <div class="col- mr-4"></div>
                <div class="col ml-5">PROJECT</div>
            </div>
            <project 
                v-for="(project, i) in projects"
                :key="i"
                :project="project"
                @click.native="selectProject(project)"
                class="row">
            </project>
        </section>
    </section>
</template>


<script>
    import Project from './Project';

    export default {
        name: 'ProjectList',

        components: {
            Project
        },

        props: {
            projects: {
                type: Object,
                required: true
            }
        },

        data: () => ({
            columns: [
                { heading: 'Icon', isVisible: false },
                { heading: 'Name', isVisible: true }
            ],
            rows: []
        }),

        created() {
            this.rows = this.$children;
        },

        methods: {
            selectProject(project) {
                this.$emit('projectSelected', project);
            }
        }
    }
</script>


<style>
    .data-table {
        font-size: 14px;
    }

    .data-table__header {
        color: #999999;
    }
</style>