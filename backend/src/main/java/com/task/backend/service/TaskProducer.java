package com.task.backend.service;

import com.task.backend.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TaskProducer {

    private final RabbitTemplate rabbitTemplate;

    public TaskProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendMessage(String message) {
        System.out.println("Enviando mensaje: " + message);
        rabbitTemplate.convertAndSend(RabbitMQConfig.TASK_QUEUE, message);
    }
}

