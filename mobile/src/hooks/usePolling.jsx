// hooks/usePolling.jsx
import { useRef, useCallback } from "react";

/**
 * Custom hook for polling mechanism
 * @param {Function} callback - Function that will be called on each interval
 * @param {number} interval - Interval in milliseconds (default: 2000)
 * @returns {Object} { startPolling, stopPolling, isPolling }
 */
export function usePolling(callback, interval = 2000) {
	const pollingIntervalRef = useRef(null);
	const isPollingRef = useRef(false);

	const startPolling = useCallback(() => {
		// Stop existing polling if any
		stopPolling();

		if (!callback) return;

		// Start polling
		pollingIntervalRef.current = setInterval(() => {
			if (!isPollingRef.current) {
				isPollingRef.current = true;
				Promise.resolve(callback())
					.finally(() => {
						isPollingRef.current = false;
					});
			}
		}, interval);
	}, [callback, interval]);

	const stopPolling = useCallback(() => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
		}
		isPollingRef.current = false;
	}, []);

	return {
		startPolling,
		stopPolling,
		isPolling: isPollingRef.current,
	};
}

