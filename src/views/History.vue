<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>History</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">History</ion-title>
				</ion-toolbar>
			</ion-header>
			
			<centered-message>
				<strong>Coming Soon&hellip;</strong>
			</centered-message>
		</ion-content>
	</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import CenteredMessage from '@/components/layout/CenteredMessage.vue';

export default  {
	name: 'History',
	components: { CenteredMessage, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>