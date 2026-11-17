/**
 * Git module to be used on production build results.
 * The API is based on inlined git information.
 */

import type { GitAPI, getAllNewestCommitDate } from './git';

type InlinedData = ReturnType<typeof getAllNewestCommitDate>;

export const makeAPI = (data: InlinedData): GitAPI => {
	// Compare file names in Unicode NFC form, as git returns them exactly as they were committed while
	// the file system can return them in a different form, e.g. decomposed (NFD) on macOS.
	const trackedDocsFiles = new Map(
		data.map(([file, timestamp]) => [file.normalize('NFC'), timestamp])
	);

	return {
		getNewestCommitDate: (file) => {
			const timestamp = trackedDocsFiles.get(file.normalize('NFC'));
			if (!timestamp) throw new Error(`Failed to retrieve the git history for file "${file}"`);
			return new Date(timestamp);
		},
	};
};
