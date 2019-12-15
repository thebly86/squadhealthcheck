<script>
import TeamStatus from "@/components/TeamStatus";

import { STATUS } from "@/utils/constants";

export default {
  name: "SprintView",

  // Template dependencies
  components: {
    TeamStatus
  },

  // Interface
  props: {
    project: {
      type: Object,
      required: true,
      default: () => ({})
    },

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

    // save: {
    //   type: Function,
    //   required: false,
    //   default: () => {}
    // },

    reset: {
      type: Function,
      required: false,
      default: () => {}
    },

    selectTeam: {
      type: Function,
      required: false,
      default: () => {}
    },

    selectedSprintId: {
      type: String,
      required: false,
      default: null
    },

    getStatusChange: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  // Local state
  data: () => ({
    currentSprintId: null,
    hasChanged: false
  }),

  computed: {
    currentSprint: {
      get: function() {
        if (this.sprints) {
          return this.getSprintById(this.currentSprintId);
        }
        return null;
      },
      set: function(sprint) {
        this.currentSprintId = this.getSprintById(sprint.id).id;
      }
    }
  },

  // Events
  created() {
    if (this.selectedSprintId) {
      this.currentSprint = this.getSprintById(this.selectedSprintId);
    } else if (this.sprints.length) {
      this.currentSprint = _.findLast(this.sprints);
    }
  },

  watch: {
    currentSprint: function(sprint) {
      sessionStorage.setItem("sprint_backup", JSON.stringify(sprint));
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

    /**
     * @description Methods returns the id of the given sprint
     * @param {Object} sprint
     * @returns {String} the id/key of the given sprint
     */
    getSprintId(currentSprint) {
      return _.find(this.sprints, sprint => sprint.id === currentSprint.id).id;
    },

    /**
     * @description Method return the sprint object with the given id
     * @param {String} sprintId the id of the sprint
     * @returns {Object} sprint object
     */
    getSprintById(sprintId) {
      return this.sprints.find(sprint => sprint.id === sprintId);
    },

    onSelectStatus(sprintId, teamId, criteria) {
      const currentStatus = this.currentSprint.teams[teamId][criteria].value;
      let newStatus;

      // Determine the status to change to
      if (currentStatus === STATUS.GREEN) {
        newStatus = STATUS.EMPTY;
      } else {
        newStatus = currentStatus + 1;
      }

      // Save the new status
      this.currentSprint.teams[teamId][criteria].value = newStatus;
      this.hasChanged = true;
    },

    async save() {
      try {
        await this.$store.dispatch("updateTeamsSprintData", {
          projectId: this.$route.params.id,
          sprintId: this.currentSprint.id,
          sprint: this.currentSprint
        });

        this.$notify({
          group: "app",
          text: "Health check data saved.",
          type: "success"
        });
      } catch (error) {
        this.$notify({ group: "app", text: error.message, type: "error" });
      }

      this.hasChanged = false;
    }
  }
};
</script>

<template>
  <section v-if="sprints.length && currentSprint" class="project-health">
    <div class="project-health__content">
      <table class="health-check__table">
        <!-- <colgroup>
          <col span="1" style="width: 20%;" />
          <col span="1" style="width: 20%;" />
        </colgroup>-->

        <thead :style="{ background: project.color }">
          <tr class="health-check__headings">
            <th class="health-check__sprint-selection">
              <select
                v-model="currentSprint"
                name="sprints"
                class="sprint-selection"
                id="select-current-sprint"
              >
                <option
                  v-for="sprint in sprints"
                  :key="sprint.id"
                  :value="sprint"
                  :id="`health-check_sprint-${sprint.sprintName}`"
                >{{ sprint.sprintName }}</option>
              </select>
            </th>
            <th
              v-for="team in teams"
              :key="team.id"
              class="health-check__header"
              :id="`health-check_team-${team.id}`"
              @click="selectTeam(team.id)"
            >{{ team.name }}</th>
            <th class="empty"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(criterion, key) in criteria" :key="criterion.id" class="health-check__row">
            <td class="tooltip-target health-check__criteria">
              <v-popover offset="16">
                <!-- This will be the popover target (for the events and position) -->
                <i class="fa icon icon--criteria" :class="criterion.icon" />
                <span class="criterion">{{ criterion.label }}</span>

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
            <td v-for="team in teams" :key="team.id" class="health-check__status">
              <TeamStatus
                @click.native="onSelectStatus(currentSprint.id, team.id, key)"
                :status="currentSprint.teams[team.id][key].value"
                :statusChange="getStatusChange(currentSprint, team.id, key)"
                :id="`sprint${currentSprint.sprintNumber}-${team.name}-${criterion.id}`"
              />
            </td>
            <td class="empty"></td>
          </tr>
        </tbody>
      </table>

      <!-- Sprint data actions -->
      <div class="health-check__footer">
        <button @click="reset" class="btn--secondary">Reset</button>
        <button @click="save" class="btn--primary">Save</button>
      </div>
    </div>
  </section>
</template>

<style>
</style>