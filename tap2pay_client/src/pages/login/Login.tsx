import React, { useEffect, useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  baseURL,
} from "../../helper/helper";
import { fetchWrapper } from "../../helper/fetcher";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await fetchWrapper(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      navigate("/dashboard");
      localStorage.setItem("authToken", response.results.token);
      localStorage.setItem("userId", response.results.user._id);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '100px' }}>
      <Box
        sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="h4" align="center" color="black" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '16px' }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" color="black" mt={2}>
            Don't have an account?{' '}
            <Link to="/register">
              Sign up
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
