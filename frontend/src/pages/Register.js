import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            setError("Por favor, introduce un correo electrónico válido.");
            return;
        }

        try {
            await axios.post("http://localhost:8081/auth/register", {
                username,
                email,
                password,
            });

            alert("Registro exitoso, ahora inicia sesión");
            navigate("/login");
        } catch (err) {
            setError("Error al registrar usuario");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Registrarse
                </Typography>
                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Nombre de usuario"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        error={!!error && !isValidEmail(email)}
                        helperText={error && !isValidEmail(email) ? "Correo inválido" : ""}
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
                        Registrarse
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    ¿Ya tienes cuenta?{" "}
                    <Button onClick={() => navigate("/login")} variant="text">
                        Iniciar sesión
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Register;
