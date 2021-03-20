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
        &-1 {
            margin-block-end: calc(var(--gap-base) * 1);
        }
        &-2 {
            margin-block-end: calc(var(--gap-base) * 2);
        }
        &-3 {
            margin-block-end: calc(var(--gap-base) * 3);
        }
        &-4 {
            margin-block-end: calc(var(--gap-base) * 4);
        }
        &-5 {
            margin-block-end: calc(var(--gap-base) * 5);
        }
        &-6 {
            margin-block-end: calc(var(--gap-base) * 6);
        }
    }
    &-inline {
        display: inline-block;
        &-1 {
            margin-inline-end: calc(var(--gap-base) * 1);
        }
        &-2 {
            margin-inline-end: calc(var(--gap-base) * 2);
        }
        &-3 {
            margin-inline-end: calc(var(--gap-base) * 3);
        }
        &-4 {
            margin-inline-end: calc(var(--gap-base) * 4);
        }
        &-5 {
            margin-inline-end: calc(var(--gap-base) * 5);
        }
        &-6 {
            margin-inline-end: calc(var(--gap-base) * 6);
        }
    }
}
</style>