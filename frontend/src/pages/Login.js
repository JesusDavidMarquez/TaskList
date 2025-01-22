import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/tasks");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8081/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            alert("Login exitoso");
            navigate("/tasks");
        } catch (err) {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Iniciar Sesión
                </Typography>
                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                        Ingresar
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    ¿No tienes cuenta?{" "}
                    <Button onClick={() => navigate("/register")} variant="text">
                        Regístrate aquí
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Login;