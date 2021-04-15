import { createStore } from 'vuex';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const maxStoredCitations = 200;
const savedCitationsStorageKey = 'savedCitations';

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
			citationInfo: null,
			savedCitations: []
		}
	},
	mutations: {
		setCitationInfo(state, payload) {
			state.citationInfo = payload;
		},
		async initSavedCitations(state) {
			try {
				const storedCitations = await Storage.get({key: savedCitationsStorageKey});
				state.savedCitations = storedCitations?.value ? JSON.parse(storedCitations.value) : [];
			} catch (err) {
				console.warn(err);
			}
		},
		async saveCitation(state, payload) {
			// Add new citation
			const payloadCopy = JSON.parse(JSON.stringify(payload));
			payloadCopy.savedTime = new Date().toISOString();
			state.savedCitations.unshift(payloadCopy);
			state.savedCitations.splice(maxStoredCitations);
			// Update stored list
			const updatedList = JSON.stringify(state.savedCitations);
			try {
				await Storage.set({key: savedCitationsStorageKey, value: updatedList});
			} catch (err) {
				console.warn(err);
			}
		},
		async deleteCitation(state, index) {
			// Remove citation by index
			state.savedCitations.splice(index, 1);
			// Update stored list
			const updatedList = JSON.stringify(state.savedCitations);
			try {
				await Storage.set({key: savedCitationsStorageKey, value: updatedList});
			} catch (err) {
				console.warn(err);
			}
		}
	}
});

export default store;