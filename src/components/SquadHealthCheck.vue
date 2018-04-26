<template>
    <main class="grid">
      <header class="grid__item u-6/12 header">
        <h2>{{ project.name | toUpper }}</h2>
      </header>
      <div class="grid__item u-6/12 action-bar">
        <ul class="actions">
          <li
            @click="manageTeams" 
            class="actions__item">
            <i class="fa fa-user icon--action"/>
            <span>MANAGE TEAMS</span>
          </li>
          <li
            @click="manageSprints"
            class="actions__item">
            <i class="fa fa-bolt icon--action"/>
            <span>MANAGE SPRINTS</span>
          </li>
        </ul>
      </div>
      <table 
        v-if="hasSprints"
        class="grid__item healthcheck-table">
        <colgroup>
          <col class="healthcheck-table__criteria" span="1">
          <col class="healthcheck-table__team" span="10">
        </colgroup>
        <thead class="text-center">
          <tr>
            <th></th>
            <th
              v-for="(team, i) in project.teams"
              :key="i">
              {{ team }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(criteria, k) in criteria"
            :key="k"
            :class="{ 'row--even': k % 2 === 0}"
            class="row">
            <td>
              <i class="fa icon icon--criteria" :class="criteria.icon"/>
              <span>{{ criteria.label }}</span>
            </td>
            <td
              v-for="(team, t) in currentSprint.teams"
              :key="t">
              <TeamStatus 
                @click.native="changeStatus(team, k)"
                :status="team[k].value">
              </TeamStatus>
            </td>
          </tr>
        </tbody>
      </table>
      <footer
        v-if="hasSprints"
        class="grid__item footer">
        <section class="footer__action-bar">
          <button
            :disabled="!hasChanged"
            @click="save"
            class="btn-primary">
            Save
          </button>
          <button
            :disabled="!hasChanged"
            @click="reset"
            class="btn-secondary">
            Reset
          </button>
        </section>
      </footer>
    </main>
</template>


<script>
import FirebaseService from '../utils/firebase/firebase-service.js';
import TeamStatus from './TeamStatus';

export default {
    name: 'SquadHealthCheck',

    components: {
      TeamStatus
    },


    data: () => ({
        criteria: {},
        project: {},
        sprints: [],
        hasChanged: false,
    }),


    computed: {
      currentSprint: function() {
        return this.sprints[this.sprints.length -1];
      },

      hasSprints: function() {
        return this.sprints.length > 0;
      }
    },


    created: function() {
      this.getCriteria();
      this.getProject();
      this.getSprints();
    },


    methods: {
      getCriteria() {
        FirebaseService.getCriteria().then((data) => this.criteria = data);
      },

      getProject() {
        let id = this.$route.params.id;

        // Load project data from session storage or firebase
        if (sessionStorage.getItem(id)) {
          this.project = JSON.parse(sessionStorage.getItem(id));
        }
        else {
          FirebaseService.getProject(id).then((data) => {
            this.project = data;
            sessionStorage.setItem(id, JSON.stringify(this.project));
          }); 
        }
      },

      getSprints() {
        let id = this.$route.params.id;

        // Loads sprint data from session storage or firebase
        if (sessionStorage.getItem(`sprints.${id}`)) {
          this.sprints = JSON.parse(sessionStorage.getItem(`sprints.${id}`));
        }
        else {
          FirebaseService.getSprints(id).then((data) => {
            this.sprints = !_.isNil(data) ? data : [];
            sessionStorage.setItem(`sprints.${id}`, JSON.stringify(this.sprints));
          });
        }
      },

    
      save(data) { 
        FirebaseService.saveSprint(this.project.id, this.currentSprint);
        sessionStorage.removeItem(`sprints.${this.project.id}`);
        this.hasChanged = false;
      },

      reset() {
        this.getSprints();
        this.hasChanged = false;
      },

      manageTeams() {
        
      },

      manageSprints() {

      },

      changeStatus(team, criteria) {
        if (team[criteria].value === 3) {
            team[criteria].value = 1;
        }
        else {
            team[criteria].value++;
        }
        this.hasChanged = true;
      },


      /*
      // TODO: Do this nicer
      addTeam() {
        /*
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
      */
    },


    filters: {
      toUpper: (val) => {
        return val.toUpperCase();
      }
    },


    watch: {
      '$route': function (to, from) {
        this.getProject();
        this.getSprints();
      }
    }
}
</script>


<style>
  .healthcheck-table {
    color: var(--darker-grey);
    font-size: 13px;
    font-weight: 500;
  }

  .healthcheck-table td {
    padding: 8px;
  }

  .healthcheck-table__headings {
    text-align: center;
  }

  .healthcheck-table__criteria {
    width: 20%;
    padding-left: 20px;
  }

  .healthcheck-table__team {
    padding: 10px;
  }

  .icon--criteria {
    width: 40px;   
    padding-left: 10px;
  }

  .actions {
    display: inline-block;
    list-style: none;
    float: right;
    color: var(--darker-grey);
    font-weight: 500;
  }

  .actions__item {
    cursor: pointer;
  }

  .actions__item:hover {
    text-decoration: underline;
  }

  .actions__item span {
  }
</style>