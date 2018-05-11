<template>
  <tr>
    <td>
      <span>Sprint {{ sprint.id }}</span>
    </td>
    <td>
      <span>21-01-2018</span>
    </td>
    <td>
      <span>09-02-2018</span>
    </td>
    <td>
      <div class="sprint-actions">
        <a class="btn-action">
          <i class="icon icon--edit fa fa-edit"></i>
        </a>
        <a class="btn-action">
          <i class="icon icon--delete fa fa-trash"></i>
        </a>
      </div>
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
    },

    created() {

    }
  }
</script>


<style>
.sprint-actions {
  float: right;
}
</style>