<template>
  <div class="dropdown">
    <slot 
      @mouseovers="show = true"
      @mouseleave="show = false"
      name="dropdown-label"/>
    <ul 
      v-if="show"
      class="dropdown-list">
      <li 
        v-for="(item, i) in items"
        :key="i"
        @click="item.action">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>


<script>
  export default {
    name: 'DropdownMenu',

    data: () => ({
      show: true
    }),

    props: {
      items: {
        type: Array
      }
    },

    created() {
      console.log('test');
    },

    methods: {
      test() {
        console.log('test')
      }
    }
  }
</script>


<style>
.dropdown-list {
  display: none;
}
</style>