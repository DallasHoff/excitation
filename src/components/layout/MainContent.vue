<template>
    <article id="main-content">
		<slot></slot>
    </article>
</template>

<script>
export default {
    name: 'MainContent'
}
</script>

<style>
#main-content {
    max-width: var(--content-width);
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto;
    gap: calc(var(--content-padding) * 2);
    margin: 0 auto;
	padding: var(--content-padding);
}
</style>