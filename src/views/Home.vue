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
							class="search-field">
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
						class="search-button">
							<ion-spinner name="dots" v-if="searchLoading"></ion-spinner>
							<span v-else>
								<fa :icon="['far', 'search']"></fa>
								<gap-vue direction="inline"></gap-vue>
								Search
							</span>
						</ion-button>
					</form>
				</section>

				<section v-if="searchResults.length > 0">
					<h2>Here&rsquo;s What We Found</h2>
					<!-- TODO: Search results -->
				</section>
			</main-content-vue>

		</ion-content>
	</ion-page>
</template>

<script>
import { Plugins } from '@capacitor/core';
const { Clipboard } = Plugins;
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner } from '@ionic/vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaste, faSearch } from '@fortawesome/pro-regular-svg-icons';
library.add(faPaste, faSearch);
import MainContentVue from '@/components/layout/MainContent.vue';
import GapVue from '@/components/layout/Gap.vue';
import InputLabelVue from '@/components/text/InputLabel.vue';
import RadioBoxesVue from '@/components/forms/RadioBoxes.vue';

export default {
	name: 'Home',
	components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner, MainContentVue, GapVue, InputLabelVue, RadioBoxesVue },
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
		}
	},
	methods: {
		async pasteQuery() {
			try {
				const clipboardText = await Clipboard.read();
				this.query = clipboardText.value;
			} catch (err) {
				console.warn(err);
			}
		},
		search() {
			// TODO
			this.searchLoading = true;
			this.searchResults = [];
		}
	}
}
</script>

<style lang="scss" scoped>
.search-field {
	--background: rgba(var(--ion-color-medium-rgb), .2);
	border: 2px solid rgba(var(--ion-color-medium-rgb), .6);
	border-radius: var(--border-radius);
}
.paste-button {
	--padding-start: 2px;
	--padding-end: 2px;
	margin: 2px 0;
}
.search-button {
	margin: 0;
}
</style>