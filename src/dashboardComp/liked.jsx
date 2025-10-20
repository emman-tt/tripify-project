import React from 'react'
import { useState, useRef, useEffect } from 'react'
import styles from '../assets/styles/liked.module.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { auth } from '../assets/setting/firebase'
import { getIdToken } from 'firebase/auth'
import { FaHeart } from 'react-icons/fa6'
import { IoMenu } from 'react-icons/io5'

export default function LikedTrips ({ menuPanel, showMenuPanel, isMobile }) {
  const [history, setHistory] = useState([])
  const [loadingScreen, showLoadingScreen] = useState(false)
  const [NotFound, showNotFound] = useState(false)
  const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'
  async function removeLiked (item) {
    try {
      const user = auth.currentUser
      const token = await user.getIdToken()
      if (!token) {
        console.log('not working becaus of token')
      }

      const res = await fetch(`${API_URL}/api/RemoveLiked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: item
        })
      })

      if (res) {
        fecthLiked()
      }
    } catch (error) {
      console.log(error.message)
    }
  }


  async function fecthLiked () {
    try {
      showLoadingScreen(true)

      const user = auth.currentUser
      const token = await getIdToken(user)

      if (!token) {
        console.log('not working becaus of token')
      }

      if (token) {
        const res = await fetch(`${API_URL}/api/liked`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()
        if (data) {
          showLoadingScreen(false)
          setHistory(data)
          showNotFound(false)
        }

        if (data.length === 0) {
          showNotFound(true)
        }
      }
    } catch (error) {
      console.log('please sign in or sign up')
    }
  }

  useEffect(() => {
    fecthLiked()
  }, [])
  return (
    <main
      onClick={() => {
        if (menuPanel) {
          showMenuPanel(false)
        }
      }}
      className={styles.liked}
    >
      {loadingScreen && (
        <section className={styles.loading}>
          <DotLottieReact
            className={styles.animation}
            src='https://lottie.host/542cff02-2a96-438f-ad9e-39c48876735c/Fv7D7R7bsT.lottie'
            loop={true}
            autoplay
          />
        </section>
      )}

      <section style={{ position: 'relative' }} className={styles.head}>
        {isMobile && (
          <div
            style={{
              position: 'absolute',
              right: '5%',
              top: '2%',
              fontSize: 40,
              backgroundColor: 'rgb(24, 35, 55)',
              borderRadius: 14,
              display: 'flex',
              padding: 7,
              color: 'white',
              zIndex: 9
            }}
            onClick={() => {
              showMenuPanel(true)
            }}
          >
            <IoMenu />
          </div>
        )}
        <h2>Liked Trips</h2>
        <p>Browse through all your liked trips and destination here</p>
      </section>

      <section className={styles.box}>
        {NotFound && (
          <section className={styles.notFound}>
            <DotLottieReact
              className={styles.anime}
              src='https://lottie.host/235b42b6-c668-4331-83ed-079782513471/H0DzBxaSxH.lottie'
              loop
              autoplay
            />

            <div className={styles.advice}>
              Start by Liking
              <span>
                <FaHeart />
              </span>
              some trips
            </div>
          </section>
        )}
        {history.map(item => (
          <section key={item.id} className={styles.each}>
            <button
              onClick={() => {
                removeLiked(item.body.name)
              }}
              className={styles.remove}
            >
              remove
            </button>
            <div className={styles.image}>
              <img src={item.body.image} alt='photo' />
            </div>
            <h4 style={{ marginTop: 20 }}>{item.body.name}</h4>
            <div className={styles.description}>{item.body.description}</div>
            <button className={styles.add}>Add to Trip</button>
          </section>
        ))}
      </section>
    </main>
  )
}
