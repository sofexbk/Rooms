package com.chat.Rooms.WebSocketsROOMService.model;

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

public class RoomMessage {
    @Id
    private String id;
    private String roomId;
    private String senderId;
    private String content;
    private Date timestamp;
}
