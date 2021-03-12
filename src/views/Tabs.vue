<template>
	<ion-page>
		<ion-tabs>
			<ion-tab-bar>
				<ion-tab-button tab="home" href="/home">
					<fa class="tab-button-icon" :icon="['far', 'home']" size="2x" fixed-width></fa>
					<ion-label>Home</ion-label>
				</ion-tab-button>
				
				<ion-tab-button tab="history" href="/history">
					<fa class="tab-button-icon" :icon="['far', 'history']" size="2x" fixed-width></fa>
					<ion-label>History</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonPage } from '@ionic/vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faHistory } from '@fortawesome/pro-regular-svg-icons';
library.add(faHome, faHistory);

export default {
	name: 'Tabs',
	components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonPage }
}
</script>

<style scoped>
.tab-button-icon {
	margin-top: 2px;
	margin-bottom: 4px;
}
</style>