<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Home</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Home</ion-title>
				</ion-toolbar>
			</ion-header>
		
			<main-content-vue>
				<section>
					<h1>New Citation</h1>
					<gap-vue :size="4"></gap-vue>

					<form method="GET" @submit.prevent="search">
						<input-label-vue 
						tag="div" 
						text="Citation Format">
							<radio-boxes-vue 
							name="citation-format" 
							v-model="citationFormat" 
							:inputs="citationFormatInputs">
							</radio-boxes-vue>
						</input-label-vue>
						<gap-vue :size="4"></gap-vue>

						<input-label-vue 
						tag="div" 
						text="Source Type">
							<radio-boxes-vue 
							name="source-type" 
							v-model="sourceType" 
							:inputs="sourceTypeInputs">
							</radio-boxes-vue>
						</input-label-vue>
						<gap-vue :size="4"></gap-vue>

						<input-label-vue :text="queryField.label">
							<ion-input 
							name="query" 
							:type="queryField.type" 
							:inputmode="queryField.inputmode" 
							clear-input 
							required 
							v-model="query" 
							class="search-field input-bordered">
							</ion-input>
						</input-label-vue>
						<ion-button 
						type="button" 
						fill="clear" 
						size="small" 
						class="paste-button" 
						@click="pasteQuery()">
							<fa :icon="['far', 'paste']"></fa>
							<gap-vue direction="inline"></gap-vue>
							Paste
						</ion-button>
						<gap-vue :size="4"></gap-vue>

						<ion-button 
						type="submit" 
						expand="block" 
						:disabled="searchLoading" 
						class="search-button normal">
							<ion-spinner name="dots" v-if="searchLoading"></ion-spinner>
							<span v-else>
								<fa :icon="['far', 'search']"></fa>
								<gap-vue direction="inline"></gap-vue>
								Search
							</span>
						</ion-button>
					</form>
				</section>

				<section v-show="showResults">
					<transition name="v-fade-down">
						<h2 v-show="showResults">
							Sources We Found
						</h2>
					</transition>
					<ion-list class="search-results normal">
						<transition-group name="v-fade-left">
							<ion-item 
							detail 
							v-for="(source, index) in searchResults" 
							:key="source.image" 
							href="" 
							class="search-result normal" 
							:style="{'transition-delay': (40 * index) + 'ms'}">
								<ion-thumbnail 
								class="search-result__thumbnail" 
								slot="start">
									<ion-img 
									v-if="source.image" 
									:src="source.image" 
									alt="">
									</ion-img>
									<fa 
									v-else 
									:icon="['far', sourceTypeIcon]" 
									size="2x" 
									class="search-result__icon">
									</fa>
								</ion-thumbnail>
								<ion-label>
									<h3 class="search-result__title">
										{{ source.title }}
									</h3>
									<div 
									v-if="source.authors" 
									class="search-result__authors">
										By {{ searchResultAuthors(source.authors) }}
									</div>
								</ion-label>
							</ion-item>
						</transition-group>
					</ion-list>
				</section>

				<alert-box-vue color="danger" :show="searchErrorShow">
					{{ searchError }}
				</alert-box-vue>
			</main-content-vue>

		</ion-content>
	</ion-page>
</template>

<script>
import { Plugins } from '@capacitor/core';
const { Clipboard, Storage } = Plugins;
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner, IonList, IonItem, IonThumbnail, IonImg, IonLabel } from '@ionic/vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaste, faSearch, faGlobe, faBook } from '@fortawesome/pro-regular-svg-icons';
library.add(faPaste, faSearch, faGlobe, faBook);
import MainContentVue from '@/components/layout/MainContent.vue';
import GapVue from '@/components/layout/Gap.vue';
import InputLabelVue from '@/components/presentation/InputLabel.vue';
import RadioBoxesVue from '@/components/forms/RadioBoxes.vue';
import AlertBoxVue from '@/components/presentation/AlertBox.vue';

export default {
	name: 'Home',
	components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner, IonList, IonItem, IonThumbnail, IonImg, IonLabel, MainContentVue, GapVue, InputLabelVue, RadioBoxesVue, AlertBoxVue },
	data() {
		return {
			citationFormat: 'mla',
			sourceType: 'webpage',
			query: '',
			citationFormatInputs: {
				mla: 'MLA',
				apa: 'APA',
				chicago: 'Chicago'
			},
			sourceTypeInputs: {
				webpage: 'Web Page',
				book: 'Book'
			},
			searchLoading: false,
			searchError: '',
			searchErrorShow: false,
			searchResults: []
		}
	},
	computed: {
		queryField() {
			switch (this.sourceType) {
				case 'webpage': 
					return {
						label: 'Web Page URL',
						type: 'url',
						inputmode: 'url'
					};
				case 'book': 
					return {
						label: 'Book Title or ISBN',
						type: 'search',
						inputmode: 'search'
					};
			}
			return {};
		},
		sourceTypeIcon() {
			switch (this.sourceType) {
				case 'webpage': return 'globe';
				case 'book': return 'book';
			}
			return '';
		},
		showResults() {
			return this.searchResults.length > 0;
		}
	},
	watch: {
		async citationFormat(n) {
			try {
				await Storage.set({key: 'citationFormatInput', value: n});
			} catch (err) {
				console.warn(err);
			}
		},
		async sourceType(n) {
			try {
				await Storage.set({key: 'sourceTypeInput', value: n});
			} catch (err) {
				console.warn(err);
			}
		}
	},
	methods: {
		async pasteQuery() {
			// Paste into query text input
			try {
				const clipboardText = await Clipboard.read();
				this.query = clipboardText.value;
			} catch (err) {
				console.warn(err);
			}
		},
		async search() {
			this.searchResults = [];
			this.searchLoading = true;
			this.searchErrorShow = false;
			try {
				// Call API with user query
				const q = encodeURIComponent(this.query);
				const apiResponse = await fetch(
					`${process.env.VUE_APP_API_URL}/cite/${this.sourceType}?q=${q}`,
					{
						method: 'GET'
					}
				);
				const apiResponseJson = await apiResponse.json();
				// Show results
				if (apiResponse.ok) {
					if (apiResponseJson.length > 0) {
						this.searchResults = apiResponseJson;
						this.searchError = '';
					} else {
						this.searchError = 'We did not find any results for your search. Please check your input and try again.';
					}
				} else {
					this.searchError = apiResponseJson.error || 'An error ocurred with your search. Please try again.';
				}
			} catch (err) {
				this.searchError = 'A network error occurred. Please check your connection and try again.';
			} finally {
				this.searchLoading = false;
				if (this.searchError) this.searchErrorShow = true;
			}
		},
		searchResultAuthors(authorArray) {
			// Format author name list
			const lastNames = authorArray.filter(author => author.last).map(author => author.last);
			if (lastNames.length === 2) {
				return lastNames.join(' and ', lastNames);
			}
			return lastNames.join(', ', lastNames);
		}
	},
	async created() {
		// Stored inputs
		try {
			const citationFormatInput = await Storage.get({key: 'citationFormatInput'});
			if (citationFormatInput.value) this.citationFormat = citationFormatInput.value;
			const sourceTypeInput = await Storage.get({key: 'sourceTypeInput'});
			if (sourceTypeInput.value) this.sourceType = sourceTypeInput.value;
		} catch (err) {
			console.warn(err);
		}
	}
}
</script>

<style lang="scss" scoped>
.paste-button {
	--padding-start: 2px;
	--padding-end: 2px;
	margin: 2px 0;
}
.search-results {
	margin: 0 var(--revert-content-padding);
	.search-result {
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