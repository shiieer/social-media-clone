import { ScrollView } from "react-native";
import { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function MessagesList({ messages, keyboardHeight }) {
	const scrollViewRef = useRef(null);
	const [newMessageIds, setNewMessageIds] = useState(new Set());
	const previousMessageIds = useRef(new Set(messages.map(msg => msg.id)));
	const isUserScrollingRef = useRef(false);
	const isNearBottomRef = useRef(true);
	const isInitialLoadRef = useRef(true);

	// Auto-scroll to end only if user is not manually scrolling and is near bottom
	useEffect(() => {
		if (scrollViewRef.current && !isUserScrollingRef.current && isNearBottomRef.current) {
			// Small delay to ensure layout is complete
			setTimeout(() => {
				if (scrollViewRef.current && !isUserScrollingRef.current && isNearBottomRef.current) {
					// No animation on initial load, animate for new messages
					const shouldAnimate = !isInitialLoadRef.current;
					scrollViewRef.current.scrollToEnd({ animated: shouldAnimate });
					isInitialLoadRef.current = false;
				}
			}, 100);
		}
	}, [messages]);

	useEffect(() => {
		// Detect new messages by comparing IDs
		const currentIds = new Set(messages.map(msg => msg.id));
		const newIds = new Set();
		
		// Check if this is a completely new set of messages (e.g., entering a new chat)
		const isNewChat = previousMessageIds.current.size === 0 || 
			!Array.from(previousMessageIds.current).some(id => currentIds.has(id));
		
		if (isNewChat) {
			// Reset initial load flag for new chat
			isInitialLoadRef.current = true;
		}
		
		messages.forEach((msg) => {
			if (!previousMessageIds.current.has(msg.id)) {
				newIds.add(msg.id);
			}
		});

		if (newIds.size > 0) {
			setNewMessageIds(newIds);
			
			// Remove from new messages after animation completes
			setTimeout(() => {
				setNewMessageIds((prev) => {
					const updated = new Set(prev);
					newIds.forEach(id => updated.delete(id));
					return updated;
				});
			}, 400);
		}

		previousMessageIds.current = currentIds;
	}, [messages]);

	useEffect(() => {
		if (keyboardHeight > 0 && scrollViewRef.current) {
			setTimeout(() => {
				if (scrollViewRef.current && !isUserScrollingRef.current && isNearBottomRef.current) {
					scrollViewRef.current.scrollToEnd({ animated: true });
				}
			}, 100);
		}
	}, [keyboardHeight]);

	// Remove duplicates based on ID to prevent React key warnings
	// Use a Map to keep only the last occurrence of each message ID
	const uniqueMessages = messages.reduce((acc, msg, index) => {
		// If message with this ID already exists, replace it (keep the latest)
		acc.set(msg.id, { msg, index });
		return acc;
	}, new Map());
	
	// Convert back to array and sort by original index
	const deduplicatedMessages = Array.from(uniqueMessages.values())
		.sort((a, b) => a.index - b.index)
		.map(item => item.msg);

	const getMessagePosition = (index, msgList) => {
		const currentMessage = msgList[index];
		const isFirst = index === 0 || msgList[index - 1]?.isSent !== currentMessage.isSent;
		const isLast = index === msgList.length - 1 || msgList[index + 1]?.isSent !== currentMessage.isSent;
		
		return { isFirst, isLast };
	};

	const handleScrollBeginDrag = () => {
		isUserScrollingRef.current = true;
	};

	const handleScrollEndDrag = () => {
		// Keep scrolling flag true - user has manually scrolled
		// This prevents auto-scroll from interfering
		isUserScrollingRef.current = true;
	};

	const handleScroll = (event) => {
		const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
		const paddingToBottom = 100; // Threshold in pixels
		const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
		isNearBottomRef.current = isNearBottom;
		
		// If user scrolls back to bottom, allow auto-scroll again
		if (isNearBottom) {
			isUserScrollingRef.current = false;
		}
	};

	return (
		<ScrollView
			ref={scrollViewRef}
			style={{ flex: 1 }}
			contentContainerStyle={{ 
				paddingVertical: 16,
				paddingHorizontal: 16,
			}}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={true}
			nestedScrollEnabled={true}
			onScrollBeginDrag={handleScrollBeginDrag}
			onScrollEndDrag={handleScrollEndDrag}
			onScroll={handleScroll}
			scrollEventThrottle={16}
		>
			{deduplicatedMessages.map((msg, index) => {
				const { isFirst, isLast } = getMessagePosition(index, deduplicatedMessages);
				const nextMessage = deduplicatedMessages[index + 1];
				const isSameGroup = nextMessage && nextMessage.isSent === msg.isSent;
				
				return (
					<MessageBubble
						key={msg.id}
						message={msg}
						isSent={msg.isSent}
						isNew={newMessageIds.has(msg.id)}
						isFirst={isFirst}
						isLast={isLast}
						marginBottom={isSameGroup ? 2 : 16}
						isRead={msg.isRead !== false}
					/>
				);
			})}
		</ScrollView>
	);
}

