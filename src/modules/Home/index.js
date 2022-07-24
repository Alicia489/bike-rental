import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultPatterns } from '../../utils/constants';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from "../../components/Loader/loaderSlice";
import { getUserRole, signIn, signUp } from "./sessionSlice";
import { showModal } from "../../components/Modal/modalSlice";
import { Util } from "../../utils/util"

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Bikeo
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Home() {
  const [emailValid, setEmailValid] = React.useState(true)
  const [passwordValid, setPasswordValid] = React.useState(true)
  const [isSignInMode, setSignInMode] = React.useState(true) // signin | signup
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [fullNameValid, setFullNameValid] = React.useState(true)
  const dispatch = useDispatch();

  let navigate = useNavigate();

  const clearFields = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setPasswordValid(true)
    setEmailValid(true)
    setFullNameValid(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // validate email and password against patterns
    const reg = new RegExp(defaultPatterns.email);
    setEmailValid(reg.test(email));

    setPasswordValid(password ? true : false);

    const nameReg = new RegExp(defaultPatterns.name);
    setFullNameValid(nameReg.test(fullName))

    if (emailValid && passwordValid && email && password && (!isSignInMode ? fullNameValid && fullName : true)) {
      if (isSignInMode) {
        dispatch(showLoader())
        dispatch(signIn({ email, password })).then(res => {
          if (res.error) {
            dispatch(hideLoader())
            alert(res.error.message);
            clearFields()
            return
          }

          dispatch(getUserRole(res.payload.uid)).then(roleRes => {
            Util.setLoggedInUserDetails(res.payload.accessToken, { ...res.payload, role: roleRes.payload })
            Util.setUserRole(roleRes.payload);
            if (roleRes.payload === "manager") {
              navigate("/managers/dashboard", { replace: true })
            } else {
              navigate("/bikes", { replace: true })
            }
            dispatch(hideLoader())
          })
        })
      } else {
        dispatch(showLoader())
        dispatch(signUp({ email, password, role: "user", fullName })).then(res => {
          dispatch(hideLoader())

          if (res.error) {
            alert(res.error.message)
            clearFields()
            return
          }

          dispatch(showModal({
            heading: 'Signup Success',
            message: 'Your account has been created successfully, please continue to login',
            type: '',
            buttons: [
              {
                text: 'Ok',
                action: () => { }
              },
              {
                text: 'Go to login',
                action: () => { modeChange() }
              }
            ]
          }))
        })
      }
    }
  };

  const modeChange = () => {
    setSignInMode(!isSignInMode)

    //reset fields
    clearFields()
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isSignInMode ? "Sign in" : "Sign Up"}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={!emailValid}
                helperText={!emailValid ? "Please enter a valid email" : ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!passwordValid}
                helperText={!passwordValid ? "Please enter a valid password" : (isSignInMode ? "" : "Password should contain atleast 6 characters")}
              />
              {!isSignInMode && <TextField
                margin="normal"
                required
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label="Full name"
                type="text"
                id="fnma"
                error={!fullNameValid}
                helperText={!fullNameValid ? "Please enter your name" : ""}
              />}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isSignInMode ? "Sign In" : "Sign up"}
              </Button>
              <Grid container>
                <Grid item className='text-center w-100'>
                  <Link href="#" variant="body2" onClick={() => modeChange()}>
                    {isSignInMode ? "Dont have an account? Signup" : "Already have an account? Login"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
