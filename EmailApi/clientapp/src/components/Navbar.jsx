import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { navLinks } from "../routes/navConfig";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 8px 30px rgba(15,23,42,0.15)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 68, md: 76 } }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 900,
              flexGrow: 1,
              letterSpacing: "0.04em",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            💻 Bright Future
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {navLinks.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Button
                  key={path}
                  color="inherit"
                  component={Link}
                  to={path}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 700,
                    px: 2,
                    py: 1,
                    background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                    "&:hover": { background: "rgba(255,255,255,0.18)" },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          {/* Mobile Hamburger Menu */}
          <IconButton
            color="inherit"
            sx={{ display: { md: "none" } }}
            onClick={() => setOpen(true)}
            aria-label="open navigation drawer"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 260 }}>
          {navLinks.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={isActive}
                  onClick={() => setOpen(false)}
                >
                  <ListItemText primary={label} primaryTypographyProps={{ fontWeight: isActive ? 800 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
