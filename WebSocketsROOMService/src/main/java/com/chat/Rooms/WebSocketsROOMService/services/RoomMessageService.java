package com.chat.Rooms.WebSocketsROOMService.services;

import com.chat.Rooms.WebSocketsROOMService.model.RoomMessage;
import com.chat.Rooms.WebSocketsROOMService.repository.RoomMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomMessageService {

    private final RoomMessageRepository repository;

    public RoomMessage save(RoomMessage roomMessage) {
        repository.save(roomMessage);
        return roomMessage;
    }

    public List<RoomMessage> findRoomMessages(String roomId) {
        return repository.findByRoomId(roomId);
    }
}

