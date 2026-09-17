// Scratchpad. Several notes, one active at a time, debounced autosave to localStorage.
const LS_KEY = 'camihub-notes-list';
// Pre-multi-note key: a single plain string. Migrated into the first note on init.
const LEGACY_KEY = 'camihub-notes';
const SAVE_DELAY = 500;

export type Note = {
	id: number;
	text: string;
	updatedAt: number;
};

type Stored = { notes: Note[]; activeId: number };

function blank(): Note {
	return { id: Date.now(), text: '', updatedAt: Date.now() };
}

// Start with one blank note so `active` is never undefined, even before init().
const first = blank();
let notes = $state<Note[]>([first]);
let activeId = $state(first.id);
let savedAt = $state<number | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

function persist() {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify({ notes, activeId } satisfies Stored));
		savedAt = Date.now();
	} catch {
		// storage full or blocked — keep the notes in memory, nothing else to do
	}
}

function scheduleSave() {
	if (timer) clearTimeout(timer);
	timer = setTimeout(persist, SAVE_DELAY);
}

function saveNow() {
	if (timer) clearTimeout(timer);
	persist();
}

export function noteTitle(note: Note): string {
	const line = note.text.split('\n').find((l) => l.trim() !== '');
	return line?.trim() || 'Untitled';
}

export const notesStore = {
	get notes() {
		return notes;
	},
	get active() {
		return notes.find((n) => n.id === activeId) ?? notes[0];
	},
	get text() {
		return this.active.text;
	},
	set text(v: string) {
		const note = this.active;
		note.text = v;
		note.updatedAt = Date.now();
		scheduleSave();
	},
	get savedAt() {
		return savedAt;
	},

	init() {
		try {
			const stored = localStorage.getItem(LS_KEY);
			if (stored) {
				const parsed: Stored = JSON.parse(stored);
				if (parsed.notes?.length) {
					notes = parsed.notes;
					activeId = parsed.activeId;
					savedAt = Date.now();
				}
				return;
			}
			const legacy = localStorage.getItem(LEGACY_KEY);
			if (legacy) {
				notes = [{ ...blank(), text: legacy }];
				activeId = notes[0].id;
				saveNow();
				localStorage.removeItem(LEGACY_KEY);
			}
		} catch {
			// corrupt or unreadable storage — keep the blank note
		}
	},

	select(id: number) {
		if (id === activeId) return;
		activeId = id;
		saveNow();
	},

	create() {
		const note = blank();
		notes = [note, ...notes];
		activeId = note.id;
		saveNow();
	},

	// Deletes the active note. The last one is emptied instead, so there is always a sheet.
	remove() {
		if (notes.length === 1) {
			notes = [blank()];
			activeId = notes[0].id;
		} else {
			const index = notes.findIndex((n) => n.id === activeId);
			notes = notes.filter((n) => n.id !== activeId);
			activeId = notes[Math.min(index, notes.length - 1)].id;
		}
		saveNow();
	}
};
