<template>
	<ion-app>
		<ion-router-outlet swipeGesture="false" />
	</ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'App',
	components: {
		IonApp,
		IonRouterOutlet
	},
	created() {
		// Initialize list of saved citations
		this.$store.commit('initSavedCitations');
	}
});
</script>