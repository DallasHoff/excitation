<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Page Not Found</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Page Not Found</ion-title>
				</ion-toolbar>
			</ion-header>
            
            <centered-message-vue>
                <p>Oops. The page that you navigated to does not exist.</p>
                <ion-button class="theme-button-primary normal" @click="$router.go(-1)">Go Back</ion-button>
            </centered-message-vue>

		</ion-content>
	</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import CenteredMessageVue from '@/components/layout/CenteredMessage.vue';

export default {
	name: '404',
	components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, CenteredMessageVue }
}
</script>