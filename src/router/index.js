import Vue from 'vue'
import Router from 'vue-router'
import ManageSprints from '@/components/ManageSprints'
import ManageTeams from '@/components/ManageTeams'
import ManageTeamHealth from '@/components/ManageTeamHealth'
import ProjectList from '@/components/ProjectList'
import ProjectView from '@/components/ProjectView'

Vue.use(Router)

export default new Router({
  linkActiveClass: '',
  linkExactActiveClass: 'tab__link--active',
  routes: [
    {
      path: '/',
      name: 'ProjectList',
      component: ProjectList
    },
    {
      path: '/project/:id',
      name: 'ProjectView',
      component: ProjectView,
      children: [
        {
          path: 'health',
          name: 'ManageTeamHealth',
          linkExactActiveClass: 'project__link--active',
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