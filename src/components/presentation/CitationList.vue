<template>
    <ion-list class="citation-list normal">
        <transition-group name="v-fade-left">
			<ion-item-sliding 
			v-for="(citation, index) in citationSet" 
			:key="citation.savedTime" 
			:ref="'sliding-' + index" 
			:disabled="enableSliding === false" 
			:style="{'transition-delay': (40 * index) + 'ms'}">
				<ion-item 
				button 
				detail 
				@click="cite(citation)" 
				@contextmenu.prevent="toggleDeleteOption('sliding-' + index, 'open')" 
				class="citation-list__citation normal">
					<ion-thumbnail 
					class="citation-list__citation__thumbnail" 
					slot="start">
						<ion-img 
						v-if="citation.source.image" 
						:src="citation.source.image" 
						alt="">
						</ion-img>
						<fa 
						v-else 
						:icon="['far', sourceTypeIcon(citation.type)]" 
						size="2x" 
						class="citation-list__citation__icon">
						</fa>
					</ion-thumbnail>
					<ion-label>
						<h3 class="citation-list__citation__title">
							{{ citation.source.title }}
						</h3>
						<div 
						v-if="searchResultAuthors(citation.source.authors)" 
						class="citation-list__citation__authors">
							By {{ searchResultAuthors(citation.source.authors) }}
						</div>
					</ion-label>
				</ion-item>
				<ion-item-options 
				side="end" 
				@contextmenu.prevent="toggleDeleteOption('sliding-' + index, 'close')">
					<ion-item-option 
					color="danger"
					@click="deleteCitation(index)">
						Delete
					</ion-item-option>
				</ion-item-options>
			</ion-item-sliding>
        </transition-group>
    </ion-list>
</template>

<script>
import { IonList, IonItem, IonThumbnail, IonImg, IonLabel, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faGlobe, faBook } from '@fortawesome/pro-regular-svg-icons';
library.add(faGlobe, faBook);

export default {
    name: 'CitationList',
    components: { IonList, IonItem, IonThumbnail, IonImg, IonLabel, IonItemSliding, IonItemOptions, IonItemOption },
    props: {
        citationSet: {
            type: Array,
            default: () => []
        },
		enableSliding: {
			type: Boolean,
			default: false
		}
    },
    methods: {
		sourceTypeIcon(sourceType) {
			switch (sourceType) {
				case 'webpage': return 'globe';
				case 'book': return 'book';
			}
			return '';
		},
		searchResultAuthors(authorArray) {
			// Format author name list
			if (!authorArray) return null;
			const names = authorArray.map(author => {
				let name = '';
				if (author.first && author.middle && author.last) {
					name = `${author.first} ${author.middle} ${author.last}`;
					if (author.suffix) name += ` ${author.suffix}`;
				} else if (author.first && author.last) {
					name = `${author.first} ${author.last}`;
					if (author.suffix) name += ` ${author.suffix}`;
				} else if (author.last) {
					name = author.last;
				} else if (author.first) {
					name = author.first;
				}
				return name || null;
			}).filter(name => name !== null);
			if (names.length === 2) {
				return names.join(' and ');
			}
			return names.join(', ');
		},
		toggleDeleteOption(ref, action) {
			if (this.enableSliding === true) {
				this.$refs[ref].$el[action]('end');
			}
		},
		deleteCitation(index) {
			this.$store.commit('deleteCitation', index);
		},
		cite(citation) {
			this.$store.commit('setCitationInfo', JSON.parse(JSON.stringify(citation)));
			this.$router.push('/home/citation');
		}
    }
}
</script>

<style lang="scss" scoped>
.citation-list {
	margin: 0 var(--revert-content-padding);
	&__citation {
		&__thumbnail {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--ion-color-secondary);
			background: rgba(var(--ion-color-secondary-rgb), .2);
		}
		&__icon {
			opacity: .5;
		}
		&__title,
		&__authors {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		&__authors {
			font-size: .8em;
			color: var(--ion-color-medium);
		}
	}
}
</style>