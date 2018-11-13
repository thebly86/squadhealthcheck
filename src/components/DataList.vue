<script>
  import DataListItem from './DataListItem';

  export default {
    name: 'DataList',

    // Template dependencies
    components: {
      DataListItem
    },

    // Interface
    props: {
      dataList: {
        required: true
      },

      keys: {
        type: Array,
        required: true
      },
      
      actions: {
        type: Array,
        required: false
      }
    },

    // Non-Reactive properties
    methods: {
      
    }
  }
</script>

<template>
  <ul class="data-list">
    <data-list-item
      v-for="(item, index) in dataList"
      :key="index"
      :item="item"
      :keys="keys"
      :itemId="index"
      :actions="actions"
      :showIcon="true"
      @click.native="$emit('callback', index)"
      class="data-list-item"
      :id="'data-list-item-' + index">
    </data-list-item>
  </ul>
</template>

<style scoped>

</style>