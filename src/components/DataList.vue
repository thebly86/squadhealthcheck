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
    }
  }

  // Local state
};
</script>

<template>
  <!-- Headings -->
  <div>
    <div v-if="showKeys" class="keys">
      <span v-for="{ label } in fields" :key="label" class="key">{{ label }}</span>
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
        :color="item.color"
        @click.native="$emit('onClick', index)"
        :id="`data-list-item-${index}`"
      ></data-list-item>
    </ul>
  </div>
</template>

<style scoped>
.keys {
  padding: 10px 20px;
  display: flex;
  background-color: var(--light);
  color: var(--dark-grey);
  border-left: 1px solid var(--light-grey);
  border-right: 1px solid var(--light-grey);
}

.key {
  min-width: 230px;
  font-weight: bold;
}
</style>
