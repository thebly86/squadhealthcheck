<script>
import TeamStatus from "@/components/TeamStatus";

import { STATUS, MAX_SPRINTS_DISPLAYED } from "@/utils/constants";

export default {
  name: "TeamView",

  // Template dependencies
  components: {
    TeamStatus
  },

  // Interface
  props: {
    criteria: {
      type: Array,
      required: true,
      default: []
    },

    teams: {
      type: Array,
      required: true,
      default: {}
    },

    sprints: {
      type: Array,
      required: true,
      default: []
    },

    config: {
      type: Object,
      required: false,
      default: () => {}
    },

    reset: {
      type: Function,
      required: false,
      default: () => {}
    },

    selectSprint: {
      type: Function,
      required: false,
      default: () => {}
    },

    selectedTeamId: {
      type: String,
      required: false,
      default: () => {}
    },

    getStatusChange: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  // Local state
  data: () => ({
    currentTeamId: null,
    hasChanged: false
  }),

  computed: {
    currentTeam: {
      get: function() {
        if (this.teams) {
          return this.getTeamById(this.currentTeamId);
        }
        return null;
      },
      set: function(team) {
        this.currentTeamId = this.getTeamById(team.id).id;
      }
    },

    displayedSprints: function() {
      return this.sprints.length < MAX_SPRINTS_DISPLAYED
        ? this.sprints
        : this.sprints.slice(-5);
    }
  },

  // Events
  created() {
    if (this.selectedTeamId) {
      this.currentTeam = this.getTeamById(this.selectedTeamId);
    } else if (this.teams.length) {
      this.currentTeam = this.teams[0];
    }
  },

  // Non-Reactive properties
  methods: {
    setCssProperty(property) {
      const tinycolor = require("tinycolor2");
      const color = tinycolor(this.config.color);
      color.setAlpha(0.5);
      return { [property]: color };
    },

    getTeamById(teamId) {
      return this.teams.find(team => team.id === teamId);
    },

    onSelectStatus(sprintId, teamId, criteria) {
      const sprint = this.sprints.find(sprint => sprint.id === sprintId);
      const currentStatus = sprint.teams[teamId][criteria].value;
      let newStatus;

      // Determine the status to change to
      if (currentStatus === STATUS.GREEN) {
        newStatus = STATUS.EMPTY;
      } else {
        newStatus = currentStatus + 1;
      }

      // Save the new status
      sprint.teams[teamId][criteria].value = newStatus;
      this.hasChanged = true;
    },

    save() {
      const sprints = this.sprints.reduce((acc, sprint) => {
        acc[sprint.id] = _.omit(sprint, "id");
        return acc;
      }, {});

      this.$store.dispatch("updateSprints", {
        projectId: this.$route.params.id,
        sprints: sprints
      });
      this.hasChanged = false;
    }
  }
};
</script>

<template>
  <section class="project-health">
    <div class="project-health__content">
      <table class="health-check__table">
        <thead :style="this.setCssProperty('background')">
          <tr class="health-check__headings">
            <th class="health-check__team-selection">
              <select
                v-model="currentTeam"
                name="teams"
                class="team-selection"
                id="select-current-team"
              >
                <option
                  v-for="team in teams"
                  :key="team.id"
                  :value="team"
                  :id="`health-check_team-${team.name}`"
                >{{ team.name }}</option>
              </select>
            </th>
            <th
              v-for="sprint in displayedSprints"
              :key="sprint.id"
              class="health-check__header"
              :id="`health-check_sprint-${sprint.id}`"
              @click="selectSprint(sprint.id)"
            >{{ `Sprint ${sprint.sprintNumber}` }}</th>
            <th class="empty"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(criterion, key) in criteria" :key="criterion.id" class="health-check__row">
            <td class="tooltip-target health-check__criteria">
              <v-popover offset="16">
                <!-- This will be the popover target (for the events and position) -->
                <i class="fa icon icon--criteria" :class="criterion.icon" />
                <span>{{ criterion.label }}</span>

                <!-- Popover content -->
                <template slot="popover" class="popover__criteria">
                  <div class="popover__criteria">
                    <h4>{{criterion.label}}</h4>
                    <div class="criteria">
                      <TeamStatus :status="3"></TeamStatus>
                      <p>{{criterion.description.green}}</p>
                    </div>
                    <div class="criteria">
                      <TeamStatus :status="1"></TeamStatus>
                      <p>{{criterion.description.red}}</p>
                    </div>
                  </div>
                </template>
              </v-popover>
            </td>
            <td v-for="sprint in displayedSprints" :key="sprint.id" class="health-check__status">
              <TeamStatus
                @click.native="onSelectStatus(sprint.id, currentTeam.id, key)"
                :status="sprint.teams[currentTeam.id][key].value"
                :statusChange="getStatusChange(sprint, currentTeam.id, key)"
                :id="`team-${currentTeam.name}-sprint-${sprint.sprintNumber}-${criterion.id}`"
              />
            </td>
            <td class="empty"></td>
          </tr>
        </tbody>
      </table>

      <!-- Sprint data actions -->
      <div class="health-check__footer">
        <button :disabled="!hasChanged" @click="save" class="btn--primary">Save</button>
        <button :disabled="!hasChanged" @click="reset" class="btn--secondary">Reset</button>
      </div>
    </div>
  </section>
</template>

<style>
</style>