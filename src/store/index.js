import Vue from 'vue'
import Vuex from 'vuex'
import FirebaseService from '../utils/firebase/firebase-service.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    availableProjects: {},
    projects: []
  },
  mutations: {
    addProject(state, payload) {
      // state.available_projects[payload.project.id] = payload.project
      state.projects[payload.project.id] = payload.project
      state.projects[payload.project.id].sprints = []
    },
    removeProject(state, project) {
      _.unset(state.available_projects, `${project.id}`);
      _.unset(state.projects, `${project.id}`);
    },
    addTeamToProject(state, payload) {
      state.projects[payload.project.id].teams[payload.team.id] = payload.team;
    },
    addTeamToSprint(state, payload) {
      state.projects[payload.project.id].sprints.forEach(sprint => {
        if(sprint.id === payload.sprintId) {
          sprint.teams.push(payload.team)
        }
      });
    },
    removeTeamFromProject(state, payload) {
      state.projects[payload.project.id].teams =
        _.remove(state.projects[payload.project.id].teams, team => team.id === payload.teamId);
    },
    addSprint(state, payload) {
      state.projects[payload.project.id].sprints.push(payload.sprint)
    },
    removeSprintFromProject(state, payload) {
      state.projects[payload.project.id].sprints =
        _.remove(state.projects[payload.project.id].sprints, sprint => sprint.id === payload.sprintId);
    },
    initialiseProjects(state) {
      FirebaseService.getProjects()
        .then((result) => state.projects = result)
    }
  },
  getters: {
    getProject: (state) => (projectId) => {
        return state.projects[projectId]
    }
  }
})