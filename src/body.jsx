import mainStyles from './assets/styles/mainCont.module.css'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaCircle, FaPlus, FaWpforms } from 'react-icons/fa'

import { FaPlaneDeparture } from 'react-icons/fa'
import {
  FaArrowDown,
  FaArrowDown91,
  FaArrowDownShortWide,
  FaArrowTurnDown,
  FaRegCalendarCheck,
  FaXmark
} from 'react-icons/fa6'
import { FaMapLocationDot } from 'react-icons/fa6'
import { faLocationDot, faSearch } from '@fortawesome/free-solid-svg-icons'

import paris from './assets/img/places/france/paris.jpg'
import lyon from './assets/img/places/france/lyon.jpg'
import bordeaux from './assets/img/places/france/bordeaux.jpg'
import toulouse from './assets/img/places/france/toulouse.jpg'
import cannes from './assets/img/places/france/cannes.jpg'
import strasbourg from './assets/img/places/france/strasbourg.jpg'
import montpellier from './assets/img/places/france/montpellier.jpg'
import avignon from './assets/img/places/france/avignon.jpg'
import { CiHeart } from 'react-icons/ci'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

export default function MainContent ({
  townNames,
  setFilter,
  addToConditions,
  ClearAll,
  conditionalList,
  filterOnConditions,
  activeTabCountry,
  toggleCountry,
  saveNewTrip,
  destination,
  setDestination,
  showOverlay,
  showAddTripUi,
  searched,
  setSearched,
  conditions,
  removeCondition,
  realConditions,
  searchArray,
  setSearchArray,
  addToLiked,
  setLikedChange
}) {
  const [countryBox, showCountryBox] = useState(false)
  const [conditionBox, showConditionBox] = useState(false)
  const searchRef = useRef(null)
  const [currentCountry, setCurrentCountry] = useState('All Countries')

  function moveTrigger () {
    gsap.to(window, {
      duration: 0.5,
      scrollTo: {
        y: 1200,
        offsetY: 50
      },
      ease: 'power1.inOut'
    })
  }

  return (
    <section
      onClick={() => {
        countryBox ? showCountryBox(false) : null
      }}
      className={mainStyles.mainContent}
    >
      <section className={mainStyles.head}>
        <div>Best Vacation trips</div>

        <section className={mainStyles.search}>
          {searchArray.length > 0 && (
            <section className={mainStyles.hiddenSearch}>
              {searchArray.map(item => (
                <div
                  ref={searchRef}
                  onClick={moveTrigger}
                  key={`${item}-${Math.random()}`}
                >
                  {item}
                </div>
              ))}
            </section>
          )}
          <section
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: 10
            }}
          >
            <FontAwesomeIcon icon={faSearch} />

            <input
              value={searched}
              onChange={e => {
                setSearched(e.target.value)
                setCurrentCountry('All Countries')
              }}
              type='text'
              placeholder='search for your next trip ...'
            />
          </section>
          <button
            onClick={() => {
              setSearchArray([]), setSearched('')
            }}
          >
            {searched ? 'Clear' : 'Search'}
          </button>
        </section>
      </section>

      <section className={mainStyles.filterUi}>
        <section className={mainStyles.filterBox}>
          <div
            onClick={() => {
              showCountryBox(!countryBox)
            }}
            className={mainStyles.filterHead}
          >
            <div style={{ marginBottom: 10 }}>{currentCountry}</div>
            <span>{countryBox ? <FaXmark /> : <FaArrowDownShortWide />}</span>
          </div>

          <ul>
            {countryBox &&
              activeTabCountry.map(item => (
                <li
                  onClick={() => {
                    filterOnConditions()
                    setFilter(item.country)
                    toggleCountry(item.country)
                    setCurrentCountry(item.country)
                  }}
                  key={item.country}
                >
                  <span>
                    <FaCircle
                      style={
                        item.active
                          ? { color: 'rgb(84, 126, 252)' }
                          : { color: 'transparent' }
                      }
                    />
                  </span>
                  {item.country}
                </li>
              ))}
          </ul>
        </section>
      </section>

      <section className={mainStyles.conditionUi}>
        <ul>
          {realConditions.map(item => (
            <li key={item}>
              {item}
              <div>
                <FaXmark
                  onClick={() => {
                    removeCondition(item)
                  }}
                />
              </div>
            </li>
          ))}
          <li className={mainStyles.add}>
            {conditionBox && (
              <section className={mainStyles.box}>
                <div
                  style={{
                    textAlign: 'right',
                    paddingRight: '9%',
                    paddingTop: '7%',
                    fontSize: 20
                  }}
                >
                  <FaXmark
                    onClick={() => {
                      showConditionBox(false)
                    }}
                  />

                  <ul style={{ display: 'flex', flexDirection: 'column' }}>
                    {conditionalList.map(item => (
                      <section
                        onClick={() => {
                          addToConditions(item.value), filterOnConditions()
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-around'
                        }}
                        key={item.instance}
                      >
                        <span>
                          <FaCircle
                            style={
                              item.active
                                ? { color: 'rgb(84, 126, 252)' }
                                : { color: 'white' }
                            }
                          />
                        </span>
                        <li className={mainStyles.instance}>{item.instance}</li>
                      </section>
                    ))}

                    <section className={mainStyles.conditionUiBottom}>
                      <div
                        onClick={() => {
                          ClearAll()
                        }}
                      >
                        Clear
                      </div>
                      <div
                        onClick={() => {
                          showConditionBox(false)
                        }}
                      >
                        Apply
                      </div>
                    </section>
                  </ul>
                </div>
              </section>
            )}
            <div
              onClick={() => {
                showConditionBox(true)
              }}
            >
              Add to filters
            </div>
            <span
              onClick={() => {
                showConditionBox(true)
              }}
            >
              <FaPlus />
            </span>
          </li>
        </ul>
      </section>

      <section>
        <GridComp
          setDestination={setDestination}
          showAddTripUi={showAddTripUi}
          showOverlay={showOverlay}
          saveNewTrip={saveNewTrip}
          townNames={townNames}
          addToLiked={addToLiked}
          setLikedChange={setLikedChange}
        />
      </section>

      <section
        style={{
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
          marginBottom: '4em'
        }}
      >
        <div className={mainStyles.showMore} style={{}}>
          Show More
        </div>
      </section>

      <section className={mainStyles.steps}>
        <StepsUi />
      </section>

      <section className={mainStyles.popular}>
        <Popular />
      </section>
    </section>
  )
}

function GridComp ({
  townNames,
  saveNewTrip,
  showOverlay,
  showAddTripUi,
  setDestination,
  addToLiked,
  setLikedChange
}) {
  return (
    <section className={mainStyles.gridStyle}>
      {townNames.map(item => (
        <div key={`item.places-${Math.random()}`} className={mainStyles.card}>
          <div className={mainStyles.cardImage}>
            <img loading={'lazy'} src={item.image} alt='place' />

            <div
              onClick={() => {
                addToLiked(item.name)
                setLikedChange(true)
              }}
              className={
                item.liked === true ? mainStyles.liked : mainStyles.like
              }
            >
              <CiHeart size={28} />
            </div>
          </div>

          <section style={{ paddingInline: '10%' }}>
            <section
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 30,
                fontSize: 20
              }}
            >
              <div>{item.name}</div>
              <div>
                <FontAwesomeIcon color={'#4a4747d3'} icon={faLocationDot} />
              </div>
            </section>
            <div className={mainStyles.cardText}>{item.description}</div>
            <section
              style={{
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                marginTop: 20
              }}
            >
              <button
                onClick={() => {
                  showOverlay(true)
                  showAddTripUi(true)
                  setDestination(item.name)
                  console.log('working')
                }}
              >
                Add to Trip
              </button>
            </section>
          </section>
        </div>
      ))}
    </section>
  )
}

function StepsUi () {
  return (
    <>
      <div className={mainStyles.stepsText}>Plan your Trip with ease</div>

      <section style={{ display: 'flex', gap: 20, width: '100%' }}>
        <section className={mainStyles.each}>
          <div className={mainStyles.eachIcon}>
            <FaMapLocationDot />
          </div>

          <div className={mainStyles.eachHead}>Search Destination</div>
          <div className={mainStyles.eachText}>
            Use the provided search bars to find the next destination to your
            trip or you could describe a place you want to visit but dont know
            to our Ai
          </div>
        </section>

        <section className={mainStyles.each}>
          <div className={mainStyles.eachIcon}>
            <FaWpforms />
          </div>
          <div className={mainStyles.eachHead}>Complete Form</div>
          <div className={mainStyles.eachText}>
            Fill in the trip details from your current location to your trip
            destination,the date and time of departure and arrival,the number of
            travellers
          </div>
        </section>
        <section className={mainStyles.each}>
          <div className={mainStyles.eachIcon}>
            <FaPlaneDeparture />
          </div>
          <div className={mainStyles.eachHead}>Saving Trip</div>
          <div className={mainStyles.eachText}>
            On completion of the form , save it and it gets stored in your
            database exclusive and private to only you
          </div>
        </section>
        <section className={mainStyles.each}>
          <div className={mainStyles.eachIcon}>
            <FaRegCalendarCheck />
          </div>
          <div className={mainStyles.eachHead}>Checking Trips</div>
          <div className={mainStyles.eachText}>
            When you have some saved trips,you could just go your save history
            and visit your saved trips as well as customize and edit some
            details
          </div>
        </section>
      </section>
    </>
  )
}

function Popular () {
  return (
    <section className={mainStyles.popularHead}>
      <div className={mainStyles.text1}>Top Rated Cities</div>
      <div className={mainStyles.text2}>
        Explore trending and popular cities photos below before planning
      </div>
      <section style={{ height: 60 }} className={mainStyles.search}>
        <section
          style={{
            alignItems: 'center',

            display: 'flex',
            gap: 10
          }}
        >
          <FontAwesomeIcon icon={faSearch} />

          <input type='text' placeholder='search for your next trip ...' />
        </section>
        <button>Search</button>
      </section>

      <section className={mainStyles.photos}>
        <section className={mainStyles.left}>
          <div
            style={{
              height: '70%',
              width: '100%',
              backgroundColor: '#fff'
            }}
          >
            <img loading={'lazy'} src={lyon} alt='img' />
          </div>
          <div
            style={{
              height: '30%',
              width: '100%',
              backgroundColor: '#fff'
            }}
          >
            <img loading={'lazy'} src={paris} alt='' />
          </div>
        </section>

        <section className={mainStyles.middle}>
          <section
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 18,
              height: '30%'
            }}
          >
            <div style={{ width: '100%', backgroundColor: '#fff' }}>
              <img loading={'lazy'} src={strasbourg} alt='' />
            </div>
            <div style={{ width: '100%', backgroundColor: '#fff' }}>
              <img loading={'lazy'} src={bordeaux} alt='' />
            </div>
          </section>
          <div
            style={{ height: '70%', width: '100%', backgroundColor: '#fff' }}
          >
            <img loading={'lazy'} src={cannes} alt='' />
          </div>
        </section>
        <section className={mainStyles.right}>
          <div
            style={{
              height: '70%',
              width: '100%',
              backgroundColor: '#fff'
            }}
          >
            <img loading={'lazy'} src={montpellier} alt='img' />
          </div>
          <section
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 18,
              height: '30%'
            }}
          >
            <div style={{ width: '100%', backgroundColor: '#fff' }}>
              <img src={avignon} alt='img' />
            </div>
            <div style={{ width: '100%', backgroundColor: '#fff' }}>
              <img loading={'lazy'} src={toulouse} alt='' />
            </div>
          </section>
        </section>
      </section>
    </section>
  )
}
