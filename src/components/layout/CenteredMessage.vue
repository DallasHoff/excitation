<template>
    <div id="centered-message">
		<div>
			<slot></slot>
		</div>
    </div>
</template>

<script>
export default {
    name: 'CenteredMessage'
}
</script>

<style>
#centered-message {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	text-align: center;
	padding: 2rem;
}
</style>