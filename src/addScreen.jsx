import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'

import tripStyles from './assets/styles/tripUi.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { LuArrowLeftRight } from 'react-icons/lu'
import DatePicker from 'react-datepicker'

export default function AddNewTripScreen ({
  selectedArrivalDate,
  setSelectedArrivalDate,
  selectedDepartureDate,
  setSelectedDepartureDate,
  location,
  destination,
  setDestination,
  setLocation,
  saveNewTrip,
  addTripUi,
  showAddTripUi,
  showOverlay
}) {
  const [num, setNum] = useState(1)
  const [note, setNote] = useState('')
  const navigate = useNavigate()
  function createData () {
    const data = {
      location: location,
      destination: destination,
      departure: selectedDepartureDate
        ? selectedDepartureDate.toDateString()
        : 'unspecified',
      arrival: selectedArrivalDate
        ? selectedArrivalDate.toDateString()
        : 'unspecified',
      people: num,
      note: note ? note : 'no note added'
    }

    saveNewTrip(data)

  }
  return (
    <>
      {addTripUi && (
        <section className={tripStyles.box}>
          <button
            onClick={() => {
              showAddTripUi(false),
                showOverlay(false),
                setDestination(''),
                setLocation(''),
                setSelectedArrivalDate(''),
                setSelectedDepartureDate(''),
                setNum(1)
            }}
          >
            <FontAwesomeIcon className={tripStyles.close}
            
              icon={faClose}
            />
          </button>
          <div className={tripStyles.header}>Save your trip details</div>
          <section className={tripStyles.eachRow}>
            <section
              style={{ paddingRight: '5%' }}
              className={tripStyles.eachField}
            >
              <div className={tripStyles.eachFieldHead}>From</div>
              <input
                value={location}
                onChange={e => {
                  setLocation(e.target.value)
                }}
                type='text'
                placeholder=''
              />
              <div className={tripStyles.exchange}>
                <LuArrowLeftRight />
              </div>
            </section>
            <section
              style={{ paddingLeft: '5%' }}
              className={tripStyles.eachField}
            >
              <div className={tripStyles.eachFieldHead}>To</div>

              <input
                onChange={e => {
                  setDestination(e.target.value)
                }}
                value={destination}
                type='text'
              />
            </section>
          </section>
          <section className={tripStyles.eachRow}>
            <section className={tripStyles.DateField}>
              <div className={tripStyles.eachFieldHead}>Departure</div>
              <DatePicker
                selected={selectedDepartureDate}
                onChange={date => setSelectedDepartureDate(date)}
                dateFormat='dd/MM/yyyy'
                placeholderText='Pick a date'
                className={tripStyles.Date}
                showIcon={true}
                popperPlacement='auto'
                popperModifiers={[
                  {
                    name: 'preventOverflow',
                    options: {
                      rootBoundary: 'viewport',
                      tether: false,
                      altAxis: true
                    }
                  }
                ]}
              />
            </section>
            <section className={tripStyles.DateField}>
              <div className={tripStyles.eachFieldHead}>Arrival</div>

              <DatePicker
                selected={selectedArrivalDate}
                onChange={date => setSelectedArrivalDate(date)}
                dateFormat='dd/MM/yyyy'
                placeholderText='Pick a date'
                className={tripStyles.Date}
                showIcon={true}
                popperPlacement='auto'
                popperModifiers={[
                  {
                    name: 'preventOverflow',
                    options: {
                      rootBoundary: 'viewport',
                      tether: false,
                      altAxis: true
                    }
                  }
                ]}
              />
            </section>
          </section>

          <section className={tripStyles.eachRow}>
            <section className={tripStyles.numberField}>
              <div style={{ padding: 0 }} className={tripStyles.eachFieldHead}>
                Number of People
              </div>
              <section className={tripStyles.guests}>
                <button
                  onClick={() => {
                    setNum(e => (e > 0 ? e - 1 : 0))
                  }}
                >
                  -
                </button>

                <div>{num}</div>

                <button
                  onClick={() => {
                    setNum(e => e + 1)
                  }}
                >
                  +
                </button>
              </section>
            </section>
          </section>

          <section className={tripStyles.sideNote}>
            <div>Add a side note</div>
            <input
              value={note}
              onChange={e => {
                setNote(e.target.value)
              }}
              type='text'
            />
          </section>
          <div
            onClick={() => {
              createData()
              showAddTripUi(false)
              showOverlay(false)
            }}
            className={tripStyles.save}
          >
            Save Trip
          </div>
        </section>
      )}
    </>
  )
}
