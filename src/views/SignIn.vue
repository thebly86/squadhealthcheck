<script>
import firebase from "firebase";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "SignIn",

  /* Local state */
  data: () => ({
    uiConfig: {
      immediateFederatedRedirect: true,
      signInFlow: "popup",
      signInSuccessUrl: "/",
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: ["email", "profile"]
        }
      ]
    }
  }),

  /* Events */
  mounted() {
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebase-auth-container", this.uiConfig);
  }
};
</script>

<template>
  <div class="signin__wrapper">
    <div class="signin">
      <div class="site-logo">
        <i class="fa fa-heartbeat" />
        <h1>Squad Health Check</h1>
      </div>
      <p>Sign in with your Google account to get started.</p>
      <div class="signin__options">
        <div id="firebase-auth-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signin__wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: var(--lighter-grey);
}

.signin {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  margin: auto;
}

.signin__options {
  padding: 10px;
}
</style>
