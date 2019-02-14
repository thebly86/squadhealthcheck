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
      required: true
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
      <i class="icon icon--options fa fa-cog" />
      <span>{{ title }}</span>
      <i class="icon icon--arrow_down fa fa-angle-down" />
    </div>
    <div
      v-show="showItems"
      :class="['dropdown__items', { 'dropdown__items--active': showItems }]"
    >
      <slot />
    </div>
  </div>
</template>

<style>
.dropdown {
  min-width: 150px;
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
}

.icon--options {
  font-size: 0.9em;
  margin-top: 5px;
}

.icon--arrow_down {
  font-size: 0.8em;
}
</style>
