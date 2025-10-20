import styles from '../assets/styles/saved.module.css'
import { useState, useEffect, use } from 'react'
import { auth } from '../assets/setting/firebase'
import { getIdToken } from 'firebase/auth'
import { Trips } from '../assets/utils/places'
import { Suspense, lazy } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useNavigate } from 'react-router-dom'
import ghanaFlag from '../assets/img/places/ghana/ghana.png'
import indiaFlag from '../assets/img/places/india/india.png'
import russiaFlag from '../assets/img/places/russia/russia.png'
import franceFlag from '../assets/img/places/france/france.png'
import chinaFlag from '../assets/img/places/china/china.png'
import nigeriaFlag from '../assets/img/places/nigeria/nigeria.png'
import japanFlag from '../assets/img/places/japan/japan.png'
import brazilFlag from '../assets/img/places/brazil/brazil.png'
import uaeFlag from '../assets/img/places/uae/uae.png'
import usaFlag from '../assets/img/places/usa/usa.png'
import ukFlag from '../assets/img/places/uk/uk.png'
import spainFlag from '../assets/img/places/spain/spain.png'
import southAfricaFlag from '../assets/img/places/southAfrica/southAfrica.png'
import kenyaFlag from '../assets/img/places/kenya/kenya.png'
import canadaFlag from '../assets/img/places/canada/canada.png'
import { IoMdMore, IoMdClose } from 'react-icons/io'
import { LuNotebook } from 'react-icons/lu'
import { IoMenu } from 'react-icons/io5'
export default function SavedTrips ({ isMobile, showMenuPanel, menuPanel }) {
  const [history, setHistory] = useState([])
  const [loadingScreen, showLoadingScreen] = useState(false)
  const [edit, showEdit] = useState(false)
  const [places, setPlaces] = useState(Trips)
  const [NotFound, showNotFound] = useState(false)

  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'



    async function removeSavedTrip (item) {
      try {
        const user = auth.currentUser
        const token = await user.getIdToken()
        if (!token) {
          console.log('not working becaus of token')
        }
  
        const res = await fetch(`${API_URL}/api/RemoveSaved`, {
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
          ReadData();
        }
      } catch (error) {
        console.log(error.message)
      }
    }



  async function ReadData () {
    try {
      showLoadingScreen(true)

      const timer = setTimeout(() => {
        showLoadingScreen(false)
      }, 5000)
      const user = auth.currentUser
      const token = await user.getIdToken()

      if (token) {
        try {
          const res = await fetch(`${API_URL}/api/trips`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          })

          const data = await res.json()

          if (data.length === 0) {
            showNotFound(true)
          }

          if (data.length > 0) {
            showLoadingScreen(false)
            showNotFound(false)
            const updatedData = data.map(item => {
              const country = item.body.country

              let flag

              switch (country) {
                case 'UAE':
                  flag = uaeFlag
                  break
                case 'Ghana':
                  flag = ghanaFlag
                  break
                case 'Italy':
                  flag = italyFlag
                  break
                case 'Japan':
                  flag = japanFlag
                  break

                case 'India':
                  flag = indiaFlag
                  break

                case 'Russia':
                  flag = russiaFlag
                  break
                case 'China':
                  flag = chinaFlag
                  break
                case 'France':
                  flag = franceFlag
                  break
                case 'Nigeria':
                  flag = nigeriaFlag
                  break
                case 'Brazil':
                  flag = brazilFlag
                  break
                case 'USA':
                  flag = usaFlag
                  break
                case 'Spain':
                  flag = spainFlag
                  break

                default:
                  flag = ghanaFlag
              }

              let placeImg
              const placeTowns = places.flatMap(p => p.places)
              const matched = placeTowns.find(
                each => each.name === item.body.destination
              )

              if (matched) {
                placeImg = matched.image
              }

              return { ...item, flag, placeImage: placeImg, editMode: false }
            })
            setHistory(updatedData)
          }
        } catch (error) {
          console.log('error,', error.message)
        }
      }
    } catch (error) {
      alert('Please Login or sign up')
      navigate('/login')
    }
  }

  function intoEditMode (input) {
    showEdit(true)
    setHistory(prev =>
      prev.map(item => {
        if (item.body.destination === input) {
          return { ...item, editMode: true }
        }

        return { ...item, editMode: false }
      })
    )
  }

  function outOfEditMode (input) {
    showEdit(false)
    setHistory(prev =>
      prev.map(item => {
        if (item.body.destination === input) {
          return { ...item, editMode: false }
        }
        return { ...item, editMode: false }
      })
    )
  }
  useEffect(() => {
    ReadData()
  }, [])

  return (
    <Suspense>
      <main
        onClick={() => {
          if (menuPanel) {
            showMenuPanel(false)
          }
        }}
        className={styles.saved}
      >
        <section className={styles.head}>
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
          <h2>Saved Trips</h2>
          <p>Browse through all your saved trips and destination here</p>
        </section>

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
                Start by Saving{' '}
                <span>
                  <LuNotebook />
                </span>{' '}
                some trips
              </div>
            </section>
          )}
          {history.map(item => (
            <section key={item.body.destination} className={styles.each}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <img src={item.flag} alt='photo' className={styles.image}></img>
                {item.editMode ? (
                  <div
                    onClick={() => {
                      outOfEditMode(item.body.destination)
                    }}
                    className={styles.more}
                  >
                    <IoMdClose />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      intoEditMode(item.body.destination)
                    }}
                    className={styles.more}
                  >
                    <IoMdMore />
                  </div>
                )}

                {item.editMode && (
                  <div className={styles.moreSettings}>
                    <div>Edit</div>
                    <div onClick={() => {removeSavedTrip(item.body.destination)}}>Delete</div>
                  </div>
                )}
              </div>
              <div className={styles.placeName}>{item.body.destination}</div>

              <section className={styles.placeImage}>
                <img src={item.placeImage} alt='photo' />
              </section>

              <section className={styles.hidden}>
                <div className={styles.notes}>{item.body.note}</div>
              </section>
              <section className={styles.locationField}>
                <div>From</div>
                <div className={styles.location}>{item.body.location}</div>
              </section>
              <section className={styles.dateField}>
                <section className={styles.departureDate}>
                  <div>Departure</div>
                  <div className={styles.date}>{item.body.departureDate}</div>
                </section>
                <section className={styles.ArrivalDate}>
                  <div>Arrival</div>
                  <div className={styles.date}>{item.body.arrivalDate}</div>
                </section>
              </section>
            </section>
          ))}
        </section>
      </main>
    </Suspense>
  )
}
