<template>
    <v-btn :class="customClass" :to="to" text @click="onClick">
        <v-icon v-if="icon" :style="iconStyle" class="mr-2">
            {{ icon }}
        </v-icon>
        <slot></slot>
    </v-btn>
</template>

<script>
    export default {
        name: "NavigationButton",
        props: {
            icon: {
                type: String,
                required: false,
                default: null
            },
            iconStyle: {
                type: Object,
                required: false
            },
            customClass: {
                type: String,
                required: false,
                default: "ml-2"
            },
            onClick: {
                type: Function,
                required: false,
                default: null
            },
            to: {
                type: [String, Object],
                required: false,
                default: null
            }
        }
    };
</script>