package com.task.backend.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String TASK_QUEUE = "taskQueue";

    @Bean
    public Queue queue() {
        return new Queue(TASK_QUEUE, true);
    }
}

