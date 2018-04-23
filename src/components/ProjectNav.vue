<template>
  <nav class="nav">
    <ul class="tabs">
      <li class="tab tab--active">
          <router-link to="/"><a class="tab__link">MY PROJECTS</a></router-link>
      </li>
      <li 
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab">
        <router-link to="/project/tab.id"><a class="tab__link">{{tab.name}}</a></router-link>
      </li>
    </ul>
  </nav>
</template>


<script>
  export default {
    name: 'ProjectNav',

    props: {
      tabs: {
        type: Array,
        required: true
      }
    },

    methods: {
      closeTab(tab) {
        let tabToClose = _.find(this.tabs, tab.id);
      }
    }
  }

</script>


<style>
  .tabs {
    padding: 0;
    margin: 2px 0;
    color: var(--grey);
    font-size: 0.85rem;
    font-weight: bold;
    max-height: 42px;
  }

  .tab {
    list-style: none;
    display: inline-block;
    background-color: var(--lightest-grey);
    margin: 0;
    width: 180px;
    padding: 10px 0px;
    text-align: center;
    cursor: pointer;
  }

  .tab__link {
    padding: 10px 20px;
  }

  .tab__link:hover {
    text-decoration: underline;
  }

  .tab--active {
    background-color: var(--light);
    color: var(--grey);
  }
</style>