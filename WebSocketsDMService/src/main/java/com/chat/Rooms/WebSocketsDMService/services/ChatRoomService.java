package com.chat.Rooms.WebSocketsDMService.services;

import com.chat.Rooms.WebSocketsDMService.model.ChatRoom;
import com.chat.Rooms.WebSocketsDMService.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    // this class returns roomID between joj diyal ppl, if there is not a room ( awel marra they will message each other ) it creates the chatRoomId for exactly those 2ppl
    private final ChatRoomRepository chatRoomRepository;

    public Optional<String> getChatRoomId(
            String senderId,
            String receiverId,
            boolean createNewRoomIfNotExists
    ) {
        return chatRoomRepository
                .findBySenderIdAndReceiverId(senderId, receiverId)
                .map(ChatRoom::getChatId)
                .or(() -> {
                    if (createNewRoomIfNotExists) {
                        var chatId = createChatId(senderId, receiverId);
                        return Optional.of(chatId);
                    }

                    return Optional.empty();
                });
    }

    private String createChatId(String senderId, String receiverId) {
        var chatId = String.format("%s_%s", senderId, receiverId);

        ChatRoom senderRecipient = ChatRoom
                .builder()
                .chatId(chatId)
                .senderId(senderId)
                .receiverId(receiverId)
                .build();

        ChatRoom recipientSender = ChatRoom
                .builder()
                .chatId(chatId)
                .senderId(receiverId)
                .receiverId(senderId)
                .build();

        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recipientSender);

        return chatId;
    }
}
