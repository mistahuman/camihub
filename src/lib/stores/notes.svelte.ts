// Scratchpad. One sheet of text, debounced autosave to localStorage.
const LS_KEY = 'camihub-notes';
const SAVE_DELAY = 500;

let text = $state('');
let savedAt = $state<number | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave() {
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => {
		try {
			localStorage.setItem(LS_KEY, text);
			savedAt = Date.now();
		} catch {
			// storage full or blocked — keep the text in memory, nothing else to do
		}
	}, SAVE_DELAY);
}

export const notesStore = {
	get text() {
		return text;
	},
	set text(v: string) {
		text = v;
		scheduleSave();
	},
	get savedAt() {
		return savedAt;
	},

	init() {
		try {
			const stored = localStorage.getItem(LS_KEY);
			if (stored !== null) {
				text = stored;
				savedAt = Date.now();
			}
		} catch {
			text = '';
		}
	},

	clear() {
		if (timer) clearTimeout(timer);
		text = '';
		savedAt = null;
		localStorage.removeItem(LS_KEY);
	}
};
