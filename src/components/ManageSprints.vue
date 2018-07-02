<template>
  <main class="grid">
    <table
      v-if="project.teams"
      class="grid__item sprints-table">
      <colgroup>
        <col class="sprints-table__sprint">
        <col class="sprints-table__dates" span="2">
        <col class="sprint-table__actions">
      </colgroup>
      <thead>
        <tr>
          <th>Sprint</th>
          <th>Start</th>
          <th>End</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <Sprint
          v-for="(sprint, s) in sprints"
          :key="s"
          :sprint="sprint">
          
        </Sprint>
      </tbody>
    </table>

    <footer
      v-if="project.teams"
      class="grid__item footer">
      <section class="footer__action-bar">
        <button
          @click="showModal = true"
          class="btn-primary action-bar__button">
          ADD SPRINT
        </button>
      </section>
    </footer>

    <Modal
      v-if="showModal"
      title="Add Sprint"
      :actions="actions"
      @close="showModal = false">
      <div slot="body">
        <form
          ref="addSprintForm"
          @submit="save">
          <label for="startDate">Start date</label>
          <input type="date" name="startDate" id="startDate"/>
          <label for="startDate">End date</label>
          <input type="date" name="startDate" id="endDate"/>
        </form>
      </div>
    </Modal>
  </main>
</template>


<script>
  import FirebaseService from '../utils/firebase/firebase-service.js';
  import Modal from './Modal';
  import Sprint from './Sprint';

  export default {
    name: 'ManageSprints',

    components: {
      Sprint,
      Modal
    },

    data: () => ({
      title: "Manage Sprints",
      newSprint: {
        id: -1,
        startDate: "",
        endDate: ""
      },
      showModal: false
    }),

    props: {
      project: {
        type: Object,
        required: true
      },
      sprints: {
        type: Array,
        required: true
      }
    },

    computed: {
      actions: function() {
        return [
          {
            name: 'Save',
            class: 'btn-primary',
            action: this.save
          }
        ]
      }
    },

    created() {
      if (this.$route.params.showModal === true) {
        this.showModal = true;
      }
    },

    methods: {
      save() {
        this.newSprint.id = this.sprints.length;
        this.newSprint.startDate = document.getElementById('startDate').val;
        console.log('Save sprint', this.newSprint);
      }
    }
  }
</script>


<style>
  .sprints-table th {
    padding: 0px 20px 5px 20px;
  }

  .sprints-table td {
    padding: 10px 20px;
  }

  .sprints-table__sprint {
    width: 25%;
  }

  .sprints-table__dates {
    width: 25%;
  }

  .sprints-table__actions {
    width: 50%;
  }
</style>