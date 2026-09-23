import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";

const AUTH_KEY = "bfAuth";
const ADMIN_CREDENTIALS = {
  email: "admin@brightfuture.in",
  password: "admin123"
};

const STUDENT_CREDENTIALS = {
  email: "student@brightfuture.in",
  password: "student123"
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validAdmin =
      role === "admin" &&
      form.email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      form.password === ADMIN_CREDENTIALS.password;

    const validStudent =
      role === "student" &&
      form.email.trim().toLowerCase() === STUDENT_CREDENTIALS.email &&
      form.password === STUDENT_CREDENTIALS.password;

    if (!validAdmin && !validStudent) {
      setError("Invalid credentials for the selected role.");
      return;
    }

    const auth = {
      role,
      email: form.email.trim().toLowerCase(),
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    setError("");

    if (role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/admission");
  };

  return (
    <Box sx={{ py: 8, minHeight: "75vh", background: "linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)" }}>
          <Typography variant="overline" sx={{ color: "#64748b", letterSpacing: "0.18em" }}>SECURE ACCESS</Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", mb: 1 }}>
            {role === "admin" ? "Admin Login" : "Student Login"}
          </Typography>

          <Typography sx={{ color: "#475569", mb: 3 }}>
            Different roles use different access and route permissions.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Login Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={role}
                  label="Login Role"
                  onChange={(event) => setRole(event.target.value)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 999, fontWeight: 900, py: 1.5 }}>
                Login
              </Button>

              <Button component={Link} to="/admission" variant="outlined" sx={{ borderRadius: 999, fontWeight: 800 }}>
                Continue as Guest Student
              </Button>
            </Stack>
          </Box>

          <Typography sx={{ mt: 3, color: "#475569", fontSize: "0.9rem" }}>
            Admin demo credentials: admin@brightfuture.in / admin123
          </Typography>
          <Typography sx={{ mt: 1, color: "#475569", fontSize: "0.9rem" }}>
            Student demo credentials: student@brightfuture.in / student123
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
