<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
				<ion-title>Citation</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button></ion-back-button>
                    </ion-buttons>
					<ion-title size="large">Citation</ion-title>
				</ion-toolbar>
			</ion-header>
			
			<main-content-vue>
                <section>
					<h1>Your Citation</h1>
					<gap-vue :size="4"></gap-vue>

					TODO: {{ citationInfo }}

                </section>

				<section v-if="citationInfo">
					<h2>Citation Information</h2>
					<gap-vue :size="4"></gap-vue>

					<input-label-vue text="Title" text-tag="h3">
						<ion-input 
						name="title" 
						type="text" 
						inputmode="text" 
						v-model="citationInfo.source.title" 
						class="input-bordered">
						</ion-input>
					</input-label-vue>
					<gap-vue :size="6"></gap-vue>

					<div>
						<h3>{{ authorLabel }}</h3>
						<transition-group name="v-fade-up">
							<div 
							v-for="(author, index) in citationInfo.source.authors" 
							:key="author.key" 
							class="author-input-group">
								<input-label-vue text="First">
									<ion-input 
									:name="'author-first-' + index" 
									type="text" 
									inputmode="text" 
									v-model="author.first" 
									class="input-bordered">
									</ion-input>
								</input-label-vue>
								<input-label-vue text="Middle">
									<ion-input 
									:name="'author-middle-' + index" 
									type="text" 
									inputmode="text" 
									v-model="author.middle" 
									class="input-bordered">
									</ion-input>
								</input-label-vue>
								<input-label-vue text="Last">
									<ion-input 
									:name="'author-last-' + index" 
									type="text" 
									inputmode="text" 
									v-model="author.last" 
									class="input-bordered">
									</ion-input>
								</input-label-vue>
								<input-label-vue text="Suffix">
									<ion-input 
									:name="'author-suffix-' + index" 
									type="text" 
									inputmode="text" 
									v-model="author.suffix" 
									class="input-bordered">
									</ion-input>
								</input-label-vue>
								<ion-button 
								type="button" 
								fill="clear" 
								class="remove-author-button" 
								:disabled="citationInfo.source.authors.length < 2" 
								@click="removeAuthor(index)">
									<fa :icon="['far', 'times']" title="Remove this author"></fa>
								</ion-button>
							</div>
						</transition-group>
					</div>
					<ion-button 
					type="button" 
					fill="clear" 
					size="small" 
					class="button-under-input" 
					@click="addAuthor()">
						<fa :icon="['far', 'plus']"></fa>
						<gap-vue direction="inline"></gap-vue>
						Add Another Author
					</ion-button>
					<gap-vue :size="4" v-if="citationInfo.source.authors"></gap-vue>

					<input-label-vue text="Publisher" text-tag="h3">
						<ion-input 
						name="publisher" 
						type="text" 
						inputmode="text" 
						v-model="citationInfo.source.publisher" 
						class="input-bordered">
						</ion-input>
					</input-label-vue>
					<gap-vue :size="6"></gap-vue>

					<input-label-vue text="Date Published" text-tag="h3">
						<ion-datetime 
						name="published-time" 
						display-format="DD MMM YYYY" 
						min="1600" 
						v-model="citationInfo.source.publishedTime" 
						class="input-bordered">
						</ion-datetime>
					</input-label-vue>
					<gap-vue :size="6"></gap-vue>

					<div v-if="citationInfo.type === 'webpage'">
						<input-label-vue text="Date Retrieved" text-tag="h3">
							<ion-datetime 
							name="retrieved-time" 
							display-format="DD MMM YYYY" 
							min="2000" 
							v-model="citationInfo.retrievedTime" 
							class="input-bordered">
							</ion-datetime>
						</input-label-vue>
						<gap-vue :size="6"></gap-vue>
					</div>

				</section>
            </main-content-vue>
			
		</ion-content>
	</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonDatetime, IonButton } from '@ionic/vue';
import MainContentVue from '@/components/layout/MainContent.vue';
import InputLabelVue from '@/components/presentation/InputLabel.vue';
import GapVue from '@/components/layout/Gap.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faTimes } from '@fortawesome/pro-regular-svg-icons';
library.add(faPlus, faTimes);

export default {
	name: 'Citation',
	components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonDatetime, IonButton, MainContentVue, InputLabelVue, GapVue },
    computed: {
		citationInfo: {
			get() {
				return this.$store.state.citationInfo;
			},
			set(value) {
				this.$store.commit('setCitationInfo', value);
			}
		},
		authorLabel() {
			if (this.citationInfo?.source?.authors?.length > 1) {
				return 'Authors';
			}
			return 'Author';
		}
    },
	methods: {
		getRandomInt() {
			return Math.floor(Math.random() * 1000000);
		},
		addAuthor() {
			this.citationInfo?.source?.authors?.push({
				title: '',
				first: '',
				middle: '',
				last: '',
				suffix: '',
				key: this.getRandomInt()
			});
		},
		removeAuthor(index) {
			this.citationInfo?.source?.authors?.splice(index, 1);
		}
	},
	created() {
		if (!this.citationInfo?.source) {
			// Redirect to home if state has no citation info
			this.$router.replace('/home');
		} else {
			// Add fields for author if none was found
			if (!this.citationInfo.source.authors) {
				this.citationInfo.source.authors = [];
				this.addAuthor();
			}
			// Add keys for authors
			this.citationInfo.source.authors = this.citationInfo.source.authors.map(author => {
				author.key = this.getRandomInt();
				return author;
			});
			// Initialize date retrieved with current date
			this.citationInfo.retrievedTime = new Date().toISOString();
		}
	}
}
</script>

<style lang="scss" scoped>
.author-input-group {
	display: grid;
	grid-template-columns: 3fr 2fr 3fr 1fr 0.5fr;
	gap: calc(var(--gap-base) * 2);
	margin-bottom: calc(var(--gap-base) * 4);
	white-space: nowrap;
	&:last-child {
		margin-bottom: calc(var(--gap-base) * 2);
	}
}
.remove-author-button {
	font-size: 1.4em;
    --padding-start: 0;
    --padding-end: 0;
    margin: auto 0 .2em 0;
}
</style>