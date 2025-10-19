import { lazy, useState } from 'react'
import styles from './assets/styles/dashboard.module.css'
import { BsStars } from 'react-icons/bs'
import { IoIosSend } from 'react-icons/io'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GrPlan } from 'react-icons/gr'
import { FaHeart } from 'react-icons/fa'
import { IoIosSettings, IoMdNotifications } from 'react-icons/io'
import { IoChatbubbleEllipses, IoMenu } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'
import { IoSettingsSharp } from 'react-icons/io5'
import { MdOutlineEditNote } from 'react-icons/md'
import { RiAccountPinCircleFill } from 'react-icons/ri'
import { IoIosArrowDown } from 'react-icons/io'
import { FaHome } from 'react-icons/fa'
import { data, useNavigate } from 'react-router-dom'
import { FaArrowDown } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { nextPlaces } from './assets/utils/places'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useEffect, useRef } from 'react'
import { Trips } from './assets/utils/places'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { auth } from './assets/setting/firebase'
import { getIdToken } from 'firebase/auth'
gsap.registerPlugin(ScrollToPlugin)
const SavedTrips = lazy(() => import('./dashboardComp/saved'))
const LikedTrips = lazy(() => import('./dashboardComp/liked'))
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'

export default function Dashboard () {
  const [recent, showRecent] = useState(true)
  const navigate = useNavigate()
  const [next, setNext] = useState(nextPlaces)
  const [display, setDisplay] = useState('main')
  const [loadingScreen, showLoadingScreen] = useState(false)
  const [places, setPlaces] = useState(Trips)
  const [aiResults, showAiResults] = useState(false)
  const [aiPlaces, setAiPlaces] = useState([])
  const [aiSearch, setAiSearch] = useState('')
  const { state } = useLocation()
  const [aiLoad, showAiLoad] = useState(false)
  const [person, setPerson] = useState('')
  const [menuPanel, showMenuPanel] = useState(false)
  function openHome () {
    navigate('/')
  }

  const travelKeywords = [
    'trip',
    'vacation',
    'holiday',
    'beach',
    'mountain',
    'destination',
    'flight',
    'visit',
    'travel',
    'place',
    'country',
    'town',
    'city',
    'village',
    'enjoy',
    'plan',
    'family',
    'two',
    'getaway',
    'plane',
    'occasion',
    'tour',
    'beach',
    'game',
    'in',
    'experience',
    'feel',
    'celebrate',
    'to',
    'hiking',
    'hunting',
    'sea',
    'water',
    'swim',
    'play',
    'festival',
    'carnival',
    'education',
    'school',
    'church',
    'work',
    'leisure',
    'stress',
    'calm',
    'busy',
    'nature',
    'forest',
    'wild',
    'desert',
    'peace',
    'mind',
    'moon',
    'romantic',
    'day',
    'week',
    'month',
    'hotel',
    'a',
    'would',
    'like'
  ]

  async function askAi () {
    showAiLoad(true)
    const related = travelKeywords.some(item =>
      aiSearch.toLowerCase().includes(item)
    )

    if (!related) {
      showAiLoad(false)
      alert('Invalid sentence try something else')
      return
    }

    let lastMessageTime = 0
    const now = Date.now()
    if (now - lastMessageTime < 20000) {
      showAiLoad(false)
      alert('Please wait a moment before sending another request.')
      return
    }

    if (aiSearch.length > 100) {
      showAiLoad(false)
      alert('Your request should be short and clear in one sentence')
      return
    }

    if (!aiSearch.trim()) {
      showAiLoad(false)
      alert('Please type something')
      return
    }

    const user = auth.currentUser
    const token = await getIdToken(user)

    const res = await fetch(`${API_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        userInput: aiSearch
      })
    })
    const result = await res.json()
    // const result = [
    //   'New York City',
    //   'San Francisco',
    //   'Chicago',
    //   'Washington, D.C.',
    //   'Canadian Rockies',
    //   'Whistler',
    //   'Grand Canyon',
    //   'Zhangjiajie National Forest Park',
    //   'Huangshan (Yellow Mountains)',
    //   'Jiuzhaigou Valley',
    //   'Himalayas (Leh-Ladakh)',
    //   'Lake Baikal'
    // ]

    let use = []
    if (result) {
      showAiLoad(false)
      const towns = places.flatMap(item => {
        const each = item.places
        each.filter(town => {
          result.map(res => {
            if (town.name === res) {
              const generatedPlaces = {
                countryFlag: item.countryFlag,
                countryName: item.country,
                placeName: town.name,
                description: town.description,
                placeImage: town.image
              }
              use.push(generatedPlaces)
            }
          })
        })
      })

      if (towns) {
        showAiResults(true)
        setAiPlaces(use)
      }
    }
  }
  function runLoadAnimation () {
    if (state.message === 'saved') {
      showLoadingScreen(false)
    }
    showLoadingScreen(false)
  }

  function openTab () {
    if (state.name) {
      setPerson(state.name)
    }

    if (state.message === 'AI') {
      setDisplay('main')
    }
    if (state.message === 'liked') {
      setDisplay('liked')
    }
    if (state.message === 'saved') {
      setDisplay('saved')
    }
  }

  useEffect(() => {
    openTab(), runLoadAnimation()
  }, [])

  const [isMobile, setIsMobile] = useState(innerWidth < 450)

  return (
    <main className={styles.body}>
      {isMobile ? (
        menuPanel && (
          <section className={styles.Mobileside}>
            <SidebarHelp
              setDisplay={setDisplay}
              openHome={openHome}
              display={display}
            />
            <SidebarHistory />
          </section>
        )
      ) : (
        <section className={styles.side}>
          <SidebarHelp
            setDisplay={setDisplay}
            openHome={openHome}
            display={display}
          />
          <SidebarHistory />
        </section>
      )}

      {display === 'main' && (
        <MainBoard
          aiSearch={aiSearch}
          setAiSearch={setAiSearch}
          askAi={askAi}
          openHome={openHome}
          next={next}
          aiLoad={aiLoad}
          aiPlaces={aiPlaces}
          aiResults={aiResults}
          showAiResults={showAiResults}
          setAiPlaces={setAiPlaces}
          person={person}
          showMenuPanel={showMenuPanel}
          menuPanel={menuPanel}
          isMobile={isMobile}
        />
      )}
      {display === 'saved' && (
        <SavedTrips
          isMobile={isMobile}
          menuPanel={menuPanel}
          showMenuPanel={showMenuPanel}
        />
      )}
      {display === 'liked' && (
        <LikedTrips
          isMobile={isMobile}
          menuPanel={menuPanel}
          showMenuPanel={showMenuPanel}
        />
      )}
    </main>
  )
}

function SidebarHelp ({ openHome, setDisplay, display }) {
  return (
    <section className={styles.SidebarHelp}>
      <div
        onClick={() => {
          openHome()
        }}
        className={styles.logo}
      >
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

      <section className={styles.box}>
        <div
          style={
            display === 'main'
              ? { backgroundColor: 'rgba(98, 99, 99, 0.356)' }
              : { backgroundColor: 'inherit' }
          }
          onClick={() => {
            setDisplay('main')
          }}
        >
          <IoChatbubbleEllipses />
          Travel Assitant
        </div>

        <div
          style={
            display === 'saved'
              ? { backgroundColor: 'rgba(98, 99, 99, 0.356)' }
              : { backgroundColor: 'inherit' }
          }
          onClick={() => {
            setDisplay('saved')
          }}
        >
          <GrPlan /> My Trips
        </div>

        <div
          style={
            display === 'liked'
              ? { backgroundColor: 'rgba(98, 99, 99, 0.356)' }
              : { backgroundColor: 'inherit' }
          }
          onClick={() => {
            setDisplay('liked')
          }}
        >
          <FaHeart /> Liked Places
        </div>

        <div>
          <CiSearch /> Discover
        </div>

        <div>
          <RiAccountPinCircleFill />
          My Account
        </div>
      </section>
    </section>
  )
}

function SidebarHistory () {
  return (
    <section className={styles.SidebarHistory}>
      <section style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className={styles.recent}>
          Last 7 days
          <IoIosArrowDown />
        </div>
      </section>
    </section>
  )
}

function MainBoard ({
  next,
  openHome,
  askAi,
  aiSearch,
  setAiSearch,
  aiLoad,
  aiPlaces,
  aiResults,
  showAiResults,
  setAiPlaces,
  person,
  showMenuPanel,
  menuPanel,
  isMobile
}) {
  const containerRef = useRef(null)
  const AIREF = useRef(null)
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  function openAddScreen (item) {
    console.log(item)
    navigate('/', { state: { message: 'addScreen', destination: item } })
  }

  function moveTrigger () {
    gsap.to(containerRef.current, {
      duration: 0.5,
      scrollTo: {
        y: 600,
        offsetY: 50
      },
      ease: 'power1.inOut'
    })
  }
  return (
    <section
      onClick={() => {
        if (menuPanel) {
          showMenuPanel(false)
        }
      }}
      ref={containerRef}
      className={styles.main}
      style={{ position: 'relative' }}
    >
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
            color: 'white'
          }}
          onClick={() => {
            showMenuPanel(true)
          }}
        >
          <IoMenu />
        </div>
      )}
      <section className={styles.top}>
        <div
          onClick={() => {
            openHome()
          }}
        >
          <FaHome style={{ fontSize: 14 }} />
          Home
        </div>
        <div>
          <IoIosSettings style={{ fontSize: 14 }} />
          Settings
        </div>
        <div>
          <IoMdNotifications style={{ fontSize: 14 }} /> Notification
        </div>
      </section>

      <div className={styles.welcome}>Welcome back , {person}</div>
      <div className={styles.mainText}>
        Describe your dream vacation or trip in one sentence
      </div>

      <section className={styles.search}>
        <div
          style={{
            display: 'flex',
            gap: 20,
            width: '90%',
            backgroundColor: 'white',
            alignItems: 'center'
          }}
        >
          <div className={styles.icon}>
            <BsStars />
          </div>
          <input
            value={aiSearch}
            onChange={e => {
              setAiSearch(e.target.value)
            }}
            type='text'
            placeholder='weekend vaction for three in hiroshima...'
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div
            onClick={() => {
              askAi()
              moveTrigger()
            }}
            className={styles.send}
          >
            <IoIosSend />
          </div>
        </div>
      </section>

      <ul className={styles.suggestion}>
        <li onClick={() => [setAiSearch('I want a 9-day trip to Russia')]}>
          I want a 9-day trip to Russia
        </li>
        <li onClick={() => [setAiSearch('A romantic 3-day trip at the beach')]}>
          A romantic 3-day trip at the beach
        </li>
        <li onClick={() => [setAiSearch('5 days business days in Europe')]}>
          5 days business days in Europe
        </li>
      </ul>

      <section className={styles.gridText}>Your AI Recommendations</section>
      <section ref={AIREF} className={styles.recommend}>
        {aiLoad && (
          <section className={styles.results}>
            <h2>Generating results ...</h2>
            <DotLottieReact
              className={styles.anime}
              src='https://lottie.host/1a0397df-0ecc-48eb-b0c9-165c5e1a784b/EpLQdnggeo.lottie'
              loop
              autoplay
            />
          </section>
        )}
        {aiResults
          ? aiPlaces.map(item => (
              <section key={item.placeName} className={styles.each}>
                <img
                  className={styles.image}
                  src={item.placeImage}
                  alt='photo'
                />

                <section className={styles.country}>
                  <img src={item.countryFlag} className={styles.flag}></img>
                  <div className={styles.countryName}>{item.countryName}</div>
                </section>

                <div
                  onClick={() => {
                    openAddScreen(item.placeName)
                  }}
                  className={styles.add}
                >
                  Add To Trip
                </div>

                <section className={styles.context}>
                  <div className={styles.town}>{item.placeName}</div>
                  <div className={styles.description}>{item.description}</div>
                </section>
              </section>
            ))
          : next.map(item => (
              <section key={item.name} className={styles.each}>
                <img className={styles.image} src={item.image} alt='photo' />
                <div
                  onClick={() => {
                    openAddScreen(item.name)
                  }}
                  className={styles.add}
                >
                  Add To Trip
                </div>

                <section className={styles.country}>
                  <img src={item.countryFlag} className={styles.flag}></img>
                  <div className={styles.countryName}>{item.country}</div>
                </section>

                <section className={styles.context}>
                  <div className={styles.town}>{item.name}</div>
                  <div className={styles.description}>{item.description}</div>
                </section>
              </section>
            ))}
      </section>
    </section>
  )
}
