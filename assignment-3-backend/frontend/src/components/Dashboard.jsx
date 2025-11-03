import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

const Profile = ({ profile }) => (
  <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
    <Typography variant="h5" gutterBottom>Profile Information</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography><strong>Name:</strong> {profile.name}</Typography>
        <Typography><strong>Email:</strong> {profile.email}</Typography>
        <Typography><strong>Mobile:</strong> {profile.mobile}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography><strong>Member Code:</strong> {profile.memberCode}</Typography>
        <Typography><strong>Sponsor Code:</strong> {profile.sponsorCode}</Typography>
        <Typography><strong>Left Count:</strong> {profile.leftCount}</Typography>
        <Typography><strong>Right Count:</strong> {profile.rightCount}</Typography>
      </Grid>
    </Grid>
  </Paper>
);

const Downline = ({ downline }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Left Downline Members</Typography>
        <List>
          {downline.leftMembers.map((member) => (
            <div key={member.memberCode}>
              <ListItem>
                <ListItemText
                  primary={member.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Member Code: {member.memberCode}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Left Count: {member.leftCount} | Right Count: {member.rightCount}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </Grid>
    <Grid item xs={12} md={6}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Right Downline Members</Typography>
        <List>
          {downline.rightMembers.map((member) => (
            <div key={member.memberCode}>
              <ListItem>
                <ListItemText
                  primary={member.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Member Code: {member.memberCode}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Left Count: {member.leftCount} | Right Count: {member.rightCount}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </Grid>
  </Grid>
);

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [downline, setDownline] = useState({ leftMembers: [], rightMembers: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          onLogout();
        }
      }
    };

    const fetchDownline = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/downline', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDownline(response.data);
      } catch (error) {
        console.error('Error fetching downline:', error);
      }
    };

    fetchProfile();
    fetchDownline();
  }, [navigate, onLogout]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MLM Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={
            <>
              {profile && <Profile profile={profile} />}
              <Downline downline={downline} />
            </>
          } />
        </Routes>
      </Container>
    </Box>
  );
};

export default Dashboard;