<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home"></ion-back-button>
                </ion-buttons>
				<ion-title>Saved Citations</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Saved Citations</ion-title>
				</ion-toolbar>
			</ion-header>
			
			<main-content-vue v-if="savedCitations?.length > 0" no-sidebar>
				<section>
					<citation-list-vue 
					:citation-set="savedCitations" 
					enable-sliding>
					</citation-list-vue>
				</section>
			</main-content-vue>

			<centered-message-vue v-else>
				<p>You do not have any citations saved. Once you save some citations, you will be able to refer to them here.</p>
                <ion-button class="theme-button-primary normal" @click="$router.push('/home')">Make a Citation</ion-button>
			</centered-message-vue>
			
		</ion-content>
	</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton } from '@ionic/vue';
import CitationListVue from '@/components/presentation/CitationList.vue';
import MainContentVue from '@/components/layout/MainContent.vue';
import CenteredMessageVue from '@/components/layout/CenteredMessage.vue';

export default {
	name: 'Saved',
	components: { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonPage, IonButton, CitationListVue, MainContentVue, CenteredMessageVue },
	computed: {
		savedCitations() {
			return this.$store.state.savedCitations;
		}
	}
}
</script>