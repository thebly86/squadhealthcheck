<script>
export default {
  name: "DropdownMenuButton",

  // Interface
  props: {
    text: {
      type: String,
      required: true
    },

    action: {
      type: Function,
      required: false,
      default: () => {}
    }
  }
};
</script>

<template>
  <button @click="action()">{{ text }}</button>
</template>

<style>
.dropdown__button {
  display: block;
  width: 140px;
  text-align: right;
}

.dropdown__button:hover {
  text-decoration: underline;
}

.dropdown__button--edit {
  background-color: var(--light-grey);
}

.dropdown__button--delete {
  background-color: var(--danger);
  color: var(--light);
}
</style>
