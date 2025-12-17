// hooks/useSuggestedUsers.jsx
import { useState, useEffect, useCallback } from "react";
import { ChatApi } from "../api/chat/ChatApi";

/**
 * Custom hook to manage suggested users
 * @param {string} accessToken - User access token
 * @returns {Object} { suggestedUsers, filteredUsers, loading, error, fetchSuggestedUsers, searchQuery, setSearchQuery }
 */
export function useSuggestedUsers(accessToken) {
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		if (searchQuery.trim()) {
			const filtered = suggestedUsers.filter((user) =>
				user.username.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredUsers(filtered);
		} else {
			setFilteredUsers(suggestedUsers);
		}
	}, [searchQuery, suggestedUsers]);

	const fetchSuggestedUsers = useCallback(async () => {
		if (!accessToken) return;

		try {
			setLoading(true);
			setError(null);
			const result = await ChatApi.getSuggestedUsers(accessToken);

			if (result.success) {
				setSuggestedUsers(result.data);
				setFilteredUsers(result.data);
			} else {
				setError(result.error || "Failed to load suggested users");
			}
		} catch (err) {
			console.error("Error fetching suggested users:", err);
			setError("Failed to load suggested users");
		} finally {
			setLoading(false);
		}
	}, [accessToken]);

	return {
		suggestedUsers,
		filteredUsers,
		loading,
		error,
		fetchSuggestedUsers,
		searchQuery,
		setSearchQuery,
	};
}

