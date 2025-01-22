package com.task.backend.controller;

import com.task.backend.model.Task;
import com.task.backend.model.TaskPriority;
import com.task.backend.model.User;
import com.task.backend.security.JwtUtil;
import com.task.backend.service.TaskProducer;
import com.task.backend.service.TaskService;
import com.task.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TaskProducer taskProducer;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public Optional<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        Optional<User> user = userService.getUserByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        task.setUser(user.get());

        if (task.getPriority() == null) {
            task.setPriority(TaskPriority.BAJA);
        }
        taskProducer.sendMessage("Nueva tarea creada: " + task.getTitle());
        return taskService.saveTask(task);
    }

    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id) {
        return taskService.completeTask(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}



