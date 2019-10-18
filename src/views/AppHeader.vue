<script>
export default {
  name: "AppHeader"
};
</script>

<template>
  <header class="app-header">
    <router-link :to="{ name: 'Dashboard' }">
      <div class="app-logo">
        <i class="fa fa-heartbeat"/>
      </div>
      <h1>Squad Health Check</h1>
    </router-link>
    <nav class="site-nav">
      <ul>
        <li>
          <router-link :to="{ name: 'Dashboard' }" class="site-nav__link">My Projects</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ManageConfig' }" class="site-nav__link">Firebase Config</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style>
.app-header {
  display: flex;
  align-items: center;
}

.site-nav {
  margin-left: auto;
}

.site-nav {
  margin-left: auto;
}

.site-nav__link,
.site-nav__link:visited {
  color: var(--dark-grey);
  text-decoration: underline;
}

.site-nav__link:hover {
  color: #111;
}
</style>
