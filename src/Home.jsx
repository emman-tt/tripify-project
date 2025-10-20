import styles from './assets/styles/home.module.css'
import { useEffect, useRef, useState } from 'react'
import { Suspense, lazy } from 'react'
import { Trips } from './assets/utils/places'
import {
  allTrips,
  activePlacesTab,
  conditionsList
} from './assets/utils/places'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useNavigate, useLocation } from 'react-router-dom'
import tripStyles from './assets/styles/tripUi.module.css'
import { MdVerified, MdNewReleases } from 'react-icons/md'
const MainContent = lazy(() => import('./body'))
const Header = lazy(() => import('./header'))
const FooterUi = lazy(() => import('./footer'))
const AddNewTripScreen = lazy(() => import('./addScreen'))
import { auth } from './assets/setting/firebase'
import { onAuthStateChanged } from 'firebase/auth'
export default function Home () {
  const [place, setPlace] = useState(Trips)
  const [allPlace, setAllPlace] = useState(allTrips)
  const [countries, setCountries] = useState([])
  const [townNames, setTownNames] = useState([])
  const [filter, setFilter] = useState('')
  const [filterList, showFilterList] = useState(false)
  const [conditions, setConditions] = useState([])
  const [activeTabCountry, setActiveTabCountry] = useState(activePlacesTab)
  const [conditionalList, setConditionalList] = useState(conditionsList)
  const [addTripUi, showAddTripUi] = useState(false)
  const [destination, setDestination] = useState('')
  const [location, setLocation] = useState('')
  const [selectedArrivalDate, setSelectedArrivalDate] = useState(null)
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(null)
  const [overlay, showOverlay] = useState(false)
  const navigate = useNavigate()
  const [openLink, setOpenLink] = useState('')
  const [searched, setSearched] = useState('')
  const [lineConditions, showLineConditons] = useState(conditionsList)
  const [realConditions, setRealConditions] = useState([])
  const [searchArray, setSearchArray] = useState([])
  const [likedchange, setLikedChange] = useState(false)
  const [verifiedBox, showVerifiedBox] = useState(false)
  const [status, toggleStatus] = useState(false)
  const [message, setMessage] = useState('Please Sign up or Sign In')
  const [verified, setVerified] = useState(false)
  const { state } = useLocation()
  const API_URL =
    import.meta.env.VITE_APP_API_URL ||
    'https://tripify-backend-jfjs.onrender.com'

  useEffect(() => {
    if (state?.message === 'addScreen') {
      showOverlay(true)
      setDestination(state.destination)
      showAddTripUi(true)
    }
  }, [])

  function showCountries () {
    const country = place.map(item => item.country)
    const towns = allPlace.map(item => item.places)
    const townN = towns[0].map(item => item)
    setTownNames(townN)
    setCountries(country)
  }

  function filterOnSearch () {
    if (searched === '') {
      const towns = allPlace.map(item => item.places)
      const townN = towns[0].map(item => item)

      toggleCountry(filter)
      setTownNames(townN)
    }
    const array = place.flatMap(item => item)
    const each = array.map(item => item.places.map(i => i.name))

    const real = place.map(item => item.places)

    let itemArr = []
    let searchTownsArr = []
    setSearchArray(itemArr)
    const eachPlace = each.filter(item => {
      if (searched.length >= 3) {
        item.filter(i => {
          if (i.toLocaleLowerCase().includes(searched.toLocaleLowerCase())) {
            itemArr.push(i)
            const towns = place.flatMap(item => item.places)
            const matched = towns.filter(item => {
              if (item.name === i) {
                searchTownsArr.push(item)
              }

              setTownNames(searchTownsArr)
            })
          }
        })

        setSearchArray(itemArr)
      }
    })
  }

  useEffect(() => {
    filterOnSearch()
  }, [searched])

  function filterOnConditions () {
    const selectedCountryData = place.find(item => item.country === filter)

    if (!selectedCountryData) return []

    if (filter.toLocaleLowerCase() === 'all') {
      console.log('working')
    }
    const towns = selectedCountryData.places
    const matched = towns.filter(town =>
      conditions.every(cond => town.conditions[cond] === true)
    )

    setTownNames(matched)
  }

  useEffect(() => {
    filterOnConditions()
  }, [filter, conditions])

  function addToConditions (item) {
    if (!item) return

    const match = lineConditions.find(val => val.value === item)
    if (match) {
      const use = match.instance
      setRealConditions(prev =>
        prev.includes(use) ? prev.filter(cond => cond !== use) : [use, ...prev]
      )
    }

    filterOnConditions()

    setConditionalList(prev =>
      prev.map(i => (i.value === item ? { ...i, active: !i.active } : i))
    )

    setConditions(prev =>
      prev.includes(item) ? prev.filter(cond => cond !== item) : [item, ...prev]
    )
  }

  function removeCondition (instance) {
    setRealConditions(prev => prev.filter(cond => cond !== instance))

    console.log(realConditions)
    console.log(instance)
    const match = conditionalList.find(c => c.instance === instance)
    if (!match) return

    const value = match.value

    setConditions(prev => prev.filter(cond => cond !== value))

    setConditionalList(prev =>
      prev.map(c => (c.instance === instance ? { ...c, active: false } : c))
    )

    filterOnConditions()
  }

  function toggleCountry (place) {
    setActiveTabCountry(prev =>
      prev.map(item =>
        item.country === place
          ? { ...item, active: !item.active }
          : { ...item, active: false }
      )
    )
    filterOnConditions()
  }

  function ClearAll () {
    setConditions([])
    setConditionalList(prev =>
      prev.map(item => {
        return { ...item, active: false }
      })
    )

    setRealConditions([])
  }

  useEffect(() => {
    showCountries()
  }, [])

  function searchFilter () {
    const countries = place.filter(item => {
      if (item.country === filter) {
        const country = item.places
        highlightCountry()
        setTownNames(country)
        filterOnConditions()
      }
    })

    if (filter.toLocaleLowerCase() === 'all') {
      const country = allPlace.filter(item => item.places)
      const town = country[0].places

      setTownNames(town)
    }
  }

  function highlightCountry () {
    setPlace(prev =>
      prev.map(item =>
        item.country === filter
          ? { ...item, active: !item.active }
          : { ...item, active: false }
      )
    )
  }

  function addToLiked (input) {
    place.map(item => {
      const matched = item.places.map(i => {
        if (i.name === input) {
          saveLikedTrips(i)
        }
      })
    })
  }
  useEffect(() => {
    if (!likedchange) {
      return
    }

    saveLikedTrips()
  }, [likedchange])

  const timeoutRefs = useRef({ time1: null, time2: null })
  const lottieRef = useRef()
  async function saveLikedTrips (item) {
    try {
      const user = auth.currentUser

      if (!user) {
        clearTimeout(timeoutRefs.current.time1)
        clearTimeout(timeoutRefs.current.time2)

        lottieRef.current?.stop()
        toggleStatus(false)
        showVerifiedBox(true)

        timeoutRefs.current.time1 = setTimeout(() => {
          toggleStatus(true)
        }, 3000)

        timeoutRefs.current.time2 = setTimeout(() => {
          showVerifiedBox(false)
        }, 5000)
        return
      }
      const token = await user.getIdToken()

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

      clearTimeout(timeoutRefs.current.time1)
      clearTimeout(timeoutRefs.current.time2)

      lottieRef.current?.stop()
      toggleStatus(false)
      showVerifiedBox(true)
      setVerified(true)
      timeoutRefs.current.time1 = setTimeout(() => {
        toggleStatus(true)
      }, 3000)

      timeoutRefs.current.time2 = setTimeout(() => {
        showVerifiedBox(false)
      }, 5000)
      setMessage('Added to Liked Trips')

      await fetch(`${API_URL}/api/Liked`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          placeName: item.name,
          placeImage: item.image,
          placeDescription: item.description
        })
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  async function saveNewTrip (item) {
    savior(item)
  }

  async function savior (item) {
    try {
      const user = auth.currentUser
      if (!user) {
        clearTimeout(timeoutRefs.current.time1)
        clearTimeout(timeoutRefs.current.time2)

        lottieRef.current?.stop()
        toggleStatus(false)
        showVerifiedBox(true)

        timeoutRefs.current.time1 = setTimeout(() => {
          toggleStatus(true)
        }, 3000)

        timeoutRefs.current.time2 = setTimeout(() => {
          showVerifiedBox(false)
        }, 5000)
        return
      }

      const token = await user.getIdToken()
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

      clearTimeout(timeoutRefs.current.time1)
      clearTimeout(timeoutRefs.current.time2)

      lottieRef.current?.stop()
      toggleStatus(false)
      showVerifiedBox(true)
      setVerified(true)
      timeoutRefs.current.time1 = setTimeout(() => {
        toggleStatus(true)
      }, 3000)

      timeoutRefs.current.time2 = setTimeout(() => {
        showVerifiedBox(false)
      }, 5000)
      setMessage('Added to Saved Trips')

      await fetch(`${API_URL}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tripLocation: item.location,
          tripDestination: item.destination,
          tripDeparture: item.departure,
          tripArrival: item.arrival,
          tripPeople: item.people,
          tripNote: item.note,
          tripCountry: filter
        })
      })
      navigate('/dashboard', { state: { message: 'saved' } })
    } catch (error) {
      clearTimeout(timeoutRefs.current.time1)
      clearTimeout(timeoutRefs.current.time2)

      lottieRef.current?.stop()
      toggleStatus(false)
      showVerifiedBox(true)

      timeoutRefs.current.time1 = setTimeout(() => {
        toggleStatus(true)
      }, 3000)

      timeoutRefs.current.time2 = setTimeout(() => {
        showVerifiedBox(false)
      }, 5000)
    }
  }

  useEffect(() => {
    searchFilter()
  }, [filter])

  return (
    <Suspense>
      <main className={styles.main}>
        {verifiedBox && (
          <section className={styles.error}>
            {status ? (
              <section>
                {verified ? (
                  <MdVerified
                    style={{
                      fontSize: '3em',
                      textAlign: 'center',
                      justifySelf: 'center',
                      alignSelf: 'center',
                      display: 'flex',
                      color: '#11ff2dff'
                    }}
                  />
                ) : (
                  <MdNewReleases
                    style={{
                      fontSize: '3em',
                      textAlign: 'center',
                      justifySelf: 'center',
                      alignSelf: 'center',
                      display: 'flex',
                      color: 'red'
                    }}
                  />
                )}

                <div className={styles.message}>{message}</div>
              </section>
            ) : (
              <section>
                <DotLottieReact
                  lottieRef={lottieRef}
                  className={styles.errorAnime}
                  src='https://lottie.host/708a68f1-142f-47d1-9e32-a778670dec35/SIUiB6OFCs.lottie'
                  loop
                  autoplay
                />
              </section>
            )}
          </section>
        )}

        <Header
          verified={verified}
          verifiedBox={verifiedBox}
          status={status}
          message={message}
          setMessage={setMessage}
          showVerifiedBox={showVerifiedBox}
          toggleStatus={toggleStatus}
          setVerified={setVerified}
          openLink={openLink}
          setOpenLink={setOpenLink}
          timeoutRefs={timeoutRefs}
          searchArray={searchArray}
          setSearched={setSearched}
          API_URL={API_URL}
        />

        <MainContent
          townNames={townNames}
          setFilter={setFilter}
          addToConditions={addToConditions}
          ClearAll={ClearAll}
          conditionalList={conditionalList}
          filterOnConditions={filterOnConditions}
          activeTabCountry={activeTabCountry}
          toggleCountry={toggleCountry}
          saveNewTrip={saveNewTrip}
          showOverlay={showOverlay}
          showAddTripUi={showAddTripUi}
          setDestination={setDestination}
          searched={searched}
          setSearched={setSearched}
          conditions={conditions}
          removeCondition={removeCondition}
          realConditions={realConditions}
          searchArray={searchArray}
          setSearchArray={setSearchArray}
          addToLiked={addToLiked}
          setLikedChange={setLikedChange}
          verified={verified}
          verifiedBox={verifiedBox}
          status={status}
          message={message}
          setMessage={setMessage}
          showVerifiedBox={showVerifiedBox}
          toggleStatus={toggleStatus}
          setVerified={setVerified}
          API_URL={API_URL}
        />

        <FooterUi />
        <AddNewTripScreen
          selectedArrivalDate={selectedArrivalDate}
          setSelectedArrivalDate={setSelectedArrivalDate}
          setSelectedDepartureDate={setSelectedDepartureDate}
          selectedDepartureDate={selectedDepartureDate}
          destination={destination}
          setDestination={setDestination}
          location={location}
          setLocation={setLocation}
          saveNewTrip={saveNewTrip}
          addTripUi={addTripUi}
          showAddTripUi={showAddTripUi}
          showOverlay={showOverlay}
          API_URL={API_URL}
        />
        {overlay && <div className={tripStyles.Overlay}></div>}
      </main>
    </Suspense>
  )
}
