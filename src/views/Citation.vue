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

					<div class="citation-box">
						<div class="citation-box__header">
							<div 
							v-if="citationInfo?.format"
							class="citation-chip">
								{{ citationFormats[citationInfo.format] }}
							</div>
							<gap-vue :size="2" direction="inline" v-if="citationInfo?.format"></gap-vue>
							<div 
							v-if="citationInfo?.type"
							class="citation-chip">
								{{ sourceTypes[citationInfo.type] }}
							</div>
						</div>
						
						<gap-vue :size="4"></gap-vue>
						<p 
						class="citation-box__citation" 
						ref="citation" 
						v-html="citation">
						</p>
						<gap-vue :size="4"></gap-vue>

						<div class="citation-box__footer">
							<ion-button 
							type="button" 
							size="small" 
							@click="copyCitation()" 
							:disabled="copyButtonState !== 'ready'" 
							class="citation-box__button normal theme-button-primary">
								<span v-if="copyButtonState === 'success'">
									<fa :icon="['far', 'check']"></fa>
									<gap-vue direction="inline"></gap-vue>
									Copied!
								</span>
								<span v-else>
									<fa :icon="['far', 'copy']"></fa>
									<gap-vue direction="inline"></gap-vue>
									Copy
								</span>
							</ion-button>
							<gap-vue :size="2" direction="inline"></gap-vue>
							<ion-button 
							type="button" 
							size="small" 
							@click="saveCitation()" 
							:disabled="saveButtonState !== 'ready'" 
							class="citation-box__button normal theme-button-primary">
								<span v-if="saveButtonState === 'success'">
									<fa :icon="['far', 'check']"></fa>
									<gap-vue direction="inline"></gap-vue>
									Saved!
								</span>
								<span v-else>
									<fa :icon="['far', 'bookmark']"></fa>
									<gap-vue direction="inline"></gap-vue>
									Save
								</span>
							</ion-button>
						</div>
					</div>

                </section>

				<section v-if="citationInfo">
					<h2>Edit Citation Information</h2>
					<gap-vue :size="4"></gap-vue>

					<input-label-vue text="Title" text-tag="h3">
						<ion-input 
						name="title" 
						type="text" 
						inputmode="text" 
						v-model="citationInfo.source.title" 
						class="theme-input">
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
									class="theme-input">
									</ion-input>
								</input-label-vue>
								<input-label-vue text="Middle">
									<ion-input 
									:name="'author-middle-' + index" 
									type="text" 
									inputmode="text" 
									v-model="author.middle" 
									class="theme-input">
									</ion-input>
								</input-label-vue>
								<input-label-vue text="Last">
									<ion-input 
									:name="'author-last-' + index" 
									type="text" 
									inputmode="text" 
									v-model="author.last" 
									class="theme-input">
									</ion-input>
								</input-label-vue>
								<input-label-vue text="Suffix">
									<ion-input 
									:name="'author-suffix-' + index" 
									type="text" 
									inputmode="text" 
									v-model="author.suffix" 
									class="theme-input">
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
						class="theme-input">
						</ion-input>
					</input-label-vue>
					<gap-vue :size="6"></gap-vue>

					<input-label-vue text="Date Published" text-tag="h3">
						<ion-datetime 
						name="published-time" 
						display-format="DD MMM YYYY" 
						min="1600" 
						v-model="citationInfo.source.publishedTime" 
						class="theme-input">
						</ion-datetime>
					</input-label-vue>
					<gap-vue :size="6"></gap-vue>

					<div v-if="citationInfo.type === 'webpage'">
						<input-label-vue text="Date Retrieved" text-tag="h3">
							<ion-datetime 
							name="retrieved-time" 
							display-format="DD MMM YYYY" 
							min="2000" 
							v-model="citationInfo.sourceRetrievedTime" 
							class="theme-input">
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
import { faPlus, faTimes, faCopy, faBookmark, faCheck } from '@fortawesome/pro-regular-svg-icons';
library.add(faPlus, faTimes, faCopy, faBookmark, faCheck);

export default {
	name: 'Citation',
	components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonDatetime, IonButton, MainContentVue, InputLabelVue, GapVue },
	data() {
		return {
			citation: 'Harwood, W. (2015, April 22). <i>How NASA fixed Hubble\'s flawed vision - and reputation</i>. Retrieved from https://www.cbsnews.com/news/an-ingenius-fix-for-hubbles-famously-flawed-vision/ [EXAMPLE]', // TODO
			saveButtonState: 'ready',
			copyButtonState: 'ready'
		}
	},
    computed: {
		citationInfo: {
			get() {
				const citationInfo = this.$store.state.citationInfo;
				// Add fields for author if none was found
				if (!citationInfo.source.authors) {
					citationInfo.source.authors = [
						{
							title: '',
							first: '',
							middle: '',
							last: '',
							suffix: '',
							key: this.getRandomInt()
						}
					];
				}
				// Add keys for authors (needed for transitions)
				citationInfo.source.authors = citationInfo.source.authors.map(author => {
					if (!author.key) {
						author.key = this.getRandomInt();
					}
					return author;
				});
				// Initialize date retrieved with current date
				if (!citationInfo.sourceRetrievedTime) {
					citationInfo.sourceRetrievedTime = new Date().toISOString();
				}
				return citationInfo;
			},
			set(value) {
				this.$store.commit('setCitationInfo', value);
			}
		},
		citationFormats() {
			return this.$store.state.citationFormats;
		},
		sourceTypes() {
			return this.$store.state.sourceTypes;
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
		},
		copyCitation() {
			const copyHTML = this.$refs.citation.innerHTML;
			function listener(evt) {
				evt.clipboardData.setData('text/html', copyHTML);
				evt.clipboardData.setData('text/plain', copyHTML);
				evt.preventDefault();
			}
			document.addEventListener('copy', listener);
			document.execCommand('copy');
			document.removeEventListener('copy', listener);
			this.copyButtonState = 'success';
			setTimeout(() => {
				this.copyButtonState = 'ready';
			}, 3000);
		},
		saveCitation() {
			this.$store.commit('saveCitation', this.citationInfo);
			this.saveButtonState = 'success';
			setTimeout(() => {
				this.saveButtonState = 'ready';
			}, 3000);
			this.$router.push('/saved');
		}
	}
}
</script>

<style lang="scss" scoped>
.citation-box {
	user-select: text;
	padding: calc(var(--gap-base) * 4) calc(var(--gap-base) * 3);
	background-color: rgba(233, 233, 233, .85);
	background-image: linear-gradient(180deg, rgb(241 241 241 / 80%), rgb(210 210 210 / 80%));
	box-shadow: var(--theme-box-shadow);
	border-radius: var(--border-radius);
	&__header,
	&__footer {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: calc(var(--gap-base) * 2 * -1);
	}
	&__button {
		margin-bottom: calc(var(--gap-base) * 2);
	}
	&__citation {
		font-size: 14px;
		font-family: sans-serif;
		color: black;
		padding-left: 2rem;
		text-indent: -2rem;
		margin: 0;
	}
}
.citation-chip {
	margin-bottom: calc(var(--gap-base) * 2);
	padding: var(--gap-base) calc(var(--gap-base) * 2.5);
	color: var(--ion-color-secondary-contrast);
	background-color: var(--ion-color-secondary-shade);
	background-image: var(--theme-box-gradient-secondary);
	box-shadow: var(--theme-box-shadow);
	border-radius: 14px;
	white-space: nowrap;
}
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
	height: auto;
    --padding-start: 0;
    --padding-end: 0;
    margin: auto 0 .4em 0;
}
</style>