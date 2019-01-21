<script>
  import dayjs from 'dayjs';

  export default {
    name: 'DataListItem',

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
        type: String,
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
    data: () => ({

    }),

    computed: {
      icon: function() {
        if (this.item.name.length < 2) {
          return this.item.name;
        }

        const parts = this.item.name.split(" ", 2);
        if (parts.length < 2) {
          return this.item.name.substring(0, 2).toUpperCase();
        }
        else {
          return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
        }
      }
    },

    // Non-Reactive properties
    methods: {
      iconColor(color) {
        return { background: color };
      },

      isDate(field) {
        const regex = RegExp(/^\d{4}-\d{2}-\d{2}$/);
        return regex.test(field);
      },

      formatDate(date) {
        return dayjs(date).format('DD MMM YYYY');
      },

      setCssProperty(property, color) {
        const tinycolor = require('tinycolor2');

        if (color) {
          return { [property]: color };
        }
        else {
          return { [property]: tinycolor(this.color).setAlpha(0.5) };
        }
      },
    }
  }
</script>

<template>
  <li class="data-list-item">
    <div class="data-list-view">
      <div
        v-if="item.name"
        class="data-list-view__icon"
        :style="setCssProperty('background', item.color)">
        {{ icon }}
      </div>
      <div class="field-list">
        <div
          v-for="field in fields"
          :key="field.field"
          class="field-list__item">
          <span v-if="field.visible && !isDate(item[field.field])">
            {{ item[field.field] || '-' }}
          </span>
          <span v-if="field.visible && isDate(item[field.field])">
            {{ formatDate(item[field.field]) }}
          </span>
        </div>
      </div>
      <ul
        v-if="actions"
        @click.stop
        class="action-list">
        <li
          v-for="(action, index) in actions"
          :key="index"
          class="action-list__item">
          <button
            @click="action.action(action, item, itemId)"
            :class="action.class"
            class="button"
            :id="`button-${action.type}${itemId}`">
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
    border-bottom: 1px solid var(--light-grey);
    z-index: -1;
  }

  .data-list-item:hover .action-list {
    opacity: 1;
  }

  .data-list-item:first-of-type {
    border-top: 1px solid var(--light-grey);
  }

  .data-list-item:last-of-type {
    border-bottom: none;
  }

  .data-list-item:hover {
    cursor: pointer;
  }

  .data-list-view {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .data-list-view__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      margin-right: 20px;
      text-align: center;
      color: var(--light);
      background: var(--grey);
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 45px;
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