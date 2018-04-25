import Vue from 'vue'
import Router from 'vue-router'
import ManageSprints from '@/components/ManageSprints'
import ManageTeams from '@/components/ManageTeams'
import ManageTeamHealth from '@/components/ManageTeamHealth'
import ProjectList from '@/components/ProjectList'
import SquadHealthCheck from '@/components/SquadHealthCheck'

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
      name: 'SquadHealthCheck',
      component: SquadHealthCheck,
      children: [
        {
          path: '/teams',
          name: 'ManageTeams',
          components: {
            default: ManageTeams
          }
        }
      ]
    }
  ]
});