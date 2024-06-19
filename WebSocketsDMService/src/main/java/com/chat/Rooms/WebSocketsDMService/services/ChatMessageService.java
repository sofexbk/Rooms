package com.chat.Rooms.WebSocketsDMService.services;

import com.chat.Rooms.WebSocketsDMService.model.ChatMessage;
import com.chat.Rooms.WebSocketsDMService.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getReceiverId(), true)
                .orElseThrow();

        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderId, String receiverId) {
        var chatId = chatRoomService.getChatRoomId(senderId, receiverId, false);
        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }
}

