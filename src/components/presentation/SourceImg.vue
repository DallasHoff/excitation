<template>
    <ion-thumbnail class="source-img">
        <ion-img 
        v-if="showImg && imgUrl" 
        :src="imgUrl" 
        :alt="imgAlt" 
        @ion-img-did-load="showImg = true" 
        @ion-error="showImg = false">
        </ion-img>
        <fa 
        v-else 
        :icon="['far', sourceTypeIcon]" 
        size="2x" 
        class="source-img__icon">
        </fa>
    </ion-thumbnail>
</template>

<script>
import { IonThumbnail, IonImg } from '@ionic/vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faGlobe, faBook } from '@fortawesome/pro-regular-svg-icons';
library.add(faGlobe, faBook);

export default {
    name: 'SourceImg',
    components: { IonThumbnail, IonImg },
    props: {
        imgUrl: {
            type: String
        },
        imgAlt: {
            type: String
        },
        sourceType: {
            type: String,
            default: 'book'
        }
    },
    data() {
        return {
            showImg: true
        }
    },
    computed: {
		sourceTypeIcon() {
			switch (this.sourceType) {
				case 'webpage': return 'globe';
				case 'book': return 'book';
			}
			return '';
		}
    }
}
</script>

<style lang="scss" scoped>
.source-img {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ion-color-secondary);
    background: rgba(var(--ion-color-secondary-rgb), .2);
    &__icon {
        opacity: .5;
    }
}
</style>