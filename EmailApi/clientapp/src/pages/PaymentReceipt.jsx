import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Divider, Paper, Stack, Typography, Chip } from "@mui/material";

export default function PaymentReceipt() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const studentName = params.get("studentName") || "Student";
  const courseName = params.get("courseName") || "Admission Course";
  const amount = Number(params.get("amount") || 0);
  const orderId = params.get("orderId") || "N/A";
  const receipt = params.get("receipt") || "N/A";
  const email = params.get("email") || "Not provided";
  const mobile = params.get("mobile") || "Not provided";
  const paymentDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value || 0);

  return (
    <Box sx={{ py: 8, background: "linear-gradient(180deg, #f4f7fb 0%, #edf4ff 100%)", minHeight: "75vh" }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            '@media print': {
              boxShadow: 'none',
              border: '1px solid #cbd5e1'
            }
          }}
        >
          <Box sx={{ background: "linear-gradient(135deg, #0f172a 0%, #0f4dbd 100%)", color: "#fff", p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: 2, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 24 }}>
                    BF
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: "0.04em" }}>Bright Future</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 900, letterSpacing: "-0.04em" }}>Admission Fee Receipt</Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Chip label="Paid via PhonePe" sx={{ bgcolor: "rgba(94, 234, 212, 0.14)", color: "#d1fae5", fontWeight: 800 }} />
                <Typography variant="caption" sx={{ mt: 1.5, display: "block", opacity: 0.8 }}>Receipt No</Typography>
                <Typography sx={{ fontWeight: 800 }}>{receipt}</Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="overline" sx={{ color: "#64748b", letterSpacing: "0.12em" }}>Student</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{studentName}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: "#64748b", letterSpacing: "0.12em" }}>Paid On</Typography>
                <Typography sx={{ fontWeight: 700 }}>{paymentDate}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", mb: 1 }}>Course</Typography>
                <Typography sx={{ fontWeight: 800 }}>{courseName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", mb: 1 }}>Order ID</Typography>
                <Typography sx={{ fontWeight: 800 }}>{orderId}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", mb: 1 }}>Email</Typography>
                <Typography sx={{ fontWeight: 700 }}>{email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#64748b", mb: 1 }}>Mobile</Typography>
                <Typography sx={{ fontWeight: 700 }}>{mobile}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4, p: 3, borderRadius: 3, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 1.2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Admission Fee</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>{formatINR(amount)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                <Typography sx={{ color: "#64748b" }}>Status</Typography>
                <Typography sx={{ fontWeight: 800, color: "#16a34a" }}>Paid</Typography>
              </Stack>
            </Box>

            <Typography sx={{ mt: 4, color: "#475569", lineHeight: 1.7 }}>
              Thank you for choosing Bright Future Computer Institute. Your admission payment has been received successfully. Our academic team will contact you shortly to complete the enrollment process.
            </Typography>

            <Box sx={{ mt: 4, borderTop: "1px dashed #cbd5e1", pt: 3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", letterSpacing: "0.08em" }}>Institute</Typography>
                <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>Bright Future Computer Institute</Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography variant="caption" sx={{ color: "#64748b", letterSpacing: "0.08em" }}>Payment Method</Typography>
                <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>PhonePe UPI</Typography>
              </Box>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
              <Button variant="contained" onClick={() => window.print()} sx={{ borderRadius: 999, px: 4, py: 1.5, fontWeight: 800, background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 12px 24px rgba(16, 185, 129, 0.2)" }}>
                Download / Print Receipt
              </Button>
              <Button component={RouterLink} to="/admission" variant="outlined" sx={{ borderRadius: 999, px: 4, py: 1.5, fontWeight: 800 }}>
                Back to Admission
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
