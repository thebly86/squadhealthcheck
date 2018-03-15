<template>
    <section class="project">
        <header class="project__header">
            <h2 class="project__title">{{ getProjectName() }}</h2>
            <div class="project__action-bar pull-right">
                <div 
                    @click="openSprintModal()"
                    class="action mr-3">
                    <i class="fa fa-plus icon m-0"></i>
                    <span>NEW SPRINT</span>
                </div>
                <b-btn 
                    v-b-modal="'addTeam'"
                    class="action">
                    <i class="fa fa-user-plus icon m-0 mr-1"></i>
                    <span>ADD TEAM</span>
                </b-btn>
            </div>
            <div>
                <select class="project__sprints">
                  <option>Sprint 1</option>
                  <option>Sprint 2</option>
                </select>
            </div>
        </header>
        <section 
            class="data-table container mt-4 mb-3">
            <div class="data-table__header row p-2">
                <div class="col-3">CRITERIA</div>
                <div
                    v-for="(team, i) in project.activeSprint.teams"
                    :key="i"
                    v-html="getTeamName(i)"
                    class="col text-center">
                </div>
            </div>
            <div
                v-for="(criterion, key, i) in criteria"
                :key="i"
                :class="{'row--even': i % 2 == 0}"
                class="data-table__content row px-2 py-2">
                <div class="col-3">
                    <div class="icon">
                        <i 
                        :class="criterion.icon"
                        class="fa"></i>
                    </div>
                    <span>{{criterion.label}}</span>
                </div>
                <div
                    v-for="(team, k) in project.activeSprint.teams"
                    :key="k"
                    class="col">
                    <team-status 
                        :criteria="key"
                        :team="team"
                        @click.native="changeStatus(team, key)"
                        class="mt-2 mx-auto">
                    </team-status>
                </div>
            </div>
        </section>
        <footer class="project__footer">
            <div class="pull-right">
                <button class="button btn-primary">SAVE</button>
                <button class="button btn-secondary">RESET</button>
            </div>
        </footer>
        <b-modal 
            centered
            title="Add Team"
            id="addTeam">
            <h2>
                Add Team.
            </h2>
        </b-modal>
    </section>
</template>


<script>
    import TeamStatus from './TeamStatus';

    export default {
        name: 'SquadHealthCheck',

        components: {
            TeamStatus
        },
        
        props: {
            criteria: {
                type: Object,
                required: true
            },
            project: {
                type: Object,
                required: true
            }
        },

        created: function() {
            console.log('selected project', this.project);
        }

        methods: {
            getProjectName() {
                return this.project.name.toUpperCase();
            },

            getTeamName(team) {
                return team.charAt(0).toUpperCase() + team.slice(1).replace(/([A-Z])/g, ' $1').trim();
            },

            changeStatus(team, criteria) {
                if (team[criteria].value === 3) {
                    team[criteria].value = 0;
                }
                else {
                    team[criteria].value++;
                }
            },

            openTeamModal() {
                console.log('ADD TEAM');
            },

            openSprintModal() {
                console.log('ADD SPRINT');
            }
        }
    }
</script>


<style>
    .project {
        
    }

    .project__header {

    }

    .project__title {
        display: inline-block;
        font-size: 2em;
    }

    .project__action-bar {
        display: inline-block;
        font-size: 13px;
    }

    .project__sprints {
        width: 200px;
        color: #999999;
        outline: none;
    }

    .action {
        display: inline-block;
        font-size: 14px;
        color: #999999;
    }

    .action:hover {
        color: black;
        cursor: pointer;
    }

    .project__footer {
        font-size: 13px;
        height: 30px;
    }

    .data-table {
        font-size: 13px;
    }

    .data-table__header {
        border-bottom: solid 1px #CCCCCC;
    }

    .data-table__content {

    }

    .row--even {
        background: #f2f2f2;
    }

    .icon {
        display: inline-block;
        width: 20px;
        color: #999999;
        margin-right: 0.8em;
        font-size: 1.5em;
    }
    
    .button {
        width: 100px;
        padding: 0.4em;
        border: none;
    }

    .button:hover {
        cursor: pointer;
    }

    .btn-primary {
        background-color: #4CC797;
    }

    .btn-primary:hover {
        background-color: #46BA8D;
    }

    .btn-secondary {
        background-color: #E4E4E4;
        color: #868686;
    }

    .btn-secondary:hover {
        background-color: #999999;
    }
</style>