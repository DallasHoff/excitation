import { createStore } from 'vuex';

const store = createStore({
	state() {
		return {
			citationInfo: null
		}
	},
	mutations: {
		setCitationInfo(state, payload) {
			state.citationInfo = payload;
		}
	}
});

export default store