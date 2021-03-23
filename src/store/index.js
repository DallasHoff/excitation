import { createStore } from 'vuex';

const store = createStore({
	state() {
		return {
			sourceToCite: {}
		}
	},
	mutations: {
		setSourceToCite(state, payload) {
			state.sourceToCite = payload;
		}
	}
});

export default store