<template>
    <component :is="tag" class="input-label">
		<component :is="textTag" class="input-label__text">{{ text }}</component>
		<gap-vue v-if="text" :size="2"></gap-vue>
        <slot></slot>
    </component>
</template>

<script>
import GapVue from '../layout/Gap.vue';

export default {
    name: 'InputLabel',
    components: { GapVue },
    props: {
        tag: {
            type: String,
            default: 'label'
        },
        text: {
            type: String
        },
        textTag: {
            type: String,
            default: 'span'
        }
    }
}
</script>

<style lang="scss" scoped>
span.input-label__text {
    font-size: 1.2em;
    color: var(--theme-text-color);
}
</style>