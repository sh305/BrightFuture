import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

const STORAGE_KEY = "bfAdmissionSubmissions";
const ADMIN_WHATSAPP_NUMBER = "917982720270";

const loadSubmissions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    setSubmissions(loadSubmissions());
  }, []);

  const refresh = () => setSubmissions(loadSubmissions());

  const approveSubmission = (item) => {
    const updated = loadSubmissions().map((entry) => {
      if (entry.id !== item.id) return entry;
      return { ...entry, status: "approved", approvedAt: new Date().toISOString() };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    refresh();

    const params = new URLSearchParams({
      orderId: item.orderId || `BF-${Date.now()}`,
      receipt: item.receipt || `RCPT-${Date.now()}`,
      studentName: item.studentName || "Student",
      courseName: item.courseName || "Course",
      amount: String(item.amount || 0),
      mobile: item.mobile || "",
      email: item.email || ""
    });

    navigate(`/payment-receipt?${params.toString()}`);
  };

  const rejectSubmission = (item) => {
    const updated = loadSubmissions().map((entry) => {
      if (entry.id !== item.id) return entry;
      return { ...entry, status: "rejected", rejectedAt: new Date().toISOString() };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    refresh();

    const message = `Hello ${item.studentName},%0A%0AYour payment proof has been rejected by the admin. Please review and upload a valid screenshot again.`;
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const pending = submissions.filter((item) => item.status === "pending");
  const approved = submissions.filter((item) => item.status === "approved");
  const rejected = submissions.filter((item) => item.status === "rejected");

  return (
    <Box sx={{ py: 7, background: "linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)", minHeight: "80vh" }}>
      <Container maxWidth="xl">
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 5, boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)" }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: "0.16em", color: "#64748b" }}>ADMIN PANEL</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a" }}>Payment Confirmation Dashboard</Typography>
            </Box>
            <Chip label={`Admin WhatsApp: ${ADMIN_WHATSAPP_NUMBER}`} color="primary" sx={{ fontWeight: 800, px: 1, py: 1 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
            <Paper sx={{ flex: 1, p: 2, borderRadius: 3, background: "#eff6ff", border: "1px solid #dbeafe" }}>
              <Typography sx={{ color: "#475569" }}>Pending</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>{pending.length}</Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2, borderRadius: 3, background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
              <Typography sx={{ color: "#475569" }}>Approved</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>{approved.length}</Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2, borderRadius: 3, background: "#fef2f2", border: "1px solid #fecaca" }}>
              <Typography sx={{ color: "#475569" }}>Rejected</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>{rejected.length}</Typography>
            </Paper>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {submissions.length === 0 ? (
            <Alert severity="info">No admission payment submissions yet.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.studentName}</TableCell>
                      <TableCell>{item.courseName}</TableCell>
                      <TableCell>₹{Number(item.amount || 0).toLocaleString("en-IN")}</TableCell>
                      <TableCell>{item.mobile}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status || "pending"}
                          color={
                            item.status === "approved"
                              ? "success"
                              : item.status === "rejected"
                                ? "error"
                                : "warning"
                          }
                          sx={{ textTransform: "capitalize", fontWeight: 800 }}
                        />
                      </TableCell>
                      <TableCell>
                        {item.status === "pending" ? (
                          <Stack direction="row" spacing={1}>
                            <Button variant="contained" color="success" onClick={() => approveSubmission(item)} sx={{ borderRadius: 999, fontWeight: 800 }}>
                              Approve
                            </Button>
                            <Button variant="contained" color="error" onClick={() => rejectSubmission(item)} sx={{ borderRadius: 999, fontWeight: 800 }}>
                              Reject
                            </Button>
                          </Stack>
                        ) : (
                          <Typography sx={{ color: "#64748b", fontWeight: 700 }}>Reviewed</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
