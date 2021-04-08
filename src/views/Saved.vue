<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Saved Citations</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Saved Citations</ion-title>
				</ion-toolbar>
			</ion-header>
			
			<main-content-vue>
				<section>
					<citation-list-vue 
					:citation-set="savedCitations" 
					enable-sliding>
					</citation-list-vue>
				</section>
			</main-content-vue>
			
		</ion-content>
	</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import CitationListVue from '@/components/presentation/CitationList.vue';
import MainContentVue from '@/components/layout/MainContent.vue';

export default {
	name: 'Saved',
	components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, CitationListVue, MainContentVue },
	computed: {
		savedCitations() {
			return this.$store.state.savedCitations;
		}
	}
}
</script>