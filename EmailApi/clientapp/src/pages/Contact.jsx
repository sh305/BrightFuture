import React, { useState } from "react";
import { Container, Grid, Paper, Typography, TextField, Button, Stack, Snackbar, Alert, Box, Backdrop, CircularProgress } from "@mui/material";

const WHATSAPP_NUMBER = "917982720270";
const API_URL = "/api/contact";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: ""
  });
  const [form, setForm] = useState({ name: "", mobile: "", email: "", message: "" });

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendByEmail = async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          message: formData.message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const debugMessage = data.debug ? `\nDebug: ${data.debug}` : "";
        throw new Error(`${data.message || "Message could not be sent right now."}${debugMessage}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Email send failed:", error);
      return { success: false, error: error.message || "Message could not be sent right now. Please try again or contact us on WhatsApp." };
    }
  };

  const handleSubmit = async () => {
    const trimmedName = form.name.trim();
    const trimmedMobile = form.mobile.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || !trimmedMobile || !trimmedEmail || !trimmedMessage) {
      setAlert({
        open: true,
        severity: "error",
        message: "All fields are required: name, mobile, email, and message."
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please enter a valid email address."
      });
      return;
    }

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(trimmedMobile.replace(/\s+/g, ""))) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please enter a valid 10-digit mobile number starting with 6 to 9."
      });
      return;
    }

    const updatedForm = {
      name: trimmedName,
      mobile: trimmedMobile,
      email: trimmedEmail,
      message: trimmedMessage
    };

    setForm(updatedForm);
    setLoading(true);

    const result = await sendByEmail(updatedForm);

    setLoading(false);

    if (result.success) {
      setForm({ name: "", mobile: "", email: "", message: "" });
      setAlert({
        open: true,
        severity: "success",
        message: "Email sent successfully! We will contact you soon."
      });
    } else {
      setAlert({
        open: true,
        severity: "error",
        message: result.error
      });
    }
  };

  return (
    <Box sx={{ py: 7, background: "linear-gradient(180deg,#f7fbff 0%, #edf4ff 100%)", position: "relative" }}>
      <Container>
        <Typography variant="h2" textAlign="center" sx={{ fontWeight: 900, color: "#0f172a", mb: 5 }}>
          Contact Us
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(135deg,#0f172a 0%, #1d4ed8 100%)",
                color: "white",
                boxShadow: "0 24px 50px rgba(29, 78, 216, 0.25)"
              }}
            >
              <Typography variant="h5" fontWeight={800}>Get in Touch</Typography>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {[
                  { icon: "📍", text: "Main Market, New Delhi" },
                  { icon: "📞", text: "+91 7982720270" },
                  { icon: "✉️", text: "info@brightfuture.in" }
                ].map((item) => (
                  <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#e2ebff", fontSize: "1rem" }}>
                    <Box sx={{ fontSize: "1.35rem", minWidth: 28 }}>{item.icon}</Box>
                    <Typography>{item.text}</Typography>
                  </Box>
                ))}
              </Stack>

              <Button
                href="https://wa.me/917982720270"
                target="_blank"
                variant="contained"
                sx={{
                  mt: 4,
                  borderRadius: 999,
                  p: "0.8rem 1.5rem",
                  fontWeight: 800,
                  background: "#22c55e",
                  "&:hover": { background: "#16a34a" }
                }}
              >
                WhatsApp Us
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: "0 20px 45px rgba(15,23,42,0.08)" }}>
              <Typography variant="h5" fontWeight={800}>Send Enquiry</Typography>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  fullWidth
                  disabled={loading}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={form.mobile}
                  onChange={updateField}
                  fullWidth
                  disabled={loading}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  fullWidth
                  disabled={loading}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  multiline
                  rows={4}
                  fullWidth
                  disabled={loading}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    borderRadius: 999,
                    py: 1.5,
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      background: "linear-gradient(135deg,#1d4ed8,#1e40af)",
                      boxShadow: "0 14px 30px rgba(37, 99, 235, 0.45)",
                      transform: "translateY(-1px)",
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={22} sx={{ color: "white", mr: 1.5 }} />
                      Sending Email...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Beautiful Glassmorphic Backdrop Loader */}
        <Backdrop
          open={loading}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 999,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: 5,
              textAlign: "center",
              maxWidth: 420,
              mx: 2,
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.98))",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 35px rgba(37, 99, 235, 0.3)",
              color: "white",
            }}
          >
            <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
              <CircularProgress
                size={74}
                thickness={4}
                sx={{
                  color: "#3b82f6",
                  animationDuration: "1.1s",
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.85rem",
                }}
              >
                ✉️
              </Box>
            </Box>

            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.02em", mb: 1, color: "#f8fafc" }}>
              Sending Email...
            </Typography>

            <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.6 }}>
              Please wait while we connect to the server and send your message.
            </Typography>
          </Paper>
        </Backdrop>

        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
