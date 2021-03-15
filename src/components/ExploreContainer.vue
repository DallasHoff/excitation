<template>
	<div id="container">
		<div>
			<strong>{{ name }}</strong>
			<ion-text color="medium">
				<p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
			</ion-text>
		</div>
	</div>
</template>

<script>
import { IonText } from '@ionic/vue';

export default {
	name: 'ExploreContainer',
	components: { IonText },
	props: {
		name: String
	}
}
</script>

<style lang="scss" scoped>
#container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	text-align: center;
	strong {
		font-size: 20px;
		line-height: 26px;
	}
	p {
		font-size: 16px;
		line-height: 22px;
		margin: 0;
	}
	a {
		text-decoration: none;
	}
}
</style>