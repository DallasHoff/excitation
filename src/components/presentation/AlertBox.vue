<template>
    <transition name="v-fade-up">
        <div 
        v-show="show" 
        class="alert-box" 
        :class="['alert-box--' + color]">
            <div>
                <fa 
                :icon="['far', 'exclamation-circle']" 
                size="lg">
                </fa>
            </div>
            <div>
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
    gap: calc(var(--gap-base) * 3);
    padding: calc(var(--gap-base) * 3);
    border-radius: var(--border-radius);
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

.v-fade-up-enter-active,
.v-fade-up-leave-active {
    transition: transform 250ms, opacity 250ms, visibility 250ms;
}
.v-fade-up-enter-from,
.v-fade-up-leave-to {
    transform: translateY(1.5em);
    opacity: 0;
    visibility: hidden;
}
</style>