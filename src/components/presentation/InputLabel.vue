<template>
    <component :is="tag" class="input-label">
		<span class="input-label__text">{{ text }}</span>
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
        }
    }
}
</script>

<style lang="scss" scoped>
.input-label {
    &__text {
		font-size: 1.2em;
		color: rgba(var(--ion-color-dark-rgb), .8);
    }
}
</style>