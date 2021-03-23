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
					{{ citationInfo }}<!-- TODO -->
                </section>
            </main-content-vue>
			
		</ion-content>
	</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/vue';
import MainContentVue from '@/components/layout/MainContent.vue';

export default {
	name: 'Citation',
	components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonBackButton, MainContentVue },
    computed: {
        citationInfo() {
            return this.$store.state.citationInfo;
        }
    },
	created() {
		// Redirect to home if state has no citation info
		if (!this.citationInfo) {
			this.$router.push('/home');
		}
	}
}
</script>