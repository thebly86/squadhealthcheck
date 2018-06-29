<template>
  <header class="grid__item header">
    <div class="grid">
      <div class="grid__item u-8/12">
        <h2 class="project-title">{{ project.name }}</h2>
        <ul class="actions">
          <router-link 
            to="health" 
            tag="li" 
            class="actions__item">
            <i class="fa fa-heartbeat icon--action"/>
            <span>TEAM HEALTH</span>
          </router-link>
          <router-link 
            to="teams" 
            tag="li" 
            class="actions__item">
            <i class="fa fa-user icon--action"/>
            <span>TEAMS</span>
          </router-link>
          <router-link 
            to="sprints" 
            tag="li" 
            class="actions__item">
            <i class="fa fa-bolt icon--action"/>
            <span>SPRINTS</span>
          </router-link>
        </ul>
      </div>

      <div class="grid__item u-4/12">
        <div class="action-bar--project">
          <DropdownMenu title="OPTIONS">
            <DropdownMenuButton
              text="Edit project"
              :class="['dropdown__button', 'dropdown__button--edit']">

            </DropdownMenuButton>
            <DropdownMenuButton
              text="Delete project"
              :class="['dropdown__button', 'dropdown__button--delete']">

            </DropdownMenuButton>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>


<script>
import DropdownMenu from './DropdownMenu';
import DropdownMenuButton from './DropdownMenuButton';

export default {
  name: 'ProjectHeader',

  data: () => ({
    actions: [
      {
        name: 'Edit Project',
        action: this.editProject,
        class: 'btn-secondary'
      },
      {
        name: "Delete Project",
        action: this.deleteProject,
        class: 'btn--danger'
      }
    ]
  }),

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  components: {
    DropdownMenu,
    DropdownMenuButton
  },

  methods: {
    editProject() {
      this.$el.dispatchEvent(new Event("editProject"));
    },

    deleteProject() {
      this.$el.dispatchEvent(new Event("deleteProject"));
    }
  }
}
</script>


<style>
  .actions {
    display: inline-block;
    list-style: none;
    color: var(--darker-grey);
    font-weight: 500;
  }

  .actions__item {
    cursor: pointer;
    text-decoration: underline;
  }

  li.actions__item .tab__link--active {
    color: var(--health-green);
  } 

  .actions__item span:hover {
    text-decoration: underline;
  }

  .action-bar--project {
    float: right;
  }

  .tab__link--active span {
    color: var(--health-green);
    text-decoration: underline;
  }

  .tab__link--active .icon--action {
    color: var(--health-green);
  }

  .project-title {
    display: inline-block;
    margin-right: 40px;
  }
</style>