<template>
  <section 
    v-show="isSelected"
    :id="hash"
    class="tab-content p-3 ml-1">
    <slot/>
  </section>
</template>


<script>
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
        '#' + this.name.toLowerCase().replace(/ /g, '-');
    }
  }
}
</script>


<style>
  .tab-content {
    background-color: #FFF;
  }
</style>
