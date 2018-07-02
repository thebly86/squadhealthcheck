<script>
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    name: 'Modal',

    // Composition
    mixins: [ clickaway ],

    // Interface
    props: {
      showModal: {
        type: Boolean,
      },
      title: {
        type: String,
        required: true 
      },
      actions: {
        type: Array,
        required: false
      }
    },

    // Non-reactive properties
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
</script>

<template>
  <div class="modal">
    <div 
      v-on-clickaway="close"
      class="modal-content">
      <header class="modal__header">
        <h3 class="modal__title">{{ title }}</h3>
        <span 
          @click="close"
          class="btn-close">
          &times;
        </span>
        <slot name="header"></slot>
      </header>
      <main class="modal__body">
        <slot name="body"></slot>
      </main>
      <footer class="modal__footer">
        <div class="modal__buttons">
          <button
            v-if="actions"
            v-for="(action, i) in actions"
            :key="i"
            :class="action.class"
            @click="action.action">
            {{ action.name }}
          </button>
          <button
            @click="close"
            class="btn-secondary">
            Cancel
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  width: 40%;
}

.btn-close {
  color: var(--darker-grey);
  float: right;
  font-size: 24px;
  font-weight: bold;
  margin: 3px 10px;
}

.btn-close:hover,
.btn-close:focus {
  color: var(--dark-grey);
  text-decoration: none;
  cursor: pointer;
}

.visible {
  display: block;
}

.modal__header {
  color: var(--health-green);
  border-bottom: 1px solid var(--light-grey);
}

.modal__body {
  padding: 20px 10px;
}

.modal__footer {
  padding: 20px 10px;
  height: 30px;
}

.modal__buttons {
  float: right;
}

.modal__title {
  margin: 10px;
}

</style>