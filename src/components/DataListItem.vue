<script>
import dayjs from "dayjs";
import Icon from "./Icon";

export default {
  name: "DataListItem",

  // Template dependencies
  components: {
    Icon
  },

  // Interface
  props: {
    item: {
      type: Object,
      required: true
    },

    fields: {
      type: Array,
      required: true
    },

    itemId: {
      type: [String, Number],
      required: true
    },

    actions: {
      type: Array,
      required: false
    },

    showIcon: {
      type: Boolean,
      required: false
    },

    color: {
      type: String,
      required: false
    }
  },

  // Local state
  data: () => ({}),

  computed: {
    iconStyle: function() {
      return {
        background: this.color
      };
    }
  },

  // Non-Reactive properties
  methods: {
    isDate(field) {
      const regex = RegExp(/^\d{4}-\d{2}-\d{2}$/);
      return regex.test(field);
    },

    formatDate(date) {
      return dayjs(date).format("DD MMM YYYY");
    }
  }
};
</script>

<template>
  <li class="data-list-item">
    <div class="data-list-view">
      <Icon v-if="showIcon" :label="item.name" :iconStyle="iconStyle" />
      <div class="field-list">
        <div v-for="field in fields" :key="field.field" class="field-list__item">
          <span v-if="field.visible && !isDate(item[field.field])">{{ item[field.field] || "-" }}</span>
          <span
            v-if="field.visible && isDate(item[field.field])"
          >{{ formatDate(item[field.field]) }}</span>
        </div>
      </div>
      <ul v-if="actions" @click.stop class="action-list">
        <li v-for="(action, index) in actions" :key="index" class="action-list__item">
          <button
            @click="action.action(action, item, itemId)"
            :class="action.class"
            class="button"
            :id="`button-${action.type}${itemId}`"
          >
            <span>{{ action.name }}</span>
            <i></i>
          </button>
        </li>
      </ul>
    </div>
  </li>
</template>

<style scoped>
.data-list-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid var(--light-grey);
  z-index: -1;
}

.data-list-item:hover .action-list {
  opacity: 1;
}

.data-list-item:first-of-type {
  border-top: 1px solid var(--light-grey);
}

.data-list-item:nth-of-type(even) {
  border-top: none;
  border-bottom: none;
}

.data-list-item:last-of-type {
  /* border-bottom: none; */
  border-bottom: 1px solid var(--light-grey);
}

.data-list-item:hover {
  cursor: pointer;
}

.data-list-view {
  display: flex;
  align-items: center;
  width: 100%;
}

.field-list {
  display: flex;
  font-size: 1.1rem;
}

.field-list__item {
  min-width: 230px;
}

.action-list {
  display: flex;
  margin-left: auto;
  opacity: 0;
  transition: 0.3s opacity ease-in-out;
  z-index: 5;
}

.action-list__item {
  margin-right: 10px;
  font-weight: lighter;
}

.action-list__item:last-of-type {
  margin-right: 0;
}
</style>
