<template>
    <div :class="['gap', 'gap-' + direction, 'gap-' + direction + '-' + size]"></div>
</template>

<script>
export default {
    name: 'Gap',
    props: {
        direction: {
            type: String,
            default: 'block'
        },
        size: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style lang="scss" scoped>
.gap {
    &-block {
        display: block;
        @each $size in 1, 2, 3, 4, 5, 6 {
            &-#{$size} {
                margin-block-end: calc(var(--gap-base) * #{$size});
            }
        }
    }
    &-inline {
        display: inline-block;
        @each $size in 1, 2, 3, 4, 5, 6 {
            &-#{$size} {
                margin-inline-end: calc(var(--gap-base) * #{$size});
            }
        }
    }
}
</style>