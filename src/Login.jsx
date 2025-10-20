import React from 'react'
import { useState, useEffect } from 'react'
import styles from './assets/styles/login.module.css'
import { auth } from './assets/setting/firebase'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getIdToken,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  AuthCredential
} from 'firebase/auth'
const provider = new GoogleAuthProvider()
import { Link } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useNavigate } from 'react-router-dom'

export default function LoginScreen () {
  const [signedIn, setSignedIn] = useState(true)
  const [login, toggleLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorsEmail, showEmailErrors] = useState(false)
  const [errorsPassword, showPasswordErrors] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loadingScreen, showLoadingScreen] = useState(false)
  const [details, showDetails] = useState(false)
  const [username, setUsername] = useState('')
  const [usernameErr, showuserNameErr] = useState(false)
  const navigate = useNavigate()

  const API_URL =
    import.meta.env.VITE_APP_API_URL ||
    'https://tripify-backend-jfjs.onrender.com'

  async function handleGoogle () {

    try {
      const result = await signInWithPopup(auth, provider)

      const token = await result.user.getIdToken()

      await syncUserWithBackend(token)
    } catch (error) {

      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
    }
  }



  async function syncUserWithBackend (token) {
    try {
      const res = await fetch(`${API_URL}/api/users/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Failed to sync user')
      const profile = await res.json()

      console.log(' Backend synced:', profile)
      navigate('/')
    } catch (error) {
      console.error(' Backend sync failed:', error)
    }
  }

  async function handleSignIn (email, password) {
    try {
      showLoadingScreen(true)

      const timer = setTimeout(() => {
        showLoadingScreen(false)
      }, 3000)
      setEmailError('')
      setPasswordError('')

      const credential = await signInWithEmailAndPassword(auth, email, password)
      const user = credential.user
      const token = await user.getIdToken()

      console.log('Signed in:', user.uid)

      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      const profile = await res.json()
      console.log(profile)
      navigate('/')
    } catch (error) {
      console.log(error.code)
      if (error.code === 'auth/weak-password') {
        showPasswordErrors(true)
        setPasswordError('Password must be at least 6 characters!')
      } else if (error.code === 'auth/invalid-email') {
        console.log('working')
        showEmailErrors(true)
        setEmailError('Invalid email format!')
      } else if (error.code === 'auth/invalid-credential') {
        console.log('working')
        showEmailErrors(true)
        showPasswordErrors(true)
        setEmailError('Incorrect email address!')
        setPasswordError('Incorrect Password!')
      } else {
        alert('Something went wrong: ' + error.message)
      }

      showPasswordErrors(true)
      showEmailErrors(true)
    }
  }

  async function handleSignUp (email, password) {
    try {
      showLoadingScreen(true)
      const timer = setTimeout(() => {
        showLoadingScreen(false)
      }, 3000)

      if (username === '' || !username) {
        showuserNameErr(true)
        return
      }
      setEmailError('')
      setPasswordError('')

      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = credential.user
      const token = await user.getIdToken()
      await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: user.uid,
          user: username,
          email: user.email
        })
      })

      console.log('User registered:', user.uid)
      navigate('/')
    } catch (error) {
      console.log(error.code)
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email is already registered! Please Sign In')
      } else if (error.code === 'auth/weak-password') {
        showPasswordErrors(true)
        setPasswordError('Password must be at least 6 characters!')
      } else if (error.code === 'auth/invalid-email') {
        console.log('working')
        showEmailErrors(true)
        setEmailError('Invalid email format!')
      } else if (error.code === 'auth/missing-password') {
        showPasswordErrors(true)
        setPasswordError('This field is important!')
      } else {
        alert('Something went wrong: ' + error.message)
      }
      showEmailErrors(true)
    }
  }

  function displayLoadingScreen () {
    showLoadingScreen(true)

    const trigger = setTimeout(() => {
      showLoadingScreen(false)
    }, 7000)

    return () => clearTimeout(trigger)
  }
  return (
    <main className={styles.main}>
      {loadingScreen && <Animatedload />}
      {details && <UserDetails />}
      {login ? (
        <>
          <LoginUi
            handleGoogle={handleGoogle}
            email={email}
            setEmail={setEmail}
            password={password}
            toggleLogin={toggleLogin}
            setPassword={setPassword}
            user={user}
            setUser={setUser}
            handleSignIn={handleSignIn}
            errorsEmail={errorsEmail}
            errorsPassword={errorsPassword}
            showEmailErrors={showEmailErrors}
            showPasswordErrors={showPasswordErrors}
            setEmailError={setEmailError}
            setPasswordError={setPasswordError}
            emailError={emailError}
            passwordError={passwordError}
            loadingScreen={loadingScreen}
            showLoadingScreen={showLoadingScreen}
            displayLoadingScreen={displayLoadingScreen}
          />
        </>
      ) : (
        <>
          <SignUpUi
            email={email}
            setEmail={setEmail}
            password={password}
            toggleLogin={toggleLogin}
            setPassword={setPassword}
            user={user}
            setUser={setUser}
            handleSignUp={handleSignUp}
            errorsEmail={errorsEmail}
            errorsPassword={errorsPassword}
            showEmailErrors={showEmailErrors}
            showPasswordErrors={showPasswordErrors}
            setEmailError={setEmailError}
            setPasswordError={setPasswordError}
            emailError={emailError}
            passwordError={passwordError}
            loadingScreen={loadingScreen}
            showLoadingScreen={showLoadingScreen}
            displayLoadingScreen={displayLoadingScreen}
            username={username}
            setUsername={setUsername}
            usernameErr={usernameErr}
            showuserNameErr={showuserNameErr}
            handleGoogle={handleGoogle}
          />
        </>
      )}
    </main>
  )
}

function LoginUi ({
  toggleLogin,
  handleSignIn,
  email,
  setEmail,
  password,
  setPassword,
  errorsEmail,
  errorsPassword,
  setEmailError,
  setPasswordError,
  emailError,
  passwordError,
  showPasswordErrors,
  loadingScreen,
  showLoadingScreen,
  displayLoadingScreen,
  handleGoogle
}) {
  return (
    <>
      <div className={styles.box}>
        <section className={styles.left}>
          <div className={styles.logo}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='48px'
              viewBox='0 -960 960 960'
              width='48px'
              fill='#292727ff'
            >
              <path d='M639-120H180q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v459L639-120Zm-30-60v-83q0-35 26.5-61.5T697-351h83v-429H180v600h429ZM450-321h60v-258h129v-60H321v60h129v258Zm159 141Zm-429 0v-600 600Z' />
            </svg>
            Tripify
          </div>

          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>Login</div>
            <div style={{ fontSize: 13 }}>
              Join and discover new beautiful places
            </div>
          </section>

          <section className={styles.form}>
            <button
              onClick={handleGoogle}
              style={{
                backgroundColor: '#ffffffff',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                color: '#000000ff',
                width: '100%',
                marginTop: 20,
                gap: 10,
                height: 35,
                marginBottom: 10,
                borderWidth: 0.01,
                borderColor: '#2120205f'
              }}
            >
              <img
                width='20'
                height='20'
                src='https://img.icons8.com/color/48/google-logo.png'
                alt='google-logo'
              />
              Sign in with Google
            </button>

            <div className={styles.or}>or sign in with email</div>

            <section>
              <section>
                {errorsEmail && (
                  <div style={{ color: 'red', marginTop: '1em', fontSize: 12 }}>
                    {emailError}
                  </div>
                )}
                <div>Email</div>
                <input
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value), showPasswordErrors(false)
                  }}
                  className={styles.input}
                  type='text'
                  placeholder='mail@gmail.com'
                />
              </section>
              <section style={{ marginTop: 20 }}>
                {errorsPassword && (
                  <div style={{ color: 'red', marginTop: '1em', fontSize: 12 }}>
                    {passwordError}
                  </div>
                )}
                <div>Password</div>
                <input
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                  }}
                  className={styles.input}
                  type='text'
                  placeholder='1234abc'
                />
              </section>
              <section
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex' }}>
                  <input
                    style={{ width: 14 }}
                    type='checkbox'
                    name='remember'
                    id='remember'
                  />
                  <div style={{ color: '#000000ff', fontSize: 12 }}>
                    Remember me
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#5c23cdff' }}>
                  Forgot password ?
                </div>
              </section>

              <button
                style={{
                  backgroundColor: '#5c23cdff',
                  border: 0,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  color: '#ffffffff',
                  width: '100%',
                  marginTop: 20,
                  gap: 10,
                  height: 35,
                  marginBottom: 0,
                  textDecoration: 'none'
                }}
                onClick={() => {
                  handleSignIn(email, password)
                }}
              >
                Login
              </button>
              <section
                style={{
                  width: '110%',
                  justifyContent: 'center',
                  display: 'flex',
                  marginTop: 10,
                  cursor: 'pointer'
                }}
              >
                <div
                  onClick={() => {
                    toggleLogin(false)
                    setPasswordError('')
                    setEmailError('')
                  }}
                  style={{ fontSize: 12, textDecoration: 'underline' }}
                >
                  Not registered yet? Create an Account
                </div>
              </section>
            </section>
          </section>
        </section>
      </div>
    </>
  )
}
function SignUpUi ({
  toggleLogin,
  password,
  setPassword,
  email,
  setEmail,
  handleSignUp,
  errorsEmail,
  setEmailError,
  setPasswordError,
  emailError,
  passwordError,
  errorsPassword,
  loadingScreen,
  showLoadingScreen,
  displayLoadingScreen,
  username,
  setUsername,
  usernameErr,
  showuserNameErr,
  handleGoogle
}) {
  return (
    <>
      <div className={styles.box}>
        <section className={styles.right}>
          <div className={styles.logo}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='48px'
              viewBox='0 -960 960 960'
              width='48px'
              fill='#292727ff'
            >
              <path d='M639-120H180q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v459L639-120Zm-30-60v-83q0-35 26.5-61.5T697-351h83v-429H180v600h429ZM450-321h60v-258h129v-60H321v60h129v258Zm159 141Zm-429 0v-600 600Z' />
            </svg>
            Tripify
          </div>

          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>Sign Up</div>
            <div style={{ fontSize: 13 }}>Travel around the world</div>
          </section>

          <section className={styles.form}>
            <button
              onClick={() => {
                handleGoogle()
              }}
              style={{
                backgroundColor: '#ffffffff',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                color: '#000000ff',
                width: '100%',
                marginTop: 20,
                gap: 10,
                height: 35,
                marginBottom: 10,
                borderWidth: 0.01,
                borderColor: '#2120205f'
              }}
            >
              <img
                width='20'
                height='20'
                src='https://img.icons8.com/color/48/google-logo.png'
                alt='google-logo'
              />
              Sign up with Google
            </button>

            <div className={styles.or}>or sign up with email</div>

            <section>
              <section>
                {errorsEmail && (
                  <div style={{ color: 'red', marginTop: '1em', fontSize: 12 }}>
                    {emailError}
                  </div>
                )}
                <div>Email</div>
                <input
                  className={styles.input}
                  type='text'
                  placeholder='mail@gmail.com'
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                />
              </section>
              <section style={{ marginTop: 20 }}>
                {errorsPassword && (
                  <div style={{ color: 'red', marginTop: '1em', fontSize: 12 }}>
                    {passwordError}
                  </div>
                )}
                <div>Password</div>
                <input
                  className={styles.input}
                  type='text'
                  placeholder='1234abc'
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                  }}
                />

                {usernameErr && (
                  <div style={{ marginTop: 10, fontSize: 12, color: 'red' }}>
                    Please enter your Username
                  </div>
                )}
                <div>Username</div>
                <input
                  className={styles.input}
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value), showuserNameErr(false)
                  }}
                  type='text'
                  placeholder=''
                />
              </section>
              <section
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex' }}>
                  <input
                    style={{ width: 14 }}
                    type='checkbox'
                    name='remember'
                    id='remember'
                  />
                  <div style={{ color: '#000000ff', fontSize: 12 }}>
                    Remember me
                  </div>
                </div>
              </section>

              <Link
                to={'/login'}
                style={{
                  backgroundColor: '#5c23cdff',
                  border: 0,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  color: '#ffffffff',
                  width: '100%',
                  marginTop: 20,
                  gap: 10,
                  height: 35,
                  marginBottom: 0,
                  textDecoration: 'none'
                }}
                onClick={() => {
                  handleSignUp(email, password)
                }}
              >
                Sign Up
              </Link>
              <section
                style={{
                  width: '110%',
                  justifyContent: 'center',
                  display: 'flex',
                  marginTop: 10,
                  cursor: 'pointer'
                }}
              >
                <div
                  onClick={() => {
                    setPasswordError('')
                    setEmailError('')
                    toggleLogin(true)
                  }}
                  style={{ fontSize: 12, textDecoration: 'underline' }}
                >
                  Already have an accout ? Login
                </div>
              </section>
            </section>
          </section>
        </section>
      </div>
    </>
  )
}

function Animatedload () {
  return (
    <section className={styles.loading}>
      <DotLottieReact
        className={styles.animation}
        src='https://lottie.host/542cff02-2a96-438f-ad9e-39c48876735c/Fv7D7R7bsT.lottie'
        loop={true}
      />
    </section>
  )
}

function UserDetails () {
  return (
    <section className={styles.Details}>
      <section>
        <div>Please enter your Username</div>
        <input className={styles.input} type='text' placeholder='' />
        <button
          style={{
            backgroundColor: '#5c23cdff',
            border: 0,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            color: '#ffffffff',
            width: '100%',
            marginTop: 20,
            gap: 10,
            height: 35,
            marginBottom: 0,
            textDecoration: 'none'
          }}
        >
          Submit
        </button>
      </section>
    </section>
  )
}
