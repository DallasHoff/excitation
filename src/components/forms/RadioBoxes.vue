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
import GapVue from '../layout/Gap.vue'

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
    gap: calc(var(--gap-base) * 3);
    &__box {
        padding: calc(var(--gap-base) * 3);
        background-color: rgba(var(--ion-color-medium-rgb), .2);
        border: 2px solid rgba(var(--ion-color-medium-rgb), .6);
        border-radius: var(--border-radius);
        transition: background-color 200ms, border-color 200ms;
        &--checked {
            background-color: rgba(var(--ion-color-primary-rgb), .2);
            border-color: rgba(var(--ion-color-primary-rgb), .6);
        }
    }
}
</style>