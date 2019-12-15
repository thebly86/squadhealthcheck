<script>
import FirebaseService from "@/api/firebase-service.js";

import DropdownMenu from "./DropdownMenu";
import DropdownMenuButton from "./DropdownMenuButton";
import Modal from "./Modal";
import Icon from "./Icon";

import { HEALTH, TEAMS, SPRINTS } from "@/config/project-header";

export default {
  name: "ProjectHeader",

  // Template dependencies
  components: {
    DropdownMenu,
    DropdownMenuButton,
    Modal,
    Icon
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
    },

    iconStyle: function() {
      return {
        background: this.project.color,
        width: "35px",
        height: "35px",
        fontSize: "1.2rem"
      };
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
  <header class="header project-header">
    <div class="project-header__title">
      <Icon :label="project.name" :style="iconStyle" />
      <h2>{{ project.name }}</h2>
    </div>

    <!-- Project navigation -->
    <ul class="project-nav">
      <li class="project-nav__item">
        <router-link to="health">
          <i class="fa fa-heartbeat icon--action" />
          <span>Team Health</span>
        </router-link>
      </li>
      <li class="project-nav__item">
        <router-link to="teams">
          <i class="fa fa-user icon--action" />
          <span>Teams</span>
        </router-link>
      </li>
      <li class="project-nav__item">
        <router-link to="sprints">
          <i class="fa fa-repeat icon--action" />
          <span>Sprints</span>
        </router-link>
      </li>
    </ul>

    <!-- Health Check Toolbar -->
    <!-- <ul class="health-check-toolbar">
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
    </ul>-->
  </header>
</template>

<style scoped>
.project-header {
  background-color: var(--dark-grey);
  color: var(--light);
}

.project-header__title {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.health-check-toolbar {
  display: flex;
  margin-left: auto;
}

.health-check-toolbar__item {
  background-color: var(--light);
  color: var(--dark-grey);
  border: solid 1px var(--darker-grey);
  width: 30px;
  text-align: center;
  padding: 4px;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  /* border-radius: 50%; */
}

.health-check-toolbar__item:last-of-type {
  margin-right: 0;
}

.health-check-toolbar__item--active {
  color: var(--health-green);
  /* background: var(--light); */
}

.project-title {
  margin-right: 20px;
}

.project-nav {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.project-nav__item {
  color: var(--light);
  margin-right: 15px;
}

.project-nav__item:hover {
  text-decoration: underline;
}

.project-nav__item i,
.project-nav__item a {
  color: var(--light);
  opacity: 0.8;
}

.tab__link--active {
  opacity: 1 !important;
}

.tab__link--active span {
  color: var(--light);
  text-decoration: underline;
}

.tab__link--active .icon--action {
  color: var(--light);
  opacity: 1;
}
</style>
