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
			
			<centered-message-vue>
				<strong>Coming Soon&hellip;</strong>
			</centered-message-vue>
			
		</ion-content>
	</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import CenteredMessageVue from '@/components/layout/CenteredMessage.vue';

export default {
	name: 'Saved',
	components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, CenteredMessageVue }
}
</script>