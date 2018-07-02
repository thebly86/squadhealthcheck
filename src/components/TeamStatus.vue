<template>
    <div 
        :class="{
            red: status === STATUS.RED,
            amber: status === STATUS.AMBER,
            green: status === STATUS.GREEN
        }"
        class="status">
        </div>
</template>
<script>

    import { STATUS } from '../utils/constants/constants.js'

    export default {
        name: 'TeamStatus',
        props: {
            status: Number
        },
        data: () => ({
            STATUS
        })
    }
</script>

<style>
    .status {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        border: solid 1px #ccc;
        margin: auto;
    }

    .status:hover {
        cursor: pointer;
    }

    .red {
        border: none;
        background-color: #FF3300;
    }

    .amber {
        border: none;
        background-color: #FFCC33;
    }

    .green {
        border: none;
        background-color: #00CC66;
    }
</style>