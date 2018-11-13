import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import FirebaseService from '../utils/firebase/firebase-service.js';

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    projects: {},
    criteria: {},
    currentSprints: {},
    currentProject: {},
  },

  getters: {
    getProject: (state) => (projectId) => {
        return state.projects[projectId]
    },
    
    getCriteria: (state) => {
      return state.criteria;
    },

    // Sprint of currently open project
    getCurrentSprint: (state) => (projectId) => {
      return state.currentSprints[projectId];
    },

    getSelectedProject: (state) => state.currentProject
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

    addTeamToProject({ projects }, { projectId, team }) {
      if(!projects[projectId].teams) {
        Vue.set(projects[projectId], 'teams', {});
      }
      Vue.set(projects[projectId].teams, [team.id], team)
    },

    /* UPDATING */
    updateProject(state, project) {
      Vue.set(state.projects, project.id, _.omit(project, 'id'));
    },

    updateSelectedProject(state, project) {
      Vue.set(state, 'currentProject' ,project);
    },


    /* DELETING */
    deleteProject(state, projectId) {
      Vue.delete(state.projects, projectId);
    },

    /* ADD/EDIT */

    addSprint({ projects }, { projectId, sprint }) {
      if(!projects[projectId].sprints) {
        Vue.set(projects[projectId], "sprints", {})
      }
      Vue.set(projects[projectId].sprints, sprint.id, sprint)
    },

    addTeamToSprint({ projects }, { projectId, sprintId, team }) {
      if(!projects[projectId].sprints[sprintId].teams) {
        Vue.set(projects[projectId].sprints[sprintId], 'teams', {})
      }
      Vue.set(projects[projectId].sprints[sprintId].teams, team.id, team)
    },

    updateCurrentSprint(state, { projectId, ...sprint}) {
      Vue.set(state.currentSprints, projectId, sprint);
    },

    updateCurrentSprintValues(state, { projectId, ...sprint}) {
      Vue.set(state.currentSprints[projectId].criteria_values, sprint);
    },

    /* DELETE */
    removeTeamFromProject({ projects }, { teamId, projectId }) {
      Vue.delete(projects[projectId].teams, teamId)
    },
    
    removeTeamFromSprint({ projects }, { projectId, sprintId, teamId }) {
      Vue.delete(projects[projectId].sprints[sprintId].teams, teamId)
    },

    removeSprintFromProject({ projects }, { projectId, sprintId }) {
      Vue.delete(projects[projectId].sprints, [sprintId])
    },
  },

  actions: {
    async loadProjects(context) {
      await FirebaseService.getProjects().then((result) => {
        context.commit('initialiseProjects', result || {});
      });
    },

    async loadCriteria(context) {
      context.commit('initialiseCriteria', await FirebaseService.getCriteria());
    },

    async addTeam(context, { projectId, team }) {
      await FirebaseService.addTeamToProject(projectId, team)
      context.commit('addTeamToProject', { projectId, team });
    },

    async addProject(context, project) {
      await FirebaseService.addProject(project).then((id) => {
        context.commit('addProject', {project, id}); 
      });
    },

    async updateProject(context, { keys, ...project }) {
      await FirebaseService.updateProject(project, keys).then(() =>
        context.commit('updateProject', project));
    },

    async deleteProject(context, projectId) {
      await FirebaseService.deleteProject(projectId).then(() => 
        context.commit('deleteProject', projectId));
    }
  },

  plugins: [ new VuexPersist().plugin ]
})