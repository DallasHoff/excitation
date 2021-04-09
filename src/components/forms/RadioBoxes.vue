<template>
    <div class="radio-boxes">
        <label 
        v-for="text, value in inputs"  
        :key="value"
        class="radio-boxes__box" 
        :class="{'radio-boxes__box--checked': modelValue === value}">
            <input 
            type="radio" 
            :name="name" 
            :value="value" 
            :checked="modelValue === value" 
            @input="$emit('update:modelValue', $event.target.value)" />
            <gap-vue direction="inline"></gap-vue>
            {{ text }}
        </label>
    </div>
</template>

<script>
import GapVue from '../layout/Gap.vue';

export default {
    name: 'RadioBoxes',
    components: { GapVue },
    props: {
        name: {
            type: String,
            required: true
        },
        inputs: {
            type: Object,
            required: true
        },
        modelValue: {
            type: String
        }
    },
    emits: [ 'update:modelValue' ]
}
</script>

<style lang="scss" scoped>
.radio-boxes {
    display: flex;
    flex-wrap: wrap;
    &__box {
        cursor: pointer;
        padding: calc(var(--gap-base) * 3);
        margin-bottom: calc(var(--gap-base) * 3);
        background-color: rgba(var(--ion-color-medium-rgb), .2);
        background-image: var(--theme-box-gradient);
        box-shadow: var(--theme-box-shadow);
        border-radius: var(--border-radius);
        &:not(:last-child) {
            margin-right: calc(var(--gap-base) * 3);
        }
        &--checked {
            color: white;
            background-color: rgba(var(--ion-color-primary-rgb), .2);
            background-image: var(--theme-box-gradient-primary);
        }
    }
}
</style>