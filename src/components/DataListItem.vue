<script>
  export default {
    name: 'DataListItem',

    // Interface
    props: {
      item: {
        type: Object,
        required: true
      },

      keys: {
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

    // Events 
    created() {
     
    },

    // Non-Reactive properties
    methods: {
      
    }
  }
</script>

<template>
  <li>
    <div 
      v-if="item.name"
      class="data-list-item__icon">
      {{ icon }}
    </div>
    <span
      v-for="key in keys"
      :key=key
      class="data-list-item__field">
      {{ item[key] }}
    </span>
    <ul 
      v-if="actions"
      @click.stop
      class="action-list">
      <li 
        v-for="(action, key) in actions"
        :key="key"
        class="action-list__item">
        <button
          @click="action.action(action, item, itemId)"
          :class="action.class"
          class="button">
          <span>{{ action.name }}</span>
          <i></i>
        </button>
      </li>
    </ul>
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

  .data-list-item__icon {
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

  .data-list-item__field {
    font-size: 1.1rem;
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