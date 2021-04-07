<template>
	<ion-app>
		<ion-router-outlet />
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
	},
	mounted() {
		// Scroll content when keyboard opens or closes
		window.addEventListener('ionKeyboardDidShow', () => {
			document.activeElement.scrollIntoView({behavior: 'smooth'});
		});
		window.addEventListener('ionKeyboardDidHide', () => {
			document.querySelector('ion-header').scrollIntoView({behavior: 'smooth'});
		});
	}
});
</script>