<template>
  <section 
    v-show="isSelected"
    :id="hash"
    class="tab-content p-3 ml-1">
    <slot/>
  </section>
</template>


<script>
import { slugify } from '../utils/utils';

export default {
  name: 'Tab',
  props: {
    id: { default: null },
    name: String,
  },
  data: () => ({
    isSelected: false,
    isVisible: true
  }),
  computed: {
    hash() {
      return this.id ? 
        '#' + this.id :
        '#' + slugify(this.name);
    }
  }
}
</script>


<style>
  .tab-content {
    background-color: #FFF;
  }
</style>
