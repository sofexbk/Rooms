package com.chat.Rooms.WebSocketsROOMService.repository;

import com.chat.Rooms.WebSocketsROOMService.model.RoomMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomMessageRepository extends MongoRepository<RoomMessage, String> {
    List<RoomMessage> findByRoomId(String roomId);
}