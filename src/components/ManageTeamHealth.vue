<template>
  <main class="grid">
    <div class="grid__item u-6/12 action-bar">
        <ul>
          <router-link
            to='teams'>
            <li 
              @click="manageTeams()"
              class="action-bar__item">
              <i class="fa fa-users"/>
             <span>MANAGE TEAMS</span>
            </li>
          </router-link>
        </ul>
      </div>
  </main>
</template>


<script>
  export default {
    name: 'ManageTeamHealth'
  }
</script>


<style>

</style>