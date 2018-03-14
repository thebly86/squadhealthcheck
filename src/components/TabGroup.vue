<template>
  <div class="tabs-component">
    <ul class="tab-group mt-4 p-0">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        v-show="tab.isVisible"
        :class="{ selected: tab.isSelected }"
        class="tab-group__tab d-inline-block w-20 p-3 ml-1">
        <a
          v-html="tab.name"
          @click="selectTab(tab.hash, $event)"
          :href="tab.hash"
          class="tabs-component-tab"></a>
      </li>
    </ul>
    <div class="tabs-component-panels">
      <slot/>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'TabGroup',

    data: () => ({
      selectedTabHash: '',
      tabs: []
    }),

    created: function() {
      this.tabs = this.$children;
    },

    mounted: function() {
      window.addEventListener("hashchange", () => this.selectTab(window.location.hash));

      if (this.findTab(window.location.hash)) {
        this.selectTab(window.location.hash);
        return;
      }

      if (this.tabs.length) {
        this.selectTab(this.tabs[0].hash);
      }
    },

    methods: {
      findTab(hash) {
        return this.tabs.find(tab => tab.hash === hash);
      },

      /** 
       * 
       */
      selectTab(selectedTabHash, event) {
        if (event) {
          event.preventDefault();
        }

        const selectedTab = this.findTab(selectedTabHash);

        if (!selectedTab) {
          return;
        }

        this.tabs.forEach(tab => {
          tab.isSelected = (tab.hash === selectedTab.hash);
        });

        this.$emit('changed', { tab: selectedTab });
        this.selectedTabHash = selectedTab.hash;
      },

      setTabVisible(hash, visible) {
        const tab = this.findTab(tab);

        if (!tab) {
          return;
        }

        tab.isVisible = visible;

        if (tab.isSelected) {
          // If tab is selected, select a different one
          tab.isSelected = visible;

          this.tabs.every((tab, index, array) => {
            if (tab.isVisible) {
              tab.isSelected = true;
              return false;
            }
            return true;
          });
        }
      }
    }
  }
</script>


<style>
  .tab-group {
    margin-bottom: 0.2em;
  }

  .tab-group__tab {
    background-color: #F2F2F2;
    list-style: none;
    width: 180px;
    text-align: center;
    cursor: pointer;
    opacity: 0.7;
    font-weight: bold;
  }

  .tab-group__tab:hover {
    background-color: #FFF;
    opacity: 1;
  }

  .selected {
    background-color: #FFFFFF;
    opacity: 1;
  }

  .tabs-component-tab {
    color: #2c3e50;
  }

  .tabs-component-tab:hover {
    text-decoration: none;
    color: #2c3e50;
  }
</style>
