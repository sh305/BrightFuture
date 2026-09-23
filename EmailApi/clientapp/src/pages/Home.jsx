import React from "react";
import {Box,Button,Container,Grid,Paper,Stack,Typography} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import {Link} from "react-router-dom";
import {courses} from "../data";

const features = [
  { icon: <SchoolIcon />, title: "Practical Training", text: "Learn through hands-on computer lab practice with real-world exercises." },
  { icon: <GroupsIcon />, title: "Expert Faculty", text: "Friendly teachers who explain concepts clearly and support every learner." },
  { icon: <WorkIcon />, title: "Career Focused", text: "Courses designed around useful workplace skills and job-ready confidence." }
];

export default function Home(){
  return <>
    <Box className="hero">
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="overline" sx={{color:"#bfdbfe",fontWeight:700,letterSpacing:"0.18em"}}>Grow with confidence</Typography>
            <Typography variant="h1" sx={{fontSize:{xs:"2.6rem",md:"4.3rem"},lineHeight:1.1,color:"white",fontWeight:900,maxWidth:680}}>
              Computer Skills. Better Career.
            </Typography>
            <Typography variant="h6" sx={{color:"#dbeafe",mt:2,maxWidth:650,lineHeight:1.7}}>
              Practical computer courses with expert guidance, hands-on projects, and training designed to help students and professionals step into better opportunities.
            </Typography>

            <Stack direction={{xs:"column",sm:"row"}} spacing={2} sx={{mt:4}}>
              <Button variant="contained" size="large" component={Link} to="/admission" sx={{borderRadius:999,px:3,py:1.5,fontWeight:800,background:"linear-gradient(135deg,#f59e0b,#f97316)",boxShadow:"0 15px 30px rgba(249,115,22,0.35)",':hover':{background:"linear-gradient(135deg,#fbbf24,#f97316)"}}}>
                Take Admission
              </Button>
              <Button variant="outlined" size="large" component={Link} to="/courses" sx={{borderRadius:999,px:3,py:1.5,fontWeight:800,color:"white",borderColor:"rgba(255,255,255,0.8)",':hover':{borderColor:"white",background:"rgba(255,255,255,0.08)"}}}>
                View Courses
              </Button>
            </Stack>

            <Grid container spacing={2} sx={{mt:4, maxWidth:560}}>
              {[
                {label:"Students Trained", value:"2,500+"},
                {label:"Courses Offered", value:"20+"},
                {label:"Success Rate", value:"95%"}
              ].map((item)=><Grid item xs={12} sm={4} key={item.label}>
                <Paper elevation={0} sx={{p:2,borderRadius:3,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",backdropFilter:"blur(8px)"}}>
                  <Typography variant="h5" sx={{color:"white",fontWeight:900}}>{item.value}</Typography>
                  <Typography sx={{color:"#dbeafe",fontSize:"0.85rem"}}>{item.label}</Typography>
                </Paper>
              </Grid>)}
            </Grid>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={10} sx={{p:4,borderRadius:5,background:"linear-gradient(135deg,#ffffff,#eef6ff)",boxShadow:"0 25px 60px rgba(15,23,42,0.18)"}}>
              <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",mb:2}}>
                <SchoolIcon color="primary" sx={{fontSize:40}}/>
              </Box>
              <Typography variant="h4" fontWeight={900} sx={{color:"#0f172a"}}>Start Learning Today</Typography>
              <Typography sx={{mt:1,color:"#475569",lineHeight:1.7}}>
                Flexible batches • Practical labs • Affordable fees • Career guidance
              </Typography>

              <Box sx={{mt:3,p:2.5,borderRadius:3,background:"#f8fafc",border:"1px solid #e2e8f0"}}>
                <Typography sx={{fontWeight:800,color:"#0f172a"}}>Popular Programs</Typography>
                <Stack spacing={1.5} sx={{mt:2}}>
                  {courses.slice(0,3).map((course)=><Box key={course.id} sx={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"white",borderRadius:2,p:1.5,border:"1px solid #e2e8f0"}}>
                    <Typography sx={{fontWeight:700,color:"#0f172a"}}>{course.name}</Typography>
                    <Typography sx={{color:"#2563eb",fontWeight:700}}>{course.fee}</Typography>
                  </Box>)}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Container sx={{py:8}}>
      <Typography variant="h3" textAlign="center" sx={{fontWeight:900,color:"#0f172a"}}>Why Choose Us?</Typography>
      <Grid container spacing={3} sx={{mt:2}}>
        {features.map((item)=><Grid item xs={12} md={4} key={item.title}>
          <Paper sx={{p:4,height:"100%",textAlign:"center",borderRadius:4,boxShadow:"0 18px 40px rgba(15,23,42,0.08)",transition:"all 0.2s ease",':hover':{transform:"translateY(-6px)",boxShadow:"0 24px 45px rgba(37,99,235,0.12)"}}} elevation={0}>
            <Box sx={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",color:"primary.main",mb:2}}>
              {item.icon}
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{mt:1,color:"#0f172a"}}>{item.title}</Typography>
            <Typography color="text.secondary" sx={{mt:1,lineHeight:1.7}}>{item.text}</Typography>
          </Paper>
        </Grid>) }
      </Grid>
    </Container>

    <Box sx={{background:"linear-gradient(180deg,#f8fbff 0%, #eef4ff 100%)",py:8}}>
      <Container>
        <Typography variant="h3" textAlign="center" sx={{fontWeight:900,color:"#0f172a",mb:4}}>Popular Courses</Typography>

        <Box className="course-marquee" sx={{overflow:"hidden",position:"relative",pb:1}}>
          <Box className="course-marquee-track" sx={{display:"flex",gap:3,width:"max-content",paddingRight:3}}>
            {[...courses, ...courses].map((course, index)=><Box key={`${course.id}-${index}`} sx={{minWidth:{xs:260,sm:300},maxWidth:300,flexShrink:0}}>
              <Paper sx={{p:3,height:"100%",borderRadius:4,boxShadow:"0 18px 35px rgba(15,23,42,0.08)",border:"1px solid #e2e8f0",display:"flex",flexDirection:"column",minHeight:220}} elevation={0}>
                <Typography variant="h5" fontWeight={800} sx={{color:"#0f172a"}}>{course.name}</Typography>
                <Typography sx={{mt:1,color:"#475569"}}>{course.duration}</Typography>
                <Typography sx={{mt:2,color:"#334155",lineHeight:1.7}}>{course.desc}</Typography>
                <Box sx={{mt:"auto",display:"flex",justifyContent:"space-between",alignItems:"center",pt:3}}>
                  <Typography sx={{fontWeight:800,color:"#2563eb"}}>{course.fee}</Typography>
                  <Button component={Link} to="/admission" sx={{borderRadius:999,fontWeight:800,color:"#2563eb",':hover':{background:"rgba(37,99,235,0.08)"}}}>Enroll Now</Button>
                </Box>
              </Paper>
            </Box>)}
          </Box>
        </Box>
      </Container>
    </Box>
  </>
}
