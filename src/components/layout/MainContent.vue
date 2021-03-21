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
    max-width: 540px;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto;
    gap: calc(var(--gap-base) * 8);
    margin: 0 auto;
	padding: calc(var(--gap-base) * 4);
}
</style>