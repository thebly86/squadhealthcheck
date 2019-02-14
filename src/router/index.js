import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/views/Dashboard";
import ManageProject from "@/views/ManageProject";
import ManageTeams from "@/views/ManageTeams";
import ManageSprints from "@/views/ManageSprints";
import ManageTeamHealth from "@/views/ManageTeamHealth";

Vue.use(Router);

export default new Router({
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
    }
  ]
});
