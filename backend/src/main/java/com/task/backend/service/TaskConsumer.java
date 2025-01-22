package com.task.backend.service;

import com.task.backend.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class TaskConsumer {

    @RabbitListener(queues = RabbitMQConfig.TASK_QUEUE)
    public void receiveMessage(String message) {
        System.out.println("Mensaje recibido: " + message);
    }
}



