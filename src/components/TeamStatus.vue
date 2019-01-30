<script>
    import { STATUS } from '@/utils/constants'

    export default {
        name: 'TeamStatus',

        /* Local state */
        data: () => ({
          STATUS
        }),

        // Interface
        props: {
          status: {
            type: Number,
            required: false,
            default: 0
          },
          statusChange: {
            type: Number,
            required: false,
            default: 0
          }
        },

        computed: {
          hasIncreased() {
            return this.statusChange === 1;
          },

          hasDecreased() {
            return this.statusChange === -1;
          },
        }
    }
</script>

<template>
    <div
        :class="{
            empty: status === STATUS.EMPTY,
            red: status === STATUS.RED,
            amber: status === STATUS.AMBER,
            green: status === STATUS.GREEN
        }"
        class="status">
          <i
            v-if="hasIncreased"
            class="status__arrow fa fa-arrow-up"
          />
          <i
            v-if="hasDecreased"
            class="status__arrow fa fa-arrow-down"
          />
        </div>
</template>

<style>
    .status {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        border: solid 1px #ccc;
        margin: auto;
        display: flex;
    }

    .status:hover {
        cursor: pointer;
    }

    .status__arrow {
      font-size: 1.1rem;
      margin: auto;
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