<template>
  <main class="grid">
    <table
      v-if="sprints"
      class="grid__item sprints-table">
      <colgroup>
        <col class="sprints-table__sprint">
        <col class="sprints-table__dates" span="2">
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
      v-if="sprints"
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
      newSprint: {},
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
          },
          {
            name: 'Cancel',
            class: 'btn-secondary',
            action: () => this.showModal = false
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
        console.log('Save sprint');
      }
    }
  }
</script>


<style>

</style>