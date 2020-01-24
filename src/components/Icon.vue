<script>
export default {
  name: "Icon",

  // Interface
  props: {
    label: {
      type: String,
      required: true,
      default: ""
    },

    iconStyle: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  // Local state
  data: () => ({
    style: {}
  }),

  computed: {
    icon: function() {
      if (this.label.length < 2) {
        return this.label;
      }

      const parts = this.label.split(" ", 2);
      if (parts.length < 2) {
        return this.label.substring(0, 2).toUpperCase();
      } else {
        return (
          parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
        );
      }
    }
  }
};
</script>
<template>
  <div class="icon" :style="iconStyle">{{ icon }}</div>
</template>
<style scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  margin-right: 10px;
  text-align: center;
  color: var(--light);
  background: var(--grey);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 45px;
}
</style>