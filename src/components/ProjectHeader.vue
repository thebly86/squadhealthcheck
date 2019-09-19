<script>
import FirebaseService from "@/api/firebase-service.js";

import DropdownMenu from "./DropdownMenu";
import DropdownMenuButton from "./DropdownMenuButton";
import Modal from "./Modal";

import { HEALTH, TEAMS, SPRINTS } from "@/config/project-header";

export default {
  name: "ProjectHeader",

  // Template dependencies
  components: {
    DropdownMenu,
    DropdownMenuButton,
    Modal
  },

  // Local state
  data: () => ({
    showDeleteModal: false,
    showEditModal: false,
    newProjectName: ""
  }),

  computed: {
    project: function() {
      return this.$store.getters.getProject(this.$route.params.id);
    },

    deleteActions: function() {
      return [
        {
          name: "Delete",
          class: "btn--primary btn--danger",
          action: this.deleteProject
        }
      ];
    },

    editActions: function() {
      return [
        {
          name: "Update",
          class: "btn--primary",
          action: this.editProject
        }
      ];
    },

    teamView: function() {
      return this.$store.getters.teamView;
    },

    sprintView: function() {
      return this.$store.getters.sprintView;
    }
  },

  // Non-reactive properties
  methods: {
    projectColor(property) {
      return { [property]: this.project.color };
    },

    toggleTeamView() {
      this.$store.commit("toggleTeamView");
    },

    toggleSprintView() {
      this.$store.commit("toggleSprintView");
    }
  }
};
</script>

<template>
  <header class="header">
    <h2 :style="projectColor('color')" class="project-title">{{ project.name }}</h2>

    <!-- Project navigation -->
    <ul class="project-nav">
      <li class="project-nav__item">
        <router-link to="health">
          <i class="fa fa-heartbeat icon--action" />
          <span>TEAM HEALTH</span>
        </router-link>
      </li>
      <li class="project-nav__item">
        <router-link to="teams">
          <i class="fa fa-user icon--action" />
          <span>TEAMS</span>
        </router-link>
      </li>
      <li class="project-nav__item">
        <router-link to="sprints">
          <i class="fa fa-repeat icon--action" />
          <span>SPRINTS</span>
        </router-link>
      </li>
    </ul>

    <!-- Health Check Toolbar -->
    <ul class="health-check-toolbar">
      <li
        @click="toggleTeamView"
        :class="{ 'health-check-toolbar__item--active': teamView }"
        class="health-check-toolbar__item"
        v-tooltip.bottom="{ content: 'Team view', classes: 'tooltip', delay: 500 }"
      >
        <i class="fa fa-user health-check-toolbar__icon icon--large" />
      </li>
      <li
        @click="toggleSprintView"
        :class="{ 'health-check-toolbar__item--active': sprintView }"
        class="health-check-toolbar__item"
        v-tooltip.bottom="{ content: 'Sprint view', classes: 'tooltip', delay: 500 }"
      >
        <i class="fa fa-repeat health-check-toolbar__icon icon--large" />
      </li>
    </ul>
  </header>
</template>

<style scoped>
.health-check-toolbar {
  display: flex;
  margin-left: auto;
}

.health-check-toolbar__item {
  color: var(--grey);
  border: solid 1px var(--light-grey);
  width: 30px;
  text-align: center;
  padding: 4px;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.health-check-toolbar__item:last-of-type {
  margin-right: 0;
}

.health-check-toolbar__item--active {
  color: var(--light);
  background: var(--grey);
}

.project-title {
  margin-right: 20px;
}

.project-nav {
  display: flex;
  align-items: center;
}

.project-nav__item {
  margin-right: 15px;
}

.project-nav__item:hover {
  text-decoration: underline;
}

li.actions__item .tab__link--active {
  color: var(--dark-grey);
}

.tab__link--active span {
  color: var(--dark-grey);
  text-decoration: underline;
}

.tab__link--active .icon--action {
  color: var(--dark-grey);
}
</style>
