package com.luv2code.messageservice.controller;

import com.luv2code.messageservice.entity.Message;
import com.luv2code.messageservice.requestmodels.AdminQuestionRequest;
import com.luv2code.messageservice.service.MessagesService;
import com.luv2code.messageservice.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessagesController {

    private MessagesService messagesService;

    @Autowired
    public MessagesController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value = "Authorization") String token, @RequestBody Message messageRequest) {
        // Lấy userEmail từ request body thay vì từ JWT
        String userEmail = messageRequest.getUserEmail();
        
        System.out.println("=== DEBUG MESSAGE CREATION ===");
        System.out.println("Token: " + token);
        System.out.println("UserEmail from request body: " + userEmail);
        System.out.println("Title: " + messageRequest.getTitle());
        System.out.println("Question: " + messageRequest.getQuestion());
        System.out.println("=============================");
        
        // Kiểm tra userEmail có hợp lệ không
        if (userEmail == null || userEmail.isEmpty()) {
            System.err.println("ERROR: userEmail is null or empty in request body!");
            return;
        }
        
        messagesService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
public void putMessage(@RequestHeader(value = "Authorization") String token,
        @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
    
    // Hardcode admin email thay vì extract từ JWT
    String adminEmail = "admin@cfc.com";
    
    System.out.println("=== DEBUG ADMIN RESPONSE ===");
    System.out.println("Admin email: " + adminEmail);
    System.out.println("Message ID: " + adminQuestionRequest.getId());
    System.out.println("Response: " + adminQuestionRequest.getResponse());
    System.out.println("Request body: " + adminQuestionRequest.toString());
    System.out.println("===========================");
    
    // Kiểm tra ID có hợp lệ không
    if (adminQuestionRequest.getId() == null || adminQuestionRequest.getId() <= 0) {
        System.err.println("ERROR: Invalid message ID: " + adminQuestionRequest.getId());
        return;
    }
    
    messagesService.putMessage(adminQuestionRequest, adminEmail);
}
}