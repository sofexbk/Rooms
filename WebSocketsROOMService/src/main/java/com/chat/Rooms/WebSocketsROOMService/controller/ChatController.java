package com.chat.Rooms.WebSocketsROOMService.controller;

import com.chat.Rooms.WebSocketsROOMService.model.RoomMessage;
import com.chat.Rooms.WebSocketsROOMService.services.RoomMessageService;
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
    private final RoomMessageService roomMessageService;

    @MessageMapping("/chat")
    //This annotation specifies that the response from this method will be sent to the destination "/user/public" the same path you should in FrontEnd to be subscribed to.
    public void processMessage(@Payload RoomMessage roomMessage) {
        roomMessage.setTimestamp(new Date());
        RoomMessage savedMsg = roomMessageService.save(roomMessage);
        messagingTemplate.convertAndSendToUser(
                roomMessage.getRoomId(), "/queue/roommessages",
                new RoomMessage(
                        savedMsg.getId(),
                        savedMsg.getRoomId(),
                        savedMsg.getSenderId(),
                        savedMsg.getContent(),
                        savedMsg.getTimestamp()
                )
        );
    }

    @GetMapping("/messages/{roomId}")
    @SendTo
    public ResponseEntity<List<RoomMessage>> findRoomMessages(@PathVariable String roomId) {
        return ResponseEntity
                .ok(roomMessageService.findRoomMessages(roomId));
    }
}