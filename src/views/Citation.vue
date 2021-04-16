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
		<ion-content>
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
						<ion-img 
						v-if="showSourceImg && citationInfo?.source?.image"
						:src="citationInfo.source.image" 
						alt="" 
						@ion-img-did-load="showSourceImg = true" 
						@ion-error="showSourceImg = false" 
						class="citation-box__bg">
						</ion-img>
						<div 
						class="citation-box__inner" 
						:class="{'citation-box__inner--image': showSourceImg && !!citationInfo?.source?.image}">
							<div class="citation-box__header">
								<div 
								v-if="citationInfo?.format"
								class="citation-chip citation-chip--select">
									<ion-select 
									class="normal" 
									:interface-options="{header: 'Format'}" 
									v-model="citationInfo.format">
										<ion-select-option 
										v-for="format, formatKey in citationFormats" 
										:value="formatKey" 
										:key="formatKey">
											{{ format }}
										</ion-select-option>
									</ion-select>
								</div>
								<gap-vue :size="2" direction="inline" v-if="citationInfo?.format"></gap-vue>
								<div 
								v-if="citationInfo?.type"
								class="citation-chip">
									{{ sourceTypes[citationInfo.type] }}
								</div>
							</div>
							
							<gap-vue :size="4"></gap-vue>
							<citation-vue 
							:citation-info="citationInfo" 
							ref="citation">
							</citation-vue>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonDatetime, IonButton, IonSelect, IonSelectOption, IonImg } from '@ionic/vue';
import MainContentVue from '@/components/layout/MainContent.vue';
import InputLabelVue from '@/components/forms/InputLabel.vue';
import GapVue from '@/components/layout/Gap.vue';
import CitationVue from '@/components/presentation/Citation.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faTimes, faCopy, faBookmark, faCheck } from '@fortawesome/pro-regular-svg-icons';
library.add(faPlus, faTimes, faCopy, faBookmark, faCheck);

export default {
	name: 'Citation',
	components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonDatetime, IonButton, IonSelect, IonSelectOption, IonImg, MainContentVue, InputLabelVue, GapVue, CitationVue },
	data() {
		return {
			showSourceImg: true,
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
		async copyCitation() {
			const copyHTML = this.$refs.citation.$el.innerHTML;
			const copyText = this.$refs.citation.$el.innerText;
			try {
				if (!!navigator?.clipboard?.write && !!window?.ClipboardItem) {
					await navigator.clipboard.write([
						new window.ClipboardItem({
							'text/html': new Blob(
								[ copyHTML ],
								{ type: 'text/html' }
							),
							'text/plain': new Blob(
								[ copyText ],
								{ type: 'text/plain' }
							)
						})
					]);
				} else {
					const listener = (evt) => {
						evt.clipboardData.setData('text/html', copyHTML);
						evt.clipboardData.setData('text/plain', copyText);
						evt.preventDefault();
					};
					document.addEventListener('copy', listener);
					document.execCommand('copy');
					document.removeEventListener('copy', listener);
				}
			} catch(err) {
				console.warn(err);
			}
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
	--citation-gradient: linear-gradient(180deg, rgb(241 241 241 / 80%), rgb(210 210 210 / 80%));
	position: relative;
	background-color: rgba(233, 233, 233, .85);
	background-image: var(--citation-gradient);
	box-shadow: var(--theme-box-shadow);
	border-radius: var(--border-radius);
	overflow: hidden;
	&__bg {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 60%;
		height: 100%;
		object-fit: cover;
		object-position: right center;
	}
	&__inner {
		position: relative;
		padding: calc(var(--gap-base) * 4) calc(var(--gap-base) * 3);
		background-color: rgba(255, 255, 255, .6);
		&--image {
			background-image: linear-gradient(60deg, white 50%, transparent);
		}
	}
	&__header,
	&__footer {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: calc(var(--gap-base) * 2 * -1);
	}
	&__button {
		margin-bottom: calc(var(--gap-base) * 2);
	}
}
.citation-chip {
	margin-bottom: calc(var(--gap-base) * 2);
	padding: var(--gap-base) calc(var(--gap-base) * 3);
	color: black;
	background-color: var(--ion-color-medium);
	background-image: var(--citation-gradient);
	box-shadow: var(--theme-box-shadow);
	border-radius: 14px;
	white-space: nowrap;
	&--select {
		padding: var(--gap-base) calc(var(--gap-base) * 1);
	}
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
.ion-page-hidden .author-input-group {
	/* Disable transition during route change */
	transition-duration: 0s;
}
.remove-author-button {
	font-size: 1.4em;
	height: auto;
    --padding-start: 0;
    --padding-end: 0;
    margin: auto 0 .4em 0;
}
</style>