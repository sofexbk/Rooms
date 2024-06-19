package com.chat.Rooms.WebSocketsDMService.model;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Builder

public class ChatMessage {
    @Id
    private String id;
    private String chatId;
    private String senderId;
    private String receiverId;
    private String content;
    private Date timestamp;
}
