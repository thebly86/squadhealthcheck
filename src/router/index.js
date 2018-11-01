import Vue from 'vue'
import Router from 'vue-router'
import Projects from '@/views/Projects'
import ManageSprints from '@/components/ManageSprints'
import ManageTeams from '@/components/ManageTeams'
import ManageTeamHealth from '@/components/ManageTeamHealth'
import ProjectView from '@/components/ProjectView'

Vue.use(Router)

export default new Router({
  linkActiveClass: '',
  linkExactActiveClass: 'tab__link--active',
  routes: [
    {
      path: '/',
      name: 'Projects',
      component: Projects
    },
    {
      path: '/project/:id',
      name: 'ProjectView',
      components: {
        default: ProjectView,
        manageTeams: ManageTeams
      },
      children: [
        {
          path: 'health',
          name: 'ManageTeamHealth',
          component: ManageTeamHealth
        },
        {
          path: 'teams',
          name: 'ManageTeams',
          component: ManageTeams
        },
        {
          path: 'sprints',
          name: 'ManageSprints',
          component: ManageSprints
        }
      ]
    }
  ]
});