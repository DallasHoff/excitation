<template>
    <div 
    class="alert-box" 
    :class="['alert-box--' + color, show ? '' : 'alert-box--hidden']">
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
    &--hidden {
        /* TODO: animate */
        display: none;
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