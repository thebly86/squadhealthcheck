import Vue from 'vue'
import Vuex from 'vuex'
import FirebaseService from '../utils/firebase/firebase-service.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: {}
  },
  mutations: {
    addProject({ projects }, { project }) {
      Vue.set(projects, project.id, project);
    },

    removeProject({ projects }, { project }) {
      Vue.delete(projects, project.id)
    },

    addTeamToProject({ projects }, { projectId, team }) {
      Vue.set(projects[projectId].teams, [team.id], team)
    },

    addTeamToSprint({ projects }, { projectId, sprintId, team }) {
      if(!projects[projectId].sprints[sprintId].teams) {
        Vue.set(projects[projectId].sprints[sprintId], 'teams', {})
      }
      Vue.set(projects[projectId].sprints[sprintId].teams, team.id, team)
    },

    removeTeamFromProject({ projects }, { teamId, projectId }) {
      Vue.delete(projects[projectId].teams, teamId)
    },
    
    removeTeamFromSprint({ projects }, { projectId, sprintId, teamId }) {
      Vue.delete(projects[projectId].sprints[sprintId].teams, teamId)
    },

    addSprint({ projects }, { projectId, sprint}) {
      if(!projects[projectId].sprints) {
        Vue.set(projects[projectId], sprints, {})
      }
      Vue.set(projects[projectId].sprints, sprint.id, sprint)
      
    },

    removeSprintFromProject({ projects }, { projectId, sprintId }) {
      Vue.delete(projects[projectId].sprints, [sprintId])
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