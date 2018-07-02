<script>
  export default {
    name: 'ProjectNav',
    // Template dependencies
    filters: {
      uppercase: function (val) {
        return val.toUpperCase();
      }
    },
    
    // Interface
    props: {
      tabs: {
        type: Array,
        required: true
      }
    }
  }

</script>

<template>
  <nav class="nav">
    <ul class="tabs">
      <li class="tab">
          <router-link 
            to="/"
            class="tab__link">
            MY PROJECTS
          </router-link>
      </li>
      <li 
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab">
        <router-link 
          :to="{ name: 'ManageTeamHealth', params: { id: tab.id }}"
          class="tab__link">
          {{ tab.name | uppercase }}
        </router-link>
        <div 
          @click="$emit('closeTab', tab);"
          class="tab__icon hidden">
          <i class="fa fa-times"/>
        </div>
      </li>
    </ul>
  </nav>
</template>

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
    position: relative;
    list-style: none;
    display: inline-block;
    background-color: var(--lightest-grey);
    margin: 0;
    width: 180px;
    text-align: center;
    cursor: pointer;
    margin-right: 2px;
  }

  .tab:first-of-type, .tab:last-of-type {
    margin-right: 0;
  }

  .tab:hover .hidden {
    display: inline-block;
  }

  .tab__link {
    display: inline-block;
    width: inherit;
    padding: 10px 0;
  }

  .tab__link:hover {
    text-decoration: underline;
  }

  .tab__link--active {
    background-color: var(--light);
    color: var(--grey);
  }

  .tab__icon {
    position: absolute;
    right: 0;
    top: -3px;
    margin: 3px;
    color: var(--light-grey);
  }

  .tab__icon:hover {
    color: var(--grey);
  }

  .hidden {
    display: none; 
  }
</style>