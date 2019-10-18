import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/views/Dashboard";
import ManageConfig from "@/views/ManageConfig";
import ManageProject from "@/views/ManageProject";
import ManageTeams from "@/views/ManageTeams";
import ManageSprints from "@/views/ManageSprints";
import ManageTeamHealth from "@/views/ManageTeamHealth/ManageTeamHealth";

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: "",
  linkExactActiveClass: "tab__link--active",
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: "/project/:id",
      name: "ManageProject",
      components: {
        default: ManageProject,
        manageTeams: ManageTeams
      },
      children: [
        {
          path: "health",
          name: "ManageTeamHealth",
          component: ManageTeamHealth
        },
        {
          path: "teams",
          name: "ManageTeams",
          component: ManageTeams
        },
        {
          path: "sprints",
          name: "ManageSprints",
          component: ManageSprints
        }
      ]
    },
    {
      path: "firebaseConfig",
      name: "ManageConfig",
      component: ManageConfig
    }
  ]
});
