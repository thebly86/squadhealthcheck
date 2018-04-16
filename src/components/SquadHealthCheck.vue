<template>
    <section class="project">
        <header class="project__header">
            <h2 class="project__title">{{ getProjectName() }}</h2>
            <div class="project__action-bar pull-right">
                <div
                    class="btn-action mr-3">
                    <i class="fa fa-recycle icon m-0"></i>
                    <span>MANAGE SPRINTS</span>
                </div>
                <div
                    @click="manageTeams"
                    class="btn-action">
                    <i class="fa fa-users icon m-0 mr-1"></i>
                    <span>MANAGE TEAMS</span>
                </div>
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
                        :status="getTeamStatus(team, key)"
                        @click.native="changeStatus(team, key)"
                        class="mt-2 mx-auto">
                    </team-status>
                </div>
            </div>
        </section>
        <footer class="project__footer">
            <div class="pull-right">
                <button 
                    @click="save()"
                    class="button btn-primary">SAVE</button>
                <button 
                    @click="reset()"
                    class="button btn-secondary">RESET</button>
            </div>
        </footer>
        <b-modal 
            centered
            @ok="addTeam()"
            title="Add Team"
            id="addTeam">
            <form>
                <label>Team</label>
                <input 
                    id="addTeamInput"
                    v-model="newTeam"
                    type="text" 
                    required/>
            </form>
        </b-modal>
    </section>
</template>


<script>
    import TeamStatus from './TeamStatus';
    import * as firebase from "firebase";
    import { slugify } from '../utils/utils';

    export default {
        name: 'HealthCheck',

        components: {
            TeamStatus
        },

        data: () => ({
            newTeam: ""
        }),
        
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

        methods: {
            getProjectName() {
                return this.project.name.toUpperCase();
            }, 

            getTeamName(team) {
                return team.charAt(0).toUpperCase() + team.slice(1).replace(/([A-Z])/g, ' $1').trim();
            },

            getTeamStatus(team, criteria) {
                return team[criteria].value;
            },

            changeStatus(team, criteria) {
                if (team[criteria].value === 3) {
                    team[criteria].value = 1;
                }
                else {
                    team[criteria].value++;
                }
                this.$forceUpdate()
            },

            save() { 
                let ref = firebase.database().ref('sprints/' + this.project.id + "/" + this.project.activeSprint.id + "/teams");
                ref.set(this.project.activeSprint.teams);
            },

            reset() {
                firebase.database().ref('sprints/' + this.project.id + "/" + this.project.activeSprint.id).once('value').then((snapshot) => {
                    this.project.activeSprint = snapshot.val();
                })
                .then(() => {
                    this.$forceUpdate();
                });
            },

            // TODO: Do this nicer
            addTeam() {
                let teamSprint = {};
                _.forEach(this.criteria, (criterion) => {
                    teamSprint[this.camelize(criterion.label)] = { value: 0 };
                })

                this.project.teams[slugify(this.camelize(this.newTeam))] = true;
                // Add team to current sprint:
                _.forEach(this.project.sprints, (sprint) => {
                    sprint.teams[slugify(this.camelize(this.newTeam))] = teamSprint;
                });
                this.newTeam = "";
                this.$forceUpdate();

                console.log(this.project);
            },

            manageTeams() {
                console.log('tests');
                console.log(this);
            },

            // TODO: Move to utils
            camelize(str) {
                return str
                    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
                    .replace(/\s/g, '')
                    .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
            }

        }
    }
</script>


<style>
    /* Tidy in CSS refactor */

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
        border: none;
        border-radius: 0;
    }

    .btn-primary:hover {
        background-color: #46BA8D;
    }

    .btn-secondary {
        background-color: #E4E4E4;
        color: #868686;
        border: none;
        border-radius:0;
    }

    .btn-secondary:hover {
        background-color: #D5D5D5;
        color: #868686;
    }

    .btn-action {
        display: inline-block;
        font-size: 14px;
        color: #999999;
        background: #FFF;
        border:none;
    }

    .btn-action:hover {
        background: none;
        color: #868686;
        text-decoration: underline;
        cursor: pointer;
    }

    .btn-action:focus {
        background: none;
        border: none;
    }
</style>