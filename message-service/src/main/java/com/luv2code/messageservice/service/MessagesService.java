package com.luv2code.messageservice.service;

import com.luv2code.messageservice.dao.MessageRepository;
import com.luv2code.messageservice.entity.Message;
import com.luv2code.messageservice.requestmodels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessagesService {

    private MessageRepository messageRepository;

    @Autowired
    public MessagesService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail) {
        System.out.println("=== DEBUG MESSAGE SAVE ===");
        System.out.println("userEmail: " + userEmail);
        System.out.println("title: " + messageRequest.getTitle());
        System.out.println("question: " + messageRequest.getQuestion());
        System.out.println("========================");

        Message message =
                new Message(messageRequest.getTitle(), messageRequest.getQuestion(), userEmail);
        messageRepository.save(message);

        System.out.println("Message saved with ID: " + message.getId());
    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail)
            throws Exception {
        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());
        if (!message.isPresent()) {
            throw new Exception("Message not found");
        }

        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);
        messageRepository.save(message.get());
    }
}
