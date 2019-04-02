<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
  name: "Modal",

  // Composition
  mixins: [clickaway],

  // Interface
  props: {
    showModal: {
      type: Boolean
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
      this.$emit("close");
    }
  }
};
</script>

<template>
  <div class="modal">
    <div v-on-clickaway="close" class="modal-content">
      <header class="modal__header">
        <h3 class="modal__title">{{ title }}</h3>
        <span @click="close" class="btn--close">
          &times;
        </span>
        <slot name="header"></slot>
      </header>
      <section class="modal__body">
        <slot name="body"></slot>
      </section>
      <footer class="modal__footer">
        <div class="modal__buttons">
          <slot v-if="!actions" name="buttons"> </slot>
          <button @click="close" class="btn--secondary btn--cancel">
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
  background-color: rgb(0, 0, 0, 0.4);
  z-index: 20;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  width: 40%;
}

.btn--close {
  color: var(--darker-grey);
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: auto;
}

.btn--cancel {
  margin-left: 5px;
}

.btn--close:hover,
.btn--close:focus {
  color: var(--dark-grey);
  text-decoration: none;
  cursor: pointer;
}

.modal__header {
  display: flex;
  align-items: center;
  padding: 10px;
  color: var(--health-green);
  border-bottom: 1px solid var(--light-grey);
}

.modal__body {
  padding: 10px;
  margin-bottom: 10px;
}

.modal__footer {
  display: flex;
  padding: 10px;
}

.modal__buttons {
  display: flex;
  margin-left: auto;
}

.modal__title {
  margin: 0;
  display: inline-block;
}

.custom-buttons {
  margin-right: 5px;
}

label {
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
