import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { courses } from "../data";

const WHATSAPP_NUMBER = "917982720270";
const PHONEPE_UPI_ID = "7982720270@ybl";
const STORAGE_KEY = "bfAdmissionSubmissions";

export default function Admission() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", course: null });
  const [errors, setErrors] = useState({});
  const [paymentProof, setPaymentProof] = useState(null);
  const [adminPending, setAdminPending] = useState(false);

  const selectedCourseData = useMemo(
    () => courses.find((course) => course.name.toLowerCase() === String(form.course || "").toLowerCase()),
    [form.course]
  );

  const amountValue = Number((selectedCourseData?.fee || "0").replace(/[^\d]/g, "") || 0);
  const phonePeQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `upi://pay?pa=${PHONEPE_UPI_ID}&pn=${encodeURIComponent("Bright Future")}&am=${amountValue}&cu=INR`
  )}`;

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!trimmedName) {
      nextErrors.name = "Please enter student name.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!phone) {
      nextErrors.phone = "Please enter mobile number.";
    } else if (!/^\d{10}$/.test(phone)) {
      nextErrors.phone = "Mobile number must be exactly 10 digits.";
    }

    if (!email) {
      nextErrors.email = "Please enter email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.course) {
      nextErrors.course = "Please select a course.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const buildWhatsAppMessage = () => {
    const selectedCourse = form.course || "Not selected";
    return `Hello Bright Future,%0A%0AName: ${form.name || "Not provided"}%0APhone: ${form.phone || "Not provided"}%0AEmail: ${form.email || "Not provided"}%0ACourse: ${selectedCourse}%0A%0APayment status: Pending admin confirmation via PhonePe payment proof.`;
  };

  const openWhatsAppChat = (customText = "") => {
    const message = customText || buildWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const handleOpenPaymentDialog = () => {
    if (!validateForm()) {
      return;
    }

    setPaymentDialogOpen(true);
  };

  const generateReceiptParams = () => {
    const courseName = selectedCourseData?.name || String(form.course);
    const orderId = `BF-${Date.now()}`;
    const receipt = `RCPT-${Date.now()}`;

    return new URLSearchParams({
      orderId,
      receipt,
      studentName: form.name.trim(),
      courseName,
      amount: String(amountValue),
      mobile: form.phone.trim(),
      email: form.email.trim()
    });
  };

  const confirmPaymentAndShowLoader = () => {
    const params = generateReceiptParams();
    const submission = {
      id: `sub-${Date.now()}`,
      studentName: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      courseName: selectedCourseData?.name || form.course,
      amount: amountValue,
      orderId: params.get("orderId"),
      receipt: params.get("receipt"),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, submission]));
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([submission]));
    }

    setAdminPending(true);
    setPaymentDialogOpen(false);
    setProofDialogOpen(false);

    const reasonText = `Hello Bright Future,%0A%0AName: ${form.name.trim()}%0APhone: ${form.phone.trim()}%0AEmail: ${form.email.trim()}%0ACourse: ${selectedCourseData?.name || form.course}%0AAmount: ₹${amountValue.toLocaleString("en-IN")} %0A%0APayment proof received and waiting for admin confirmation.`;
    openWhatsAppChat(reasonText);

    window.setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const latest = stored.find((entry) => entry.id === submission.id);
      if (latest && latest.status === "approved") {
        navigate(`/payment-receipt?${params.toString()}`);
      } else {
        navigate(`/admission`, { replace: true });
      }
    }, 3500);
  };

  const handleProofUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPaymentProof(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPaymentProof(null);
      setOpen(true);
      return;
    }

    setPaymentProof(file);
  };

  const handleSendProof = () => {
    if (!paymentProof) {
      setOpen(true);
      return;
    }

    const proofMessage = `Hello Bright Future,%0A%0AName: ${form.name.trim()}%0APhone: ${form.phone.trim()}%0AEmail: ${form.email.trim()}%0ACourse: ${selectedCourseData?.name || form.course}%0AAmount: ₹${amountValue.toLocaleString("en-IN")} %0A%0AI have uploaded my payment proof screenshot and request admin confirmation.`;

    openWhatsAppChat(proofMessage);
    confirmPaymentAndShowLoader();
  };

  return (
    <Box sx={{ py: 7, background: "linear-gradient(180deg, #edf3f8 0%, #eaf1f8 100%)", minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <Container>
        <Paper sx={{ maxWidth: 1100, mx: "auto", borderRadius: 5, overflow: "hidden", boxShadow: "0 18px 42px rgba(13, 30, 71, 0.12)", background: "#f4f7fb" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "0.92fr 1.08fr" } }}>
            <Box sx={{ background: "linear-gradient(135deg, #071d3a 0%, #0c2d74 48%, #0f4dbd 100%)", color: "white", p: { xs: 3, md: 4, lg: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: "0.18em", opacity: 0.82, mb: 1 }}>ENROLL NOW</Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em", fontSize: { xs: "2.7rem", md: "4rem" } }}>Admission<br />Form</Typography>
              <Typography sx={{ mt: 3, color: "#d7e5ff", fontSize: "1.06rem", lineHeight: 1.7, maxWidth: 340 }}>
                Fill in your details and choose the right course for your future. Our team will contact you soon for guidance and admissions.
              </Typography>

              <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 1.2 }}>
                {courses.slice(0, 4).map((course) => (
                  <Box
                    key={course.id}
                    sx={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 999,
                      px: 1.6,
                      py: 0.8,
                      color: "#edf6ff",
                      fontSize: "0.82rem",
                      fontWeight: 700
                    }}
                  >
                    {course.name}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ p: { xs: 3, md: 4, lg: 5 }, display: "flex", alignItems: "center" }}>
              <Box component="form" noValidate sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: "1.02rem", fontWeight: 700, color: "#243247", mb: 3 }}>Please fill in all details to continue with payment.</Typography>

                <Grid container spacing={2.2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Student Name"
                      name="name"
                      value={form.name}
                      onChange={change}
                      error={Boolean(errors.name)}
                      helperText={errors.name || " "}
                      variant="outlined"
                      InputProps={{ style: { background: "#fff", borderRadius: 14, height: 58 } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#cfd8e3' },
                          '&:hover fieldset': { borderColor: '#7aa9ff' },
                          '&.Mui-focused fieldset': { borderColor: '#0f3ea5', borderWidth: 2 }
                        },
                        '& .MuiInputLabel-root': { color: '#475569', fontWeight: 600 }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      name="phone"
                      value={form.phone}
                      onChange={change}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone || " "}
                      variant="outlined"
                      InputProps={{ style: { background: "#fff", borderRadius: 14, height: 58 } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#cfd8e3' },
                          '&:hover fieldset': { borderColor: '#7aa9ff' },
                          '&.Mui-focused fieldset': { borderColor: '#0f3ea5', borderWidth: 2 }
                        },
                        '& .MuiInputLabel-root': { color: '#475569', fontWeight: 600 }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email ID"
                      name="email"
                      value={form.email}
                      onChange={change}
                      error={Boolean(errors.email)}
                      helperText={errors.email || " "}
                      variant="outlined"
                      InputProps={{ style: { background: "#fff", borderRadius: 14, height: 58 } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#cfd8e3' },
                          '&:hover fieldset': { borderColor: '#7aa9ff' },
                          '&.Mui-focused fieldset': { borderColor: '#0f3ea5', borderWidth: 2 }
                        },
                        '& .MuiInputLabel-root': { color: '#475569', fontWeight: 600 }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      options={courses.map((course) => course.name)}
                      value={form.course}
                      onChange={(event, newValue) => {
                        setForm({ ...form, course: newValue });
                        setErrors((prev) => ({ ...prev, course: "" }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Course"
                          variant="outlined"
                          error={Boolean(errors.course)}
                          helperText={errors.course || " "}
                          InputProps={{
                            ...params.InputProps,
                            style: { background: "#fff", borderRadius: 14, height: 58 }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#cfd8e3' },
                              '&:hover fieldset': { borderColor: '#7aa9ff' },
                              '&.Mui-focused fieldset': { borderColor: '#0f3ea5', borderWidth: 2 }
                            },
                            '& .MuiInputLabel-root': { color: '#475569', fontWeight: 600 }
                          }}
                        />
                      )}
                      freeSolo
                      fullWidth
                      sx={{ '& .MuiAutocomplete-endAdornment': { top: '50%', transform: 'translateY(-50%)' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleOpenPaymentDialog}
                      sx={{
                        width: "100%",
                        height: 56,
                        borderRadius: 999,
                        fontWeight: 900,
                        letterSpacing: "0.04em",
                        background: "linear-gradient(135deg, #1d5cff 0%, #2f80ff 100%)",
                        boxShadow: "0 18px 28px rgba(37, 99, 235, 0.28)",
                        ':hover': { background: "linear-gradient(135deg, #1a52d8 0%, #1d68f2 100%)" }
                      }}
                    >
                      Pay by UPI
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: "#0f172a" }}>Pay Admission Fee via PhonePe</DialogTitle>
        <DialogContent dividers>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center" justifyContent="center">
            <Box sx={{ p: 2, borderRadius: 4, border: "1px solid #e2e8f0", background: "#fff" }}>
              <img src={phonePeQrUrl} alt="PhonePe QR code" style={{ width: 240, height: 240, display: "block", objectFit: "contain" }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, color: "#334155", mb: 1 }}>Course selected:</Typography>
              <Typography sx={{ fontSize: "1.08rem", fontWeight: 800, color: "#0f172a", mb: 2 }}>{form.course || "No course selected"}</Typography>

              <Typography sx={{ fontWeight: 700, color: "#334155", mb: 1 }}>Amount to pay:</Typography>
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 900, color: "#0f4dbd", mb: 2 }}>₹{amountValue.toLocaleString("en-IN")}</Typography>

              <Typography sx={{ fontWeight: 700, color: "#334155", mb: 1 }}>UPI ID:</Typography>
              <Typography sx={{ fontSize: "1.02rem", fontWeight: 800, color: "#0f172a", mb: 2 }}>{PHONEPE_UPI_ID}</Typography>

              <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>
                Please pay through PhonePe, then upload your payment screenshot in the next step. Our admin will confirm payment before issuing the receipt.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} variant="outlined" sx={{ borderRadius: 999, px: 3, py: 1.3, fontWeight: 800 }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setPaymentDialogOpen(false);
              setProofDialogOpen(true);
            }}
            sx={{ borderRadius: 999, px: 3, py: 1.3, fontWeight: 800, background: "linear-gradient(135deg,#25d366,#1ebc5d)", ':hover': { background: "linear-gradient(135deg,#1fc25c,#1ca752)" } }}
          >
            Send Payment Proof
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={proofDialogOpen} onClose={() => setProofDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: "#0f172a" }}>Upload Payment Screenshot</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ color: "#475569", lineHeight: 1.7, mb: 2 }}>
            Please select the payment screenshot. After clicking Send, WhatsApp will open so you can send the proof to the admin.
          </Typography>

          <Button variant="outlined" component="label" sx={{ borderRadius: 999, px: 3, py: 1.4, fontWeight: 800, mb: 2 }}>
            Choose Image
            <input hidden accept="image/*" type="file" onChange={handleProofUpload} />
          </Button>

          {paymentProof && (
            <Box sx={{ mt: 2, p: 2, borderRadius: 3, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>{paymentProof.name}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setProofDialogOpen(false)} variant="outlined" sx={{ borderRadius: 999, px: 3, py: 1.3, fontWeight: 800 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendProof}
            sx={{ borderRadius: 999, px: 3, py: 1.3, fontWeight: 800, background: "linear-gradient(135deg, #0f4dbd, #1d5cff)" }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {adminPending && (
        <Box sx={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300 }}>
          <Paper sx={{ width: "min(90vw, 520px)", p: 4, borderRadius: 4, textAlign: "center", boxShadow: "0 24px 60px rgba(15,23,42,0.2)" }}>
            <CircularProgress size={62} sx={{ color: "#0f4dbd", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", mb: 1 }}>Please wait</Typography>
            <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>
              Your payment proof has been sent to the admin. Please wait while admin confirms your payment before the receipt is generated.
            </Typography>
          </Paper>
        </Box>
      )}

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="warning" sx={{ width: "100%" }}>
          Please upload a valid payment screenshot before sending.
        </Alert>
      </Snackbar>
    </Box>
  );
}
