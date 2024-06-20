package com.codingworld.apigateway;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class test {
    @GetMapping("/api/messageClient")
    public String get(){
        return "Message from company client yeeeh";
    }
}
