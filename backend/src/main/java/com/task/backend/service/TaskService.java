package com.task.backend.service;

import com.task.backend.model.Task;
import com.task.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class TaskService {

    private static final String TASKS_CACHE = "tasks";

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private TaskActionLogService taskActionLogService;

    public List<Task> getAllTasks() {
        List<Task> tasks = (List<Task>) redisTemplate.opsForValue().get(TASKS_CACHE);

        if (tasks == null) {
            System.out.println("Cargando tareas desde la base de datos...");
            tasks = taskRepository.findAll();
            redisTemplate.opsForValue().set(TASKS_CACHE, tasks, 10, TimeUnit.MINUTES);
        } else {
            System.out.println("Cargando tareas desde Redis...");
        }

        return tasks;
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task saveTask(Task task) {
        if (task.getUser() == null) {
            throw new RuntimeException("Cada tarea debe estar asociada a un usuario");
        }
        Task savedTask = taskRepository.save(task);
        redisTemplate.delete(TASKS_CACHE);
        taskActionLogService.writeLog("Tarea Creada", savedTask);
        return savedTask;
    }

    public Task completeTask(Long id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.markAsCompleted();
            Task updatedTask = taskRepository.save(task);
            redisTemplate.delete(TASKS_CACHE);
            taskActionLogService.writeLog("Tarea Completada", updatedTask);
            return updatedTask;
        }
        throw new RuntimeException("Tarea no encontrada");
    }

    public void deleteTask(Long id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            taskActionLogService.writeLog("Tarea Eliminada", task);
            taskRepository.deleteById(id);
            redisTemplate.delete(TASKS_CACHE);
        } else {
            throw new RuntimeException("Tarea no encontrada");
        }
    }
}


