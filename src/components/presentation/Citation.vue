<template>
    <p class="citation" v-html="citation"></p>
</template>

<script>
export default {
    name: 'Citation',
    props: {
        citationInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            citation: 'Harwood, W. (2015, April 22). <i>How NASA fixed Hubble\'s flawed vision - and reputation</i>. Retrieved from https://www.cbsnews.com/news/an-ingenius-fix-for-hubbles-famously-flawed-vision/ [EXAMPLE]'
        }
    }
}
</script>

<style lang="scss" scoped>
.citation {
	user-select: text;
    font-size: 14px;
    font-family: sans-serif;
    color: black;
    padding-left: 2rem;
    text-indent: -2rem;
    margin: 0;
}
</style>