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
            <div 
            class="radio-boxes__box__button" 
            :class="{'radio-boxes__box__button--checked': modelValue === value}">
            </div>
            <gap-vue direction="inline" :size="2"></gap-vue>
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
        --button-size: 20px;
        cursor: pointer;
        display: flex;
        padding: calc(var(--gap-base) * 3);
        margin-bottom: calc(var(--gap-base) * 3);
        background-color: rgba(var(--ion-color-medium-rgb), .2);
        background-image: var(--theme-box-gradient);
        box-shadow: var(--theme-box-shadow);
        border-radius: var(--border-radius);
        line-height: var(--button-size);
        &:not(:last-child) {
            margin-right: calc(var(--gap-base) * 3);
        }
        &:active {
            background-image: var(--theme-box-gradient-inset);
            box-shadow: var(--theme-box-shadow-inset);
        }
        &--checked {
            color: white;
            background-color: rgba(var(--ion-color-primary-rgb), .2);
            background-image: var(--theme-box-gradient-primary);
            &:active {
                background-image: var(--theme-box-gradient-primary-inset);
            }
        }
        &__button {
            position: relative;
            width: var(--button-size);
            height: var(--button-size);
            background-image: var(--theme-box-gradient-inset);
            box-shadow: var(--theme-box-shadow-inset);
            border-radius: 50%;
            &::before {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: calc(var(--button-size) / 2);
                height: calc(var(--button-size) / 2);
                margin: auto;
                background-color: white;
                box-shadow: var(--theme-box-shadow);
                border-radius: 50%;
                transform: scale(0);
                transition: transform 300ms;
            }
            &--checked {
                background-image: var(--theme-box-gradient-primary-inset);
                &::before {
                    transform: scale(1);
                }
            }
        }
        input {
            display: none;
        }
    }
}
</style>