import { createStore } from 'vuex';

const store = createStore({
	state() {
		return {
			citationFormats: {
				mla: 'MLA',
				apa: 'APA',
				chicago: 'Chicago'
			},
			sourceTypes: {
				webpage: 'Web Page',
				book: 'Book'
			},
			citationInfo: null
		}
	},
	mutations: {
		setCitationInfo(state, payload) {
			state.citationInfo = payload;
		}
	}
});

export default store;