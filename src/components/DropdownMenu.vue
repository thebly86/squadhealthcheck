<script>
import DropdownMenuButton from "./DropdownMenuButton";

import { mixin as clickaway } from "vue-clickaway";

export default {
  name: "DropdownMenu",

  // Composition
  mixins: [clickaway],

  // Interface
  props: {
    title: {
      type: String,
      required: false,
      default: ""
    }
  },

  // Local state
  data: () => ({
    showItems: false
  }),

  // Non-reactive properties
  methods: {
    closeMenu() {
      this.showItems = false;
    }
  }
};
</script>

<template>
  <div v-on-clickaway="closeMenu" class="dropdown">
    <div
      @click="showItems = !showItems"
      :class="{ 'dropdown--active': showItems }"
      class="dropdown__title"
    >
      <slot name="title" />
    </div>
    <div v-show="showItems" :class="['dropdown__items', { 'dropdown__items--active': showItems }]">
      <slot name="items" />
    </div>
  </div>
</template>

<style>
.dropdown {
  text-align: right;
  cursor: pointer;
  color: var(--dark-grey);
}

.dropdown:hover {
  text-decoration: underline;
}

.dropdown--active {
  text-decoration: underline;
}

.dropdown__title {
  margin-right: 10px;
}

.dropdown__items {
  position: absolute;
  margin-top: 5px;
  border: solid 1px var(--darker-grey);
  background-color: var(--light);
}

.icon--options {
  font-size: 0.9em;
  margin-top: 5px;
}

.icon--arrow_down {
  font-size: 0.8em;
}
</style>
