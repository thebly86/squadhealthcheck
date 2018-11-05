import Vue from 'vue'
import Router from 'vue-router'
import ManageProjects from '@/views/ManageProjects'
import ManageProject from '@/views/ManageProject'
import ManageSprints from '@/components/ManageSprints'
import ManageTeams from '@/views/ManageTeams'
import ManageTeamHealth from '@/components/ManageTeamHealth'

Vue.use(Router)

export default new Router({
  linkActiveClass: '',
  linkExactActiveClass: 'tab__link--active',
  routes: [
    {
      path: '/',
      name: 'Projects',
      component: ManageProjects
    },
    {
      path: '/project/:id',
      name: 'ManageProject',
      components: {
        default: ManageProject,
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