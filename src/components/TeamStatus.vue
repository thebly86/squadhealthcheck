<script>
    import { STATUS } from '../utils/constants/constants.js'

    export default {
        name: 'TeamStatus',

        // Interface
        props: {
            status: Number,
            statusChange: Number
        },

        // Local state
        data: () => ({
            STATUS
        }),

        computed: {
          hasIncreased() {
            return this.statusChange === 1;
          },

          hasDecreased() {
            return this.statusChange === -1;
          }
        }
    }
</script>

<template>
    <div 
        :class="{
            red: status === STATUS.RED,
            amber: status === STATUS.AMBER,
            green: status === STATUS.GREEN
        }"
        class="status">
          <i 
            v-if="hasIncreased" 
            class="icon status__arrow fa fa-arrow-circle-up"
          />
          <i 
            v-if="hasDecreased"
            class="icon status__arrow fa fa-arrow-circle-down"
          />
        </div>
</template>

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

    .status__arrow {
      font-size: 14px;
      margin: 3px 0 0 4px;
      color: var(--light);
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