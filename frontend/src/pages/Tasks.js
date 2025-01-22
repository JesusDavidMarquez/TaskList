import React, { useEffect, useState } from "react";
import {Container,Typography,TextField,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,Select,MenuItem,FormControl,InputLabel,} from "@mui/material";
import { CheckCircle, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("BAJA");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8081/task", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/task",
        { title, description, completed: false, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
      setPriority("BAJA");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/task/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: true, completedAt: new Date().toISOString() } : task)));
    } catch (error) {
      console.error("Error al completar tarea:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundColor: "#E3F2FD",
        minHeight: "100vh",
        py: 4,
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        Cerrar Sesión
      </Button>

      <Typography variant="h4" gutterBottom>
        Lista de tareas
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Agregar nueva tarea</Typography>
        <TextField
          fullWidth
          label="Título"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          label="Descripción"
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Prioridad</InputLabel>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <MenuItem value="BAJA">🟢 Baja</MenuItem>
            <MenuItem value="MEDIA">🟡 Media</MenuItem>
            <MenuItem value="ALTA">🟠 Alta</MenuItem>
            <MenuItem value="CRITICA">🔴 Crítica</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleAddTask}>
          Agregar
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell>Completado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.completed ? "✅ Completada" : "⌛ Pendiente"}</TableCell>
                <TableCell>
                  {task.priority === "BAJA" && "🟢 Baja"}
                  {task.priority === "MEDIA" && "🟡 Media"}
                  {task.priority === "ALTA" && "🟠 Alta"}
                  {task.priority === "CRITICA" && "🔴 Crítica"}
                </TableCell>
                <TableCell>{task.user?.username || "Desconocido"}</TableCell>
                <TableCell>{new Date(task.createdAt).toLocaleString()}</TableCell>
                <TableCell>{task.completedAt ? new Date(task.completedAt).toLocaleString() : "⏳ Aún pendiente"}</TableCell>
                <TableCell>
                  {!task.completed && (
                    <IconButton color="success" onClick={() => handleCompleteTask(task.id)}>
                      <CheckCircle />
                    </IconButton>
                  )}
                  <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Tasks;