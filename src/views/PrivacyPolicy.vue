<script>
import firebase from "firebase";
import ProjectHeader from "@/components/ProjectHeader";

import criteria from "@/data/criteria.json";

export default {
  name: "PrivacyPolicy",

  // Template dependencies
  components: {
    ProjectHeader
  }
};
</script>

<template>
  <div>
    <h1>Privacy Policy</h1>
    <p>
      Due to Google authentication, it is required that Squad Health Check gather personally-identifying information. The only information gathered will be the user's email. Squad Health Check collects such information only insofar as is necessary or appropriate to fulfil the purpose of the user's interaction with the Squad Health Check tool. Squad Health Check does not disclose personally-identifying information with any other party. Users can always refuse to supply personally-identifying information, with the caveat that it will prevent them from using the tool.
    </p>
  </div>
</template>

<style scoped></style>
