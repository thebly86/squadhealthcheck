import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import FirebaseService from "@/api/firebase-service.js";

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
    teamView: false
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

    sprintView: state => state.sprintView
  },

  mutations: {
    /* INITIALISE */
    initialiseProjects(state, projects) {
      state.projects = projects;
    },

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
    async loadProjects(context) {
      await FirebaseService.getProjects().then(result => {
        context.commit("initialiseProjects", result || {});
      });
    },

    loadProject(context, { projectId }) {
      return FirebaseService.getProject(projectId).then(project => {
        project.id = projectId;
        context.commit("updateProject", project);
      });
    },

    async addProject(context, project) {
      await FirebaseService.addProject(project).then(id => {
        context.commit("addProject", { project, id });
      });
    },

    async updateProject(context, { keys, ...project }) {
      await FirebaseService.updateProject(project, keys).then(() =>
        context.commit("updateProject", project)
      );
    },

    async deleteProject(context, projectId) {
      await FirebaseService.deleteProject(projectId).then(() =>
        context.commit("deleteProject", projectId)
      );
    },

    async addTeamToProject(context, { projectId, team }) {
      return FirebaseService.addTeamToProject(projectId, team).then(teamId => {
        context.commit("addTeamToProject", { projectId, teamId, team });
        return teamId;
      });
    },

    updateSprint(context, { projectId, sprintId, sprint }) {
      return FirebaseService.updateSprint(projectId, sprintId, sprint).then(
        () => {
          context.commit("updateSprint", { projectId, sprintId, sprint });
        }
      );
    },

    updateSprints(context, { projectId, sprints }) {
      return FirebaseService.updateSprints(projectId, sprints).then(() => {
        context.commit("updateSprints", { projectId, sprints });
      });
    },

    async updateTeam(context, { keys, projectId, ...team }) {
      await FirebaseService.updateTeam(projectId, team, keys).then(() =>
        context.commit("updateTeam", { projectId, team })
      );
    },

    async addSprintToProject(context, { projectId, sprint }) {
      FirebaseService.addSprintToProject(projectId, sprint).then(sprintId => {
        context.commit("addSprintToProject", { projectId, sprintId, sprint });
      });
    },

    async deleteTeamFromProject(context, { projectId, teamId, sprints }) {
      await FirebaseService.deleteTeamFromProject(projectId, teamId).then(
        () => {
          context.commit("deleteTeamFromProject", { projectId, teamId });
        }
      );
    },

    deleteTeamFromSprint(context, { projectId, sprintId, teamId }) {
      return FirebaseService.deleteTeamFromSprint(
        projectId,
        sprintId,
        teamId
      ).then(() => {
        context.commit("deleteTeamFromSprint", { projectId, sprintId, teamId });
      });
    },

    deleteSprintFromProject(context, { projectId, sprintId }) {
      FirebaseService.deleteSprintFromProject(projectId, sprintId).then(() =>
        context.commit("deleteSprintFromProject", { projectId, sprintId })
      );
    },

    updateTeamsSprintData(context, { projectId, sprintId, sprint }) {
      FirebaseService.updateTeamsSprintData(projectId, sprintId, sprint);
    }
  },

  plugins: [new VuexPersist().plugin]
});
