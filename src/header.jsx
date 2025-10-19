import { gsap } from 'gsap'
gsap.registerPlugin(MotionPathPlugin)
import MotionPathPlugin from 'gsap/MotionPathPlugin'
import tokyoImg from './assets/img/tokyo.jpg'
import newYorkImg from './assets/img/newyork1.jpg'
import romeImg from './assets/img/rome.jpg'
import souelImg from './assets/img/seoul.jpg'
import parisImg from './assets/img/paris.jpg'
import france from './assets/img/france.png'
import italy from './assets/img/italy.png'
import korea from './assets/img/korea.png'
import japan from './assets/img/japan.png'
import usa from './assets/img/usa.png'
import styles from './assets/styles/home.module.css'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBars,
  faCross,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { auth } from './assets/setting/firebase'
import { onAuthStateChanged, getIdToken } from 'firebase/auth'

export default function Header ({
  openLink,
  setOpenLink,
  timeoutRefs,
  lottieRef,
  toggleStatus,
  showVerifiedBox,
  setMessage,
  searchArray,
  setSearched,
  API_URL
}) {
  const box1ref = useRef(null)
  const box2ref = useRef(null)
  const box3ref = useRef(null)
  const box4ref = useRef(null)
  const box5ref = useRef(null)
  const [name, showName] = useState(false)
  const [person, setPerson] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 508)
  const [menu, showMenu] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [menuDetails, showMenuDetails] = useState(false)
  const navigate = useNavigate()

  function checker () {
    if (window.innerWidth <= 500) {
      showMenu(true)
    }
  }

  useEffect(() => {
    checker()
  }, [isMobile])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        try {
          const user = auth.currentUser
          const token = await getIdToken(user)

          const res = await fetch(`${API_URL}/api/users`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log(res)
          const data = await res.json()
          if (data) {
            showName(true)
            const userName = data.split(' ')[0]
            setPerson(userName)
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message)
        }
      } else {
        showName(false)
        console.log('no user')
      }
    })

    return () => unsubscribe()
  }, [])

  function openDashboard (item) {
    try {
      const user = auth.currentUser

      if (!user) {
        clearTimeout(timeoutRefs.current.time1)
        clearTimeout(timeoutRefs.current.time2)

        toggleStatus(false)
        showVerifiedBox(true)

        setMessage('Please Sign up or Sign in')

        timeoutRefs.current.time1 = setTimeout(() => {
          toggleStatus(true)
        }, 3000)

        timeoutRefs.current.time2 = setTimeout(() => {
          showVerifiedBox(false)
        }, 5000)

        return
      }

      const token = user.getIdToken()

      if (!token) {
        clearTimeout(timeoutRefs.current.time1)
        clearTimeout(timeoutRefs.current.time2)

        lottieRef.current?.stop()
        toggleStatus(false)
        showVerifiedBox(true)

        setMessage('Please Sign in')

        timeoutRefs.current.time1 = setTimeout(() => {
          toggleStatus(true)
        }, 3000)

        timeoutRefs.current.time2 = setTimeout(() => {
          showVerifiedBox(false)
        }, 5000)

        return
      }

      if (token) {
        navigate('/dashboard', { state: { message: item, name: person } })
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (openLink === 'login') {
      navigate('/login')
    }
    if (openLink === 'signup') {
      navigate('/login')
    }
  }, [openLink])

  useEffect(() => {
    let animation1

    if (!isMobile) {
      requestIdleCallback(() => {
        animation1 = gsap.to(box1ref.current, {
          duration: 60,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: [
              { xPercent: 10, yPercent: 200 },
              { xPercent: 900, yPercent: 200 },
              { xPercent: -0, yPercent: -100 },
              { xPercent: 0, yPercent: 0 }
            ],
            curviness: 1
          }
        })
      })
    }

    return () => {
      if (animation1) animation1.kill()
    }
  }, [isMobile])

  useEffect(() => {
    let animation2

    if (!isMobile) {
      requestIdleCallback(() => {
        animation2 = gsap.to(box2ref.current, {
          duration: 60,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: [
              { xPercent: 10, yPercent: 50 },
              { xPercent: 750, yPercent: -100 },
              { xPercent: -110, yPercent: -300 },
              { xPercent: 0, yPercent: 0 }
            ],
            curviness: 1
          }
        })
      })
    }

    return () => {
      if (animation2) animation2.kill()
    }
  }, [isMobile])

  useEffect(() => {
    let animation3

    if (!isMobile) {
      requestIdleCallback(() => {
        animation3 = gsap.to(box3ref.current, {
          duration: 60,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: [
              { xPercent: 10, yPercent: 50 },
              { xPercent: 350, yPercent: -200 },
              { xPercent: -450, yPercent: -300 },
              { xPercent: -100, yPercent: 100 },
              { xPercent: 0, yPercent: 0 }
            ],
            curviness: 1
          }
        })
      })
    }

    return () => {
      if (animation3) animation3.kill()
    }
  }, [isMobile])

  useEffect(() => {
    let animation4

    if (!isMobile) {
      requestIdleCallback(() => {
        animation4 = gsap.to(box4ref.current, {
          x: box4ref.current,
          y: box4ref.current,
          duration: 60,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: [
              { xPercent: -150, yPercent: -200 },
              { xPercent: -900, yPercent: -100 },
              { xPercent: -10, yPercent: 140 },
              { xPercent: 100, yPercent: 20 },
              { xPercent: box4ref.current, yPercent: box4ref.current }
            ],
            curviness: 1
          }
        })
      })
    }

    return () => {
      if (animation4) animation4.kill()
    }
  }, [isMobile])

  useEffect(() => {
    let animation5

    if (!isMobile) {
      requestIdleCallback(() => {
        animation5 = gsap.to(box5ref.current, {
          x: box4ref.current,
          y: box4ref.current,
          duration: 60,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: [
              { xPercent: -550, yPercent: 0 },
              { xPercent: -100, yPercent: 500 },
              { xPercent: 400, yPercent: 0 },
              { xPercent: 10, yPercent: 10 },
              { xPercent: box4ref.current, yPercent: box4ref.current }
            ],
            curviness: 1
          }
        })
      })
    }

    return () => {
      if (animation5) animation5.kill()
    }
  }, [isMobile])

  function moveTrigger () {
    gsap.to(window, {
      duration: 0.5,
      scrollTo: {
        y: 1100,
        offsetY: 50
      },
      ease: 'power1.inOut'
    })
  }

  return (
    <section className={styles.head}>
      <section className={styles.heading}>
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

        {menuDetails && isMobile && (
          <section className={styles.headBar}>
            <article>
              <div
                onClick={() => {
                  openDashboard(' AI')
                }}
              >
                Dashboard
              </div>
              <div
                onClick={() => {
                  openDashboard('liked')
                }}
              >
                Liked Place
              </div>
              <div
                onClick={() => {
                  openDashboard('saved')
                }}
              >
                Saved Trips
              </div>
              <div
                onClick={() => {
                  openDashboard('AI')
                }}
              >
                AI
              </div>
              <div>Help</div>
            </article>
            <section>
              {name ? (
                <div className={styles.Link}>Hi {person}</div>
              ) : (
                <Link
                  className={styles.Link}
                  onClick={() => {
                    setOpenLink('signup')
                  }}
                >
                  Join now
                </Link>
              )}
            </section>
          </section>
        )}

        {!isMobile && (
          <section className={styles.headBar}>
            <article>
              <div
                onClick={() => {
                  openDashboard('AI')
                }}
              >
                Dashboard
              </div>
              <div
                onClick={() => {
                  openDashboard('liked')
                }}
              >
                Liked Places
              </div>
              <div
                onClick={() => {
                  openDashboard('saved')
                }}
              >
                Saved Trips
              </div>
              <div
                onClick={() => {
                  openDashboard('AI')
                }}
              >
                AI
              </div>
              <div>Help</div>
            </article>
            <section>
              {name ? (
                <div className={styles.Link}>Hi {person}</div>
              ) : (
                <Link
                  className={styles.Link}
                  onClick={() => {
                    setOpenLink('signup')
                  }}
                >
                  Join now
                </Link>
              )}
            </section>
          </section>
        )}

        {menu && (
          <>
            {toggle ? (
              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  right: '10%',
                  top: '27%',
                  fontSize: 23
                }}
                onClick={() => {
                  showMenuDetails(false)
                  setToggle(!toggle)
                }}
                icon={faXmark}
              />
            ) : (
              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  right: '10%',
                  top: '27%',
                  fontSize: 23
                }}
                onClick={() => {
                  showMenuDetails(true)
                  setToggle(!toggle)
                }}
                icon={faBars}
              />
            )}
          </>
        )}
      </section>

      <div
        style={{
          display: 'flex',
          gap: 20,
          width: '90%',
          height: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <div ref={box1ref} className={styles.box1}>
          <section className={styles.boxImage}>
            <img
              loading={'lazy'}
              className={styles.Images}
              src={parisImg}
              alt='tok'
            />
          </section>
          <div className={styles.boxText}> Paris</div>
          <div className={styles.flag}>
            <img
              loading={'lazy'}
              className={styles.flagImg}
              src={france}
              alt='italy'
            />
          </div>
        </div>
        <div ref={box2ref} className={styles.box2}>
          <section className={styles.boxImage}>
            <img
              loading={'lazy'}
              className={styles.Images}
              src={romeImg}
              alt='tok'
            />
          </section>
          <div className={styles.boxText}> Rome</div>
          <div className={styles.flag}>
            <img
              loading={'lazy'}
              className={styles.flagImg}
              src={italy}
              alt='italy'
            />
          </div>
        </div>
        <div ref={box3ref} className={styles.box3}>
          <section className={styles.boxImage}>
            <img
              loading={'lazy'}
              className={styles.Images}
              src={souelImg}
              alt='tok'
            />
          </section>
          <div className={styles.boxText}> Souel</div>
          <div className={styles.flag}>
            <img
              loading={'lazy'}
              className={styles.flagImg}
              src={korea}
              alt='korea'
            />
          </div>
        </div>
        <div ref={box4ref} className={styles.box4}>
          <section className={styles.boxImage}>
            <img
              loading={'lazy'}
              className={styles.Images}
              src={newYorkImg}
              alt='tok'
            />
          </section>
          <div className={styles.boxText}> New York</div>
          <div className={styles.flag}>
            <img
              loading={'lazy'}
              className={styles.flagImg}
              src={usa}
              alt='usa'
            />
          </div>
        </div>
        <div ref={box5ref} className={styles.box5}>
          <section className={styles.boxImage}>
            <img
              loading={'lazy'}
              className={styles.Images}
              src={tokyoImg}
              alt='tok'
            />
          </section>
          <div className={styles.boxText}>Tokyo</div>
          <div className={styles.flag}>
            <img
              loading={'lazy'}
              className={styles.flagImg}
              src={japan}
              alt='japan'
            />
          </div>
        </div>

        <section className={styles.middle}>
          <div className={styles.question}>Wheres your next destination ?</div>
          <section className={styles.search}>
            {searchArray.length > 0 && (
              <section className={styles.hiddenSearch}>
                {searchArray.map(item => (
                  <div onClick={moveTrigger} key={`${item}-${Math.random()}`}>
                    {item}
                  </div>
                ))}
              </section>
            )}
            <section style={{ display: 'flex', flexDirection: 'row' }}>
              <input
                onChange={e => {
                  setSearched(e.target.value)
                }}
                type='text'
              />
            </section>
            <section
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                paddingLeft: 20
              }}
            >
              <div className={styles.middleText}>best places in the world</div>
              <div className={styles.middleText}>Create a new trip</div>
              <div className={styles.middleText}>
                historical sites and monuments
              </div>
            </section>
          </section>
        </section>
      </div>
    </section>
  )
}
