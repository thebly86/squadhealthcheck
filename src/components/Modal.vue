<template>
  <div
    id=":id"
    :class="{'visible': show}"
    class="modal">
    <div class="modal-content">
      <header class="modal__header">
        <h3 class="modal__title">{{name}}</h3>
        <span 
          @click="closeModal"
          class="btn-close">
          &times;
        </span>
      </header>
      <main class="modal__main">
        <slot/>
      </main>
      <footer class="modal__footer">
        <div class="modal__buttons">
          <button 
            @click.native="$emit('save')"
            class="btn-primary">SAVE</button>
          <button 
            @click="$emit('closeModal')"
            class="btn-secondary">CANCEL</button>
        </div>
      </footer>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'Modal',

    props: {
      id: String,
      name: String,
      showModal: false
    },

    data: () => ({
      show: this.showModal
    }),

    methods: {
      closeModal() {
        this.show = false;
      }
    }

    
  }
</script>


<style>
  .modal {
  display: none;
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
  color: var(--light);
  float: right;
  font-size: 28px;
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
  color: var(--light);
  background-color: var(--health-green);
}

.modal__main {
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