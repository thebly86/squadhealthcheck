<script>
import * as firebase from "firebase";

import DropdownMenu from "@/components/DropdownMenu";
import DropdownMenuButton from "@/components/DropdownMenuButton";

export default {
  name: "AppHeader",

  // Template dependencies
  components: {
    DropdownMenu,
    DropdownMenuButton
  },

  props: {
    user: {
      type: Object,
      required: false,
      default: {}
    },
    signedIn: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  // Non-reactive properties
  methods: {
    signOut() {
      firebase.auth().signOut();
    }
  }
};
</script>

<template>
  <header class="app-header">
    <router-link :to="{ name: 'Dashboard' }">
      <div class="site-logo app-header__logo">
        <i class="fa fa-heartbeat" />
        <h1>Squad Health Check</h1>
      </div>
    </router-link>
    <nav class="site-nav">
      <ul>
        <li class="site-nav__item">
          <router-link :to="{ name: 'Dashboard' }">
            <span>My Projects</span>
          </router-link>
        </li>
        <li class="site-nav__item">
          <DropdownMenu>
            <template v-slot:title>
              <div class="profile">
                <img class="profile__photo" :src="user.photoURL" />
              </div>
            </template>
            <template class="user-dropdown" v-slot:items>
              <div class="user-dropdown__buttons">
                <DropdownMenuButton :action="signOut" class="btn--signout" text="Sign out" />
              </div>
            </template>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  /* background-color: var(); */
  height: 80px;
}

.app-header__logo i {
  font-size: 1.8rem;
}

.app-header__logo h1 {
  color: var(--dark-grey);
}

.site-nav {
  margin-left: auto;
}

.site-nav {
  margin-left: auto;
}

.site-nav ul {
  display: flex;
  flex-direction: row;
}

.site-nav li {
  margin-right: 20px;
}

.site-nav li:last-of-type {
  margin-right: 0;
}

.site-nav__item {
  color: var(--dark-grey);
  /* background: var(--light); */
}

.site-nav__item:visited {
  color: var(--grey);
  text-decoration: underline;
}

.site-nav__item:hover {
  color: var(--dark-grey);
}

.site-nav__item a {
  color: var(--dark-grey);
  padding: 0 8px;
  display: flex;
  align-items: center;
  height: 35px;
}

.site-nav__item a:hover {
  text-decoration: underline;
}

.profile {
  display: flex;
  align-items: center;
}

.profile:hover {
  cursor: pointer;
  text-decoration: underline;
}

.profile__photo {
  width: 35px;
  border-radius: 50%;
}

.btn--signout {
  color: var(--blue);
}

.btn--signout:hover {
  text-decoration: underline;
}
</style>
