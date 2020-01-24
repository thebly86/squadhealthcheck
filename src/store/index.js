import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import * as firebase from "firebase";
import * as FirebaseService from "@/api/firebase-service.js";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    projects: {},
    criteria: {},
    activeSprint: {},
    activeProject: {},
    activeTeam: {},
    sprintView: true,
    teamView: false,
    user: {}
  },

  getters: {
    getProject: state => projectId => state.projects[projectId],

    getCriteria: state => state.criteria,

    getSprint: state => (projectId, sprintId) => {
      return state.projects[projectId].sprints[sprintId];
    },

    getActiveProject: state => state.activeProject,

    getActiveTeam: state => state.activeTeam,

    getActiveSprint: state => state.activeSprint,

    teamView: state => state.teamView,

    sprintView: state => state.sprintView,

    getUser: state => state.user
  },

  mutations: {
    /* INITIALISE */
    initialiseCriteria(state, criteria) {
      state.criteria = criteria;
    },

    /* ADDING */
    addProject(state, { project, id }) {
      Vue.set(state.projects, id, project);
    },

    addTeamToProject({ projects }, { projectId, teamId, team }) {
      if (!projects[projectId].teams) {
        Vue.set(projects[projectId], "teams", {});
      }
      Vue.set(projects[projectId].teams, teamId, team);
    },

    addSprintToProject({ projects }, { projectId, sprintId, sprint }) {
      if (!projects[projectId].sprints) {
        Vue.set(projects[projectId], "sprints", {});
      }
      Vue.set(projects[projectId].sprints, sprintId, sprint);
    },

    /* UPDATING */
    updateProjects(state, projects) {
      state.projects = projects;
    },

    updateProject(state, project) {
      Vue.set(state.projects, project.id, _.omit(project, "id"));
    },

    updateTeam(state, { projectId, team }) {
      Vue.set(state.projects[projectId].teams, team.id, _.omit(team, "id"));
    },

    updateSprints(state, { projectId, sprints }) {
      Vue.set(state.projects[projectId], "sprints", sprints);
    },

    updateSprint(state, { projectId, sprintId, sprint }) {
      Vue.set(state.projects[projectId].sprints, sprintId, sprint);
    },

    updateTeamsSprintData(state, { projectId, ...sprint }) {
      Vue.set(
        state.projects[projectId].sprints[sprint.sprintId].teams,
        sprint.teams
      );
    },

    updateCurrentSprint(state, { projectId, sprintId, sprint }) {
      Vue.set(state.projects[projectId].sprints[sprintId], sprint);
    },

    updateUser(state, user) {
      state.user = user;
    },

    /**
     * Sets the project that is currently active. A project is considered 'active' when the user
     * interacts with it by opening its edit or delete modal.
     * @param {Object} state the store state
     * @param {Object} project the project to set as the active project
     */
    setActiveProject(state, project) {
      Vue.set(state, "activeProject", project);
    },

    /**
     * Sets the team that is currently active. A team is considered 'active' when the user
     * interacts with it by opening its edit or delete modal.
     * @param {Object} state the store state
     * @param {Object} team the team to set as the active team
     */
    setActiveTeam(state, team) {
      Vue.set(state, "activeTeam", team);
    },

    /**
     * Sets the sprint that is currently active. A sprint is considered 'active' when the user
     * interacts with it by opening its edit or delete modal.
     * @param {*} state the store state
     * @param {*} sprint the sprint to set as the active sprint
     */
    setActiveSprint(state, sprint) {
      Vue.set(state, "activeSprint", sprint);
    },

    /* DELETING */
    deleteProject(state, projectId) {
      Vue.delete(state.projects, projectId);
    },

    deleteTeamFromProject(state, { projectId, teamId }) {
      Vue.delete(state.projects[projectId].teams, teamId);
    },

    deleteSprintFromProject(state, { projectId, sprintId }) {
      Vue.delete(state.projects[projectId].sprints, sprintId);
    },

    deleteTeamFromSprint(state, { projectId, sprintId, teamId }) {
      Vue.delete(state.projects[projectId].sprints[sprintId].teams, teamId);
    },

    resetStore(state) {
      const defaultState = {
        projects: {},
        criteria: {},
        activeSprint: {},
        activeProject: {},
        activeTeam: {}
      };
      Object.assign(state, defaultState);
    },

    toggleTeamView(state) {
      if (!state.teamView) {
        state.teamView = !state.teamView;
        state.sprintView = false;
      }
    },

    toggleSprintView(state) {
      if (!state.sprintView) {
        state.sprintView = !state.sprintView;
        state.teamView = false;
      }
    }
  },

  actions: {
    async getProjects(context, userId) {
      try {
        const results = await FirebaseService.query(`projects`, {
          field: "owner",
          value: userId
        });

        context.commit("updateProjects", results || {});
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async loadProject({ commit }, { projectId }) {
      try {
        const project = await FirebaseService.get(`projects/${projectId}`);
        project.id = projectId;
        console.log({ project, projectId });
        commit("updateProject", project);
      } catch (error) {
        throw new Error("Failed to load project.");
      }
    },

    async addProject({ commit }, project) {
      const response = await FirebaseService.create("projects", project);
      if (response) {
        commit("addProject", { project, id: response });
      } else {
        throw new Error("Failed to add project.");
      }
    },

    async updateProject({ commit }, { keys, ...project }) {
      try {
        await FirebaseService.update(
          `projects/${project.id}`,
          _.pick(project, keys)
        );
        commit("updateProject", project);
      } catch (error) {
        throw new Error("Failed to update project.");
      }
    },

    async deleteProject({ commit }, projectId) {
      try {
        await FirebaseService.remove(`projects/${projectId}`);
        commit("deleteProject", projectId);
      } catch (error) {
        throw new Error("Failed to delete project.");
      }
    },

    async addTeamToProject({ commit }, { projectId, team }) {
      const teamId = await FirebaseService.create(
        `projects/${projectId}/teams`,
        team
      );

      if (teamId) {
        commit("addTeamToProject", { projectId, teamId, team });
      } else {
        throw new Error("Failed to add team.");
      }
    },

    async updateTeam({ commit }, { projectId, ...team }) {
      try {
        await FirebaseService.update(
          `projects/${projectId}/teams/${team.id}`,
          _.pick(team, ["name"])
        );
        commit("updateTeam", { projectId, team });
      } catch (error) {
        throw new Error("Failed to update team.");
      }
    },

    async updateSprint({ commit }, { projectId, sprintId, sprint }) {
      try {
        await FirebaseService.update(
          `projects/${projectId}/sprints/${sprintId}`,
          _.omit(sprint, ["id"])
        );
        commit("updateSprint", { projectId, sprintId, sprint });
      } catch (error) {
        throw new Error("Failed to update sprint");
      }
    },

    async updateSprints({ commit }, { projectId, sprints }) {
      try {
        await FirebaseService.update(`projects/${projectId}/sprints`, sprints);
        commit("updateSprints", { projectId, sprints });
      } catch (error) {
        throw new Error("Failed to add team to sprints.");
      }
    },

    async addSprintToProject({ commit }, { projectId, sprint }) {
      try {
        const sprintId = await FirebaseService.create(
          `projects/${projectId}/sprints`,
          sprint
        );
        commit("addSprintToProject", { projectId, sprintId, sprint });
      } catch (error) {
        throw new Error("Failed to add sprint.");
      }
    },

    async deleteTeamFromProject({ commit }, { projectId, teamId, sprints }) {
      try {
        await FirebaseService.remove(`projects/${projectId}/teams/${teamId}`);
        commit("deleteTeamFromProject", { projectId, teamId });
      } catch (error) {
        throw new Error("Failed to delete team.");
      }
    },

    async deleteSprintFromProject({ commit }, { projectId, sprintId }) {
      try {
        await FirebaseService.remove(
          `projects/${projectId}/sprints/${sprintId}`
        );
        commit("deleteSprintFromProject", { projectId, sprintId });
      } catch (error) {
        throw new Error("Failed to delete sprint.");
      }
    },

    async updateTeamsSprintData({ commit }, { projectId, sprintId, sprint }) {
      try {
        await FirebaseService.update(
          `projects/${projectId}/sprints/${sprintId}`,
          sprint
        );
      } catch (error) {
        throw new Error("Failed to save health check data.");
      }
    },

    async addUser({ commit }, { uid, displayName, email }) {
      try {
        await FirebaseService.create(`users/${uid}`, {
          displayName,
          email
        });
      } catch (error) {
        throw new Error("Failed to add new user.");
      }
    }
  },

  plugins: [new VuexPersist().plugin]
});
