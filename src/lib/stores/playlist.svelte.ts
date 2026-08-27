// The playlist is a floating dock, opened from the header. Its state lives here
// because the toggle (header) and the player (layout) are on opposite ends of the tree.
const STORAGE_KEY = 'camihub:playlist-open';

let open = $state(false);
// Once revealed the iframe stays mounted for the rest of the session: closing the dock
// only hides it, so the music does not stop.
let mounted = $state(false);

export const playlistStore = {
	get open() {
		return open;
	},
	get mounted() {
		return mounted;
	},
	init() {
		try {
			if (localStorage.getItem(STORAGE_KEY) === 'true') {
				open = true;
				mounted = true;
			}
		} catch {
			// private mode / storage disabled — stay closed
		}
	},
	toggle() {
		open = !open;
		if (open) mounted = true;
		try {
			localStorage.setItem(STORAGE_KEY, String(open));
		} catch {
			// nothing to persist to, the toggle still works for this session
		}
	}
};
