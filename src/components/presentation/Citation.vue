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
    methods: {
        dateInfo(timestamp) {
            if (!timestamp) return null;
            const date = new Date(timestamp);
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const parts = {
                D: date.getDate() <= 9 ? '0' + date.getDate() : date.getDate(),
                d: date.getDate(),
                M: months[date.getMonth()],
                m: monthsShort[date.getMonth()],
                Y: date.getFullYear()
            };
            const formats = {
                dmY: `${parts.d} ${parts.m}. ${parts.Y}`,
                YMd: `${parts.Y}, ${parts.M} ${parts.d}`,
                MdY: `${parts.M} ${parts.d}, ${parts.Y}`
            };
            return {
                ...parts,
                ...formats
            };
        }
    },
    computed: {
        citationFormat() {
            return this.citationInfo.format;
        },
        sourceType() {
            return this.citationInfo.type;
        },
        pubDate() {
            return this.dateInfo(this.citationInfo.source.publishedTime);
        },
        modDate() {
            return this.dateInfo(this.citationInfo.source.modifiedTime);
        },
        accessDate() {
            return this.dateInfo(this.citationInfo.sourceRetrievedTime);
        },
        authors() {
            let authors = '';
            const authorList = this.citationInfo.source.authors;
            const num = authorList.length;

            const initial = name => name ? name.charAt(0) + '.' : '';
            const p = (authorIndex, partKey, format) => {
                /* format parameter allows invocations of p to be composed in a way that
                   other parts of the name are dependent on the outer invocation's part
                   (e.g. not showing the middle name unless the first name is supplied). 
                   This is also the way to tie commas, spaces, and other separators
                   to the name part. If the name part is not supplied, nothing will output. 
                   % in the format string is where the name part will be placed. */
                let part = '';
                const nameObj = authorList[authorIndex];
                if (!nameObj) return part;
                const { first, middle, last, suffix } = nameObj;
                const parts = {
                    F: !!first && first.length === 1 ? initial(first) : first,
                    M: !!middle && middle.length === 1 ? initial(middle) : middle,
                    L: !!last && last.length === 1 ? initial(last) : last,
                    S: !!suffix && suffix.length === 1 ? initial(suffix) : suffix,
                    f: initial(first),
                    m: initial(middle),
                    l: initial(last),
                    s: initial(suffix)
                };
                if (partKey in parts && !!parts[partKey]) {
                    part = format ? format.replaceAll('%', parts[partKey]) : parts[partKey];
                }
                return part;
            };

            switch (this.citationFormat) {

                case 'mla': {
                    const firstAuthor = p(0,'L',`%${p(0,'F',`, %${p(0,'m',` %`)}`)}${p(0,'S',`, %`)}`);
                    const secondAuthor = p(1,'L',`${p(1,'F',`%${p(1,'m',` %`)} `)}%${p(1,'S',` %`)}`);
                    if (num === 1) {
                        authors = firstAuthor;
                    } else if (num === 2) {
                        authors = `${firstAuthor} and ${secondAuthor}`;
                    } else if (num >= 3) {
                        authors = `${firstAuthor}, et al`;
                    }
                    if (authors && authors.slice(-1) !== '.') {
                        authors += '.';
                    }
                    break;
                }

                case 'apa': {
                    const formattedAuthors = authorList.map((a, i) => p(i,'L',`%${p(i,'f',`, %${p(i,'m',` %`)}`)}${p(i,'S',`, %`)}`));
                    if (num === 1) {
                        authors = formattedAuthors[0];
                    } else if (num >= 2 && num <= 20) {
                        formattedAuthors[formattedAuthors.length - 1] = `&amp; ${formattedAuthors[formattedAuthors.length - 1]}`;
                        authors = formattedAuthors.join(', ');
                    } else if (num > 20) {
                        const lastAuthor = `&hellip; ${formattedAuthors[formattedAuthors.length - 1]}`;
                        const twentyAuthors = formattedAuthors.slice(0, 19);
                        twentyAuthors.push(lastAuthor);
                        authors = twentyAuthors.join(', ');
                    }
                    if (authors && authors.slice(-1) !== '.') {
                        authors += '.';
                    }
                    break;
                }

                case 'chicago': {
                    const firstAuthor = p(0,'L',`%${p(0,'F',`, %${p(0,'m',` %`)}`)}${p(0,'S',`, %`)}`);
                    const formattedAuthors = authorList.map((a, i) => p(i,'L',`${p(i,'F',`%${p(i,'m',` %`)} `)}%${p(i,'S',` %`)}`));
                    if (num === 1) {
                        authors = firstAuthor;
                    } else if (num >= 2 && num <= 10) {
                        formattedAuthors[0] = firstAuthor;
                        formattedAuthors[formattedAuthors.length - 1] = `and ${formattedAuthors[formattedAuthors.length - 1]}`;
                        authors = formattedAuthors.join(', ');
                    } else if (num > 10) {
                        const sevenAuthors = formattedAuthors.slice(0, 7);
                        sevenAuthors[0] = firstAuthor;
                        authors = `${sevenAuthors.join(', ')}, et al`;
                    }
                    if (authors && authors.slice(-1) !== '.') {
                        authors += '.';
                    }
                    break;
                }
                
            }

            return authors;
        },
        citation() {
            let citation = '';
            const { title, publisher, url } = this.citationInfo.source;
            const allowedTags = ['cite'];
            const allowedAttributes = [];

            // Construct citation
            const f = (str, format) => str ? format.replaceAll('%', str) : '';
            const j = (str1, sep, str2) => `${str1}${str1 && str2 ? sep : ''}${str2}`;

            switch (this.citationFormat) {

                case 'mla': {
                    switch (this.sourceType) {
                        case 'webpage': {
                            citation = `${f(this.authors,'% ')}${f(title,'&ldquo;%.&rdquo;')}${j(j(f(publisher,' <cite>%</cite>'),',',f(this.pubDate?.dmY,' %')),',',f(url,' %'))}${publisher || this.pubDate?.dmY || url ? '.' : ''}${!this.pubDate?.dmY ? f(this.accessDate?.dmY,' Accessed %.') : ''}`;
                            break;
                        }
                        case 'book': {
                            citation = `${f(this.authors,'% ')}${f(title,'<cite>%.</cite>')}${j(f(publisher,' %'),',',f(this.pubDate?.Y,' %'))}${publisher || this.pubDate?.Y ? '.' : ''}`;
                            break;
                        }
                    }
                    break;
                }

                case 'apa': {
                    switch (this.sourceType) {
                        case 'webpage': {
                            if (!this.authors) {
                                citation = `${f(title,'<cite>%.</cite>')}${f(this.pubDate?.YMd || 'n.d.',' (%).')}${f(publisher,' %.')}${f(url,` ${f(this.accessDate?.MdY,'Retrieved %, from ')}%`)}`;
                            } else {
                                citation = `${f(this.authors,'% ')}${f(this.pubDate?.YMd || 'n.d.','(%). ')}${f(title,'<cite>%.</cite>')}${f(publisher,' %.')}${f(url,` ${f(this.accessDate?.MdY,'Retrieved %, from ')}%`)}`;
                            }
                            break;
                        }
                        case 'book': {
                            if (!this.authors) {
                                citation = `${f(title,'<cite>%.</cite>')}${f(this.pubDate?.Y || 'n.d.',' (%).')}${f(publisher,' %.')}`;
                            } else {
                                citation = `${f(this.authors,'% ')}${f(this.pubDate?.Y || 'n.d.','(%). ')}${f(title,'<cite>%.</cite>')}${f(publisher,' %.')}`;
                            }
                            break;
                        }
                    }
                    break;
                }

                case 'chicago': {
                    switch (this.sourceType) {
                        case 'webpage': {
                            if (!this.authors) {
                                citation = `${f(publisher,'%. ')}${f(title,'&ldquo;%.&rdquo;')}${this.pubDate?.MdY ? f(this.pubDate?.MdY,' %.') : f(this.accessDate?.MdY,' Accessed %.')}${f(url,' %.')}`;
                            } else {
                                citation = `${f(this.authors,'% ')}${f(title,'&ldquo;%.&rdquo;')}${f(publisher,' %.')}${this.pubDate?.MdY ? f(this.pubDate?.MdY,' %.') : f(this.accessDate?.MdY,' Accessed %.')}${f(url,' %.')}`;
                            }
                            break;
                        }
                        case 'book': {
                            citation = `${f(this.authors,'% ')}[TODO]`;
                            break;
                        }
                    }
                    break;
                }

            }

            // Sanitize citation HTML
			// Parse citation HTML into DOM fragment and check each contained element
			const citationDom = document.createRange().createContextualFragment(citation);
			const citationElems = citationDom.querySelectorAll('*');
			citationElems.forEach(el => {
				const elTag = el.tagName.toLowerCase();
				if (allowedTags.indexOf(elTag) < 0) {
					// Remove elements not whitelisted, leaving their contents
					el.replaceWith(...el.childNodes);
				} else {
					// Remove attributes not whitelisted from whitelisted elements
					[...el.attributes].forEach(attr => {
						if (allowedAttributes.indexOf(attr.name) < 0) {
							el.removeAttribute(attr.name);
						}
					});
				}
			});

			// Convert DOM fragment back to HTML string and return it
			const citationTempEl = document.createElement('span');
			citationTempEl.appendChild(citationDom.cloneNode(true));
            citation = citationTempEl.innerHTML;

            return citation;
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