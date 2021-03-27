<template>
    <transition name="v-fade-up">
        <div 
        v-show="show" 
        class="alert-box" 
        :class="['alert-box--' + color]">
            <div class="alert-box__icon">
                <fa 
                :icon="['far', 'exclamation-circle']" 
                size="lg">
                </fa>
            </div>
            <div class="alert-box__message">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons';
library.add(faExclamationCircle);

export default {
    name: 'AlertBox',
    props: {
        show: {
            type: Boolean,
            default: true
        },
        color: {
            type: String,
            default: 'danger'
        }
    }
}
</script>

<style lang="scss" scoped>
.alert-box {
    display: flex;
    align-items: center;
    padding: calc(var(--gap-base) * 3);
    border-radius: var(--border-radius);
    &__icon {
        margin-right: calc(var(--gap-base) * 3);
    }
    &--danger {
        color: var(--ion-color-danger-contrast);
        background-color: var(--ion-color-danger);
    }
    &--warning {
        color: var(--ion-color-warning-contrast);
        background-color: var(--ion-color-warning);
    }
    &--success {
        color: var(--ion-color-success-contrast);
        background-color: var(--ion-color-success);
    }
}
</style>