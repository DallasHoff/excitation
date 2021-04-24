<template>
	<div 
	class="main-content" 
	:class="{'main-content--sidebar': showSidebar}">
		<article class="main-content__article">
			<slot></slot>
		</article>
		<aside 
		v-if="showSidebar" 
		class="main-content__aside" 
		:class="{'main-content--sidebar__aside': showSidebar}">
			<section>
				<h2>Saved Citations</h2>
				<citation-list-vue 
				v-if="savedCitations?.length > 0" 
				:citation-set="savedCitations" 
				enable-sliding>
				</citation-list-vue>
				<p 
				v-else 
				class="content-text">
					You do not have any citations saved. Once you save some citations, you will be able to refer to them here.
				</p>
			</section>
		</aside>
	</div>
</template>

<script>
import CitationListVue from '@/components/presentation/CitationList.vue';

export default {
	name: 'MainContent',
	components: { CitationListVue },
	props: {
		noSidebar: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		savedCitations() {
			return this.$store.state.savedCitations;
		},
		showSidebar() {
			return !this.noSidebar;
		}
	}
}
</script>

<style lang="scss" scoped>
.main-content {
	max-width: var(--content-width);
	padding: var(--content-padding);
	margin: 0 auto;
	&__article {
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: auto;
		align-content: start;
		gap: calc(var(--content-padding) * 2);
	}
	&__aside {
		display: none;
		grid-template-columns: 100%;
		grid-template-rows: auto;
		align-content: start;
		gap: calc(var(--content-padding) * 2);
		section {
			--ion-background-color: var(--ion-color-light);
			background-color: var(--ion-background-color);
			border-radius: var(--border-radius);
			padding: 0 var(--content-padding) var(--border-radius);
		}
	}
}
.content-text {
	color: var(--theme-text-color);
}

@media only screen and (min-width: 1024px) {
	.main-content--sidebar {
		--content-width: 1024px;
		display: grid;
		grid-template-columns: 60% minmax(0, 1fr);
		grid-template-rows: auto;
		gap: calc(var(--content-padding) * 2);
		padding: calc(var(--content-padding) * 2);
		&__aside {
			display: grid;
		}
	}
}
</style>