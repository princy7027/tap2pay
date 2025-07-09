// src/components/Signup.jsx
import React, { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { fetchWrapper } from '../../helper/fetcher'
import { useNavigate } from 'react-router-dom'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const payload = {
        email: email,
        password: password,
      };
      const response = await fetchWrapper(`/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      navigate("/dashboard");
      localStorage.setItem("authToken", response.results.token);
      localStorage.setItem("userId", response.results.details._id);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

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
          Register
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
            Sign Up
          </Button>
          <Typography variant="body2" align="center" color="black" mt={2}>
            Already have an account?{' '}
            <Link to="/login">
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  )
}

export default RegisterPage;
