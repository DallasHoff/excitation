<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Home</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
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
						<gap-vue :size="1"></gap-vue>

						<input-label-vue 
						tag="div" 
						text="Source Type">
							<radio-boxes-vue 
							name="source-type" 
							v-model="sourceType" 
							:inputs="sourceTypeInputs">
							</radio-boxes-vue>
						</input-label-vue>
						<gap-vue :size="1"></gap-vue>

						<input-label-vue :text="queryField.label">
							<ion-input 
							name="query" 
							:type="queryField.type" 
							:inputmode="queryField.inputmode" 
							clear-input 
							required 
							v-model="query" 
							class="search-field theme-input">
							</ion-input>
						</input-label-vue>
						<ion-button 
						v-if="showPasteButton" 
						type="button" 
						fill="clear" 
						size="small" 
						class="paste-button button-under-input" 
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
						class="search-button normal theme-button-primary">
							<ion-spinner name="dots" v-if="searchLoading"></ion-spinner>
							<span v-else>
								<fa :icon="['far', 'search']"></fa>
								<gap-vue direction="inline"></gap-vue>
								Search
							</span>
						</ion-button>
					</form>
				</section>

				<section 
				v-show="showResults" 
				ref="searchResults"
				class="search-results">
					<transition name="v-fade-down">
						<h2 v-show="showResults">
							Sources We Found
						</h2>
					</transition>
					<citation-list-vue :citation-set="searchResults"></citation-list-vue>
				</section>

				<alert-box-vue 
				:show="searchErrorShow" 
				ref="searchErrorAlert" 
				color="danger">
					{{ searchError }}
				</alert-box-vue>
			</main-content-vue>

		</ion-content>
	</ion-page>
</template>

<script>
import { getPlatforms, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner } from '@ionic/vue';
import { Plugins } from '@capacitor/core';
const { Clipboard, Storage } = Plugins;

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaste, faSearch } from '@fortawesome/pro-regular-svg-icons';
library.add(faPaste, faSearch);

import MainContentVue from '@/components/layout/MainContent.vue';
import GapVue from '@/components/layout/Gap.vue';
import InputLabelVue from '@/components/forms/InputLabel.vue';
import RadioBoxesVue from '@/components/forms/RadioBoxes.vue';
import AlertBoxVue from '@/components/presentation/AlertBox.vue';
import CitationListVue from '@/components/presentation/CitationList.vue';

export default {
	name: 'Home',
	components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner, MainContentVue, GapVue, InputLabelVue, RadioBoxesVue, AlertBoxVue, CitationListVue },
	data() {
		return {
			citationFormat: 'mla',
			sourceType: 'webpage',
			query: '',
			searchLoading: false,
			searchError: '',
			searchErrorShow: false,
			searchResults: []
		}
	},
	computed: {
		citationFormatInputs() {
			return this.$store.state.citationFormats;
		},
		sourceTypeInputs() {
			return this.$store.state.sourceTypes;
		},
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
		showPasteButton() {
			// Only show paste button if supported by platform
			const platforms = getPlatforms();
			if (
				platforms.indexOf('hyrid') > -1 || 
				!!navigator?.clipboard?.readText
			) {
				return true;
			}
			return false;
		},
		showResults() {
			return this.searchResults.length > 0;
		}
	},
	watch: {
		async citationFormat(n) {
			if (this.showResults) {
				this.searchResults = this.searchResults.map(result => {
					result.format = n;
					return result;
				});
			}
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
						this.searchResults = apiResponseJson.map(source => {
							return {
								format: this.citationFormat,
								type: this.sourceType,
								source
							}
						});
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
				let scrollTo = this.$refs.searchResults;
				if (this.searchError) {
					scrollTo = this.$refs.searchErrorAlert.$el;
					this.searchErrorShow = true;
				}
				this.$nextTick(() => {
					scrollTo.scrollIntoView({behavior: 'smooth'});
				});
			}
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
.search-results {
	min-height: 100vh;
}
</style>