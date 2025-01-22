package com.task.backend.service;

import com.task.backend.model.Task;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.format.DateTimeFormatter;

@Service
public class TaskActionLogService {

    private static final String FILE_PATH = "task-actions-log.xlsx";

    public void writeLog(String action, Task task) {
        try {
            Workbook workbook;
            Sheet sheet;
            File file = new File(FILE_PATH);

            if (file.exists()) {
                try (FileInputStream fileInputStream = new FileInputStream(file)) {
                    workbook = WorkbookFactory.create(fileInputStream);
                    sheet = workbook.getSheetAt(0);
                }
            } else {
                workbook = new XSSFWorkbook();
                sheet = workbook.createSheet("Task Actions");

                Row header = sheet.createRow(0);
                header.createCell(0).setCellValue("ID");
                header.createCell(1).setCellValue("Título");
                header.createCell(2).setCellValue("Descripción");
                header.createCell(3).setCellValue("Estado");
                header.createCell(4).setCellValue("Prioridad");
                header.createCell(5).setCellValue("Usuario");
                header.createCell(6).setCellValue("Fecha de Creación");
                header.createCell(7).setCellValue("Fecha de Completado");
                header.createCell(8).setCellValue("Acción");
                header.createCell(9).setCellValue("Fecha de Acción");
            }

            int rowCount = sheet.getLastRowNum() + 1;
            Row row = sheet.createRow(rowCount);
            row.createCell(0).setCellValue(task.getId());
            row.createCell(1).setCellValue(task.getTitle());
            row.createCell(2).setCellValue(task.getDescription());
            row.createCell(3).setCellValue(task.isCompleted() ? "Completada" : "Pendiente");
            row.createCell(4).setCellValue(task.getPriority().name());
            row.createCell(5).setCellValue(task.getUser().getEmail());
            row.createCell(6).setCellValue(formatDate(task.getCreatedAt()));
            row.createCell(7).setCellValue(task.getCompletedAt() != null ? formatDate(task.getCompletedAt()) : "No completada");
            row.createCell(8).setCellValue(action);
            row.createCell(9).setCellValue(formatDate(java.time.LocalDateTime.now()));

            try (FileOutputStream fileOut = new FileOutputStream(FILE_PATH, false)) {
                workbook.write(fileOut);
                workbook.close();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String formatDate(java.time.LocalDateTime date) {
        return date != null ? date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "N/A";
    }
}

