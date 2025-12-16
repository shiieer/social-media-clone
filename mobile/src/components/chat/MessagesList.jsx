import { ScrollView } from "react-native";
import { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function MessagesList({ messages, keyboardHeight }) {
	const scrollViewRef = useRef(null);
	const [newMessageIds, setNewMessageIds] = useState(new Set());
	const previousMessageIds = useRef(new Set(messages.map(msg => msg.id)));

	useEffect(() => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true });
		}
	}, [messages]);

	useEffect(() => {
		// Detect new messages by comparing IDs
		const currentIds = new Set(messages.map(msg => msg.id));
		const newIds = new Set();
		
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
				if (scrollViewRef.current) {
					scrollViewRef.current.scrollToEnd({ animated: true });
				}
			}, 100);
		}
	}, [keyboardHeight]);

	const getMessagePosition = (index) => {
		const currentMessage = messages[index];
		const isFirst = index === 0 || messages[index - 1]?.isSent !== currentMessage.isSent;
		const isLast = index === messages.length - 1 || messages[index + 1]?.isSent !== currentMessage.isSent;
		
		return { isFirst, isLast };
	};

	return (
		<ScrollView
			ref={scrollViewRef}
			className="flex-1 px-4"
			contentContainerStyle={{ paddingVertical: 16 }}
			keyboardShouldPersistTaps="handled"
		>
			{messages.map((msg, index) => {
				const { isFirst, isLast } = getMessagePosition(index);
				const nextMessage = messages[index + 1];
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
					/>
				);
			})}
		</ScrollView>
	);
}

