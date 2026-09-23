import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        bgcolor: "#0f172a",
        color: "white",
        py: 5,
        boxShadow: "0 -8px 24px rgba(15,23,42,0.18)",
      }}
    >
      <Container>
        <Typography variant="h6" fontWeight={800}>
          Bright Future Computer Institute
        </Typography>
        <Typography sx={{ mt: 1, color: "#cbd5e1" }}>
          Learn today. Build your career tomorrow.
        </Typography>
        <Typography sx={{ mt: 3, color: "#94a3b8" }}>
          © 2026 Bright Future Computer Institute. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
