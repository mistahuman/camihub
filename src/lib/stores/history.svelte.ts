// Copy history for the String tool. Ported from forge-string.
const LS_KEY = 'camihub-string-history';
const MAX_HISTORY = 5;

export type HistoryEntry = {
	id: number;
	output: string;
	operatorLabel: string;
	tokenCount: number;
};

let entries = $state<HistoryEntry[]>([]);
let open = $state(false);

export const historyStore = {
	get entries() {
		return entries;
	},
	get open() {
		return open;
	},
	set open(v: boolean) {
		open = v;
	},

	init() {
		try {
			const stored = localStorage.getItem(LS_KEY);
			if (stored) entries = JSON.parse(stored);
		} catch {
			entries = [];
		}
	},

	save(entry: HistoryEntry) {
		const deduped = entries.filter((h) => h.output !== entry.output);
		entries = [entry, ...deduped].slice(0, MAX_HISTORY);
		localStorage.setItem(LS_KEY, JSON.stringify(entries));
	},

	clear() {
		entries = [];
		localStorage.removeItem(LS_KEY);
	}
};
