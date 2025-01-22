package com.task.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DatabaseTest implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            List<String> databases = jdbcTemplate.queryForList("SHOW DATABASES;", String.class);
            System.out.println("Successful connection");
        } catch (Exception e) {
            System.err.println("Connection error: " + e.getMessage());
        }
    }
}
