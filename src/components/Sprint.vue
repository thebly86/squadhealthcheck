<template>
  <tr>
    <td>
      <span>Sprint {{ sprint.id }}</span>
    </td>
    <td>
      <span>{{ sprint.startDate }}</span>
    </td>
    <td>
      <span>{{ sprint.endDate }}</span>
    </td>
    <td class="sprint-actions">
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
    name: 'Sprint',

    props: {
      sprint: {
        type: Object,
        required: true
      }
    }
  }
</script>


<style>
.sprint-actions {
  padding: 3px;
}
</style>