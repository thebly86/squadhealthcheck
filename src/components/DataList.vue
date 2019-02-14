<script>
import DataListItem from "./DataListItem";

export default {
  name: "DataList",

  // Template dependencies
  components: {
    DataListItem
  },

  // Interface
  props: {
    dataList: {
      required: true
    },

    fields: {
      type: Array,
      required: true
    },

    actions: {
      type: Array,
      required: false
    },

    showIcon: {
      type: Boolean,
      required: false,
      default: false
    },

    showKeys: {
      type: Boolean,
      required: false,
      default: false
    },

    color: {
      type: String,
      required: false,
      default: "#CCCCCC"
    }
  },

  // Non-Reactive properties
  methods: {
    setCssProperty(property, color) {
      const tinycolor = require("tinycolor2");
      const fadedColor = tinycolor(this.color);
      fadedColor.setAlpha(0.5);
      return { [property]: fadedColor };
    }
  }
};
</script>

<template>
  <!-- Headings -->
  <section>
    <div
      v-if="showKeys"
      class="keys"
      :style="setCssProperty('background', this.color)"
    >
      <span v-for="{ label } in fields" :key="label" class="key">
        {{ label }}
      </span>
    </div>
    <ul class="data-list">
      <data-list-item
        v-for="(item, index) in dataList"
        :key="index"
        :item="item"
        :fields="fields"
        :itemId="index"
        :actions="actions"
        :showIcon="showIcon"
        :color="color"
        @click.native="$emit('onClick', index)"
        :id="`data-list-item-${index}`"
      >
      </data-list-item>
    </ul>
  </section>
</template>

<style scoped>
.keys {
  padding: 10px 20px;
  display: flex;
  background-color: var(--grey);
  color: #fff;
}

.key {
  min-width: 230px;
  font-weight: bold;
}
</style>
