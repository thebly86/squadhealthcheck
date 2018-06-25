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
    addProject(state, project) {
      state.available_projects[project.id] = project
      state.projects[project.id] = project
      state.projects[project.id].sprints = []
    },
    removeProject(state, project) {
      _.unset(state.available_projects, `${project.id}`);
      _.unset(state.projects, `${project.id}`);
    },
    addTeamToProject(state, {project, team}) {
      state.projects[project.id].teams[team.id] = team;
    },
    addTeamToSprint(state, {project, sprintId, team}) {
      state.projects[project.id].sprints.forEach(sprint => {
        if(sprint.id === sprintId) {
          sprint.teams.push(team)
        }
      });
    },
    removeTeamFromProject(state, { project, teamId }) {
      state.projects[project.id].teams =
        _.remove(state.projects[project.id].teams, team => team.id === teamId);
    },
    addSprint(state, {project, sprint}) {
      state.projects[project.id].sprints.push(sprint)
    },
    removeSprintFromProject(state, {project, sprintId}) {
      state.projects[project.id].sprints =
        _.remove(state.projects[project.id].sprints, sprint => sprint.id === sprintId);
    },
    initialiseProjects(state) {
      FirebaseService.getProjects()
        .then((result) => state.projects = result)
    },
    initialiseAvailableProjects(state) {
      FirebaseService.getAvailableProjects()
        .then((result) => state.availableProjects = result)
    }
    // ,
    // updateTeamCriteriaValue(state, { teamId, projectId, key, value } = {}) {
    //   _.forEach(state.projects, (project) => {
    //     if(project.id === projectId) {
    //       _.forEach(project.sprints[project.sprints.length - 1].teams, (team) => {
    //         if(team.id === teamId) {
    //           team.criteria_values[key] = value
    //         }
    //       })
    //     }
    //   })
    // }
  },
  getters: {
    getProject: (state) => (projectId) => {
        return state.projects[projectId]
    }
  }
})