<template>
    <div 
        :class="{red: status === 1, amber: status === 2, green: status === 3}"
        class="status"></div>
</template>


<script>
    export default {
        name: 'TeamStatus',

        props: {
            team: Object,
            criteria: String
        },

        computed: {
            status: function() {
                return this.team[this.criteria];
            }
        },

        methods: {

        },

        created: function() {
            if (_.isEmpty(this.team[this.criteria])) {
                this.team[this.criteria] = { value: 0 };
            }
        }
    }
</script>


<style>
    .status {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        border: solid 1px #ccc;
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