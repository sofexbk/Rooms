package com.chat.Rooms.WebSocketsDMService.controller;

import com.chat.Rooms.WebSocketsDMService.model.ChatMessage;
import com.chat.Rooms.WebSocketsDMService.model.ChatNotification;
import com.chat.Rooms.WebSocketsDMService.services.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Date;
import java.util.List;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    //This annotation specifies that the response from this method will be sent to the destination "/user/public" the same path you should in FrontEnd to be subscribed to.
    public void processMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(new Date());
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId(), "/queue/messages",
                new ChatNotification(
                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getReceiverId(),
                        savedMsg.getContent(),
                        savedMsg.getTimestamp()
                )
        );
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    @SendTo
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String senderId,
                                                              @PathVariable String receiverId) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, receiverId));
    }

}