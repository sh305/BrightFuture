import React,{useState} from "react";
import {Routes,Route,Link, Navigate} from "react-router-dom";
import {AppBar,Toolbar,Typography,Button,Container,Box,Drawer,List,ListItem,ListItemButton,ListItemText,IconButton} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "./pages/Home"; import Courses from "./pages/Courses"; import About from "./pages/About"; import Admission from "./pages/Admission"; import Contact from "./pages/Contact"; import Gallery from "./pages/Gallery"; import CourseDetails from "./pages/CourseDetails"; import PaymentReceipt from "./pages/PaymentReceipt"; import AdminDashboard from "./pages/AdminDashboard"; import AdminLogin from "./pages/AdminLogin"; import ProtectedRoute from "./components/ProtectedRoute";

function Navbar(){
  const [open,setOpen]=useState(false);
  const links=[["Home","/"],["Courses","/courses"],["About","/about"],["Gallery","/gallery"],["Admission","/admission"],["Admin","/admin"],["Contact","/contact"]];

  return <>
    <AppBar position="sticky" sx={{background:"rgba(15, 23, 42, 0.82)",backdropFilter:"blur(14px)",boxShadow:"0 8px 30px rgba(15,23,42,0.15)"}}>
      <Toolbar sx={{minHeight:{xs:68,md:76}}}>
        <Typography variant="h6" sx={{fontWeight:900,flexGrow:1,letterSpacing:"0.04em"}}>💻 Bright Future</Typography>
        <Box sx={{display:{xs:"none",md:"flex"},gap:1,alignItems:"center"}}>
          {links.map(([n,p])=><Button key={p} color="inherit" component={Link} to={p} sx={{borderRadius:999,fontWeight:700,px:2,py:1,':hover':{background:"rgba(255,255,255,0.08)"}}}>{n}</Button>) }
        </Box>
        <IconButton color="inherit" sx={{display:{md:"none"}}} onClick={()=>setOpen(true)}><MenuIcon/></IconButton>
      </Toolbar>
    </AppBar>

    <Drawer open={open} onClose={()=>setOpen(false)}>
      <List sx={{width:260}}>
        {links.map(([n,p])=><ListItem key={p} disablePadding><ListItemButton component={Link} to={p} onClick={()=>setOpen(false)}><ListItemText primary={n}/></ListItemButton></ListItem>) }
      </List>
    </Drawer>
  </>
}

function Footer(){
  return <Box component="footer" sx={{mt:8,bgcolor:"#0f172a",color:"white",py:5,boxShadow:"0 -8px 24px rgba(15,23,42,0.18)"}}>
    <Container>
      <Typography variant="h6" fontWeight={800}>Bright Future Computer Institute</Typography>
      <Typography sx={{mt:1,color:"#cbd5e1"}}>Learn today. Build your career tomorrow.</Typography>
      <Typography sx={{mt:3,color:"#94a3b8"}}>© 2026 Bright Future Computer Institute. All rights reserved.</Typography>
    </Container>
  </Box>
}

export default function App(){
  return <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/courses" element={<Courses/>}/>
      <Route path="/courses/:id" element={<CourseDetails/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/gallery" element={<Gallery/>}/>
      <Route path="/admission" element={<Admission/>}/>
      <Route path="/payment-receipt" element={<PaymentReceipt/>}/>
      <Route path="/admin-login" element={<AdminLogin/>}/>
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard/></ProtectedRoute>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Footer/>
  </>
}
