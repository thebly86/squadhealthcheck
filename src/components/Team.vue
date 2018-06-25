<template>
  <tr>
    <td>
      <span class="team-name">{{ team.name }}</span>
    </td>
    <td class="team-actions">
      <a class="btn-action">
        <i class="icon icon--edit fa fa-edit"></i>
      </a>
      <a class="btn-action">
        <i class="icon icon--delete fa fa-trash"></i>
      </a>
    </td>
  </tr>
</template>


<script>
  export default {
    name: 'Team',

    props: {
      team: {
        type: String,
        required: true
      }
    }
  }
</script>


<style>
.team-name {
  padding: 2px 2px;
}

.team-actions {
  padding: 3px;
}

tr:hover .btn-action {
  display: inline-block;
}

.btn-action {
  display: none;
}

</style>