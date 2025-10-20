import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import footerStyles from "./assets/styles/footer.module.css";
import { useState, useRef ,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default function FooterUi() {
  return (
    <section className={footerStyles.footer}>
      <section className={footerStyles.head}>
        <section className={footerStyles.first}>
          <div className={footerStyles.logo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="#292727ff"
            >
              <path d="M639-120H180q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v459L639-120Zm-30-60v-83q0-35 26.5-61.5T697-351h83v-429H180v600h429ZM450-321h60v-258h129v-60H321v60h129v258Zm159 141Zm-429 0v-600 600Z" />
            </svg>
            Tripify
          </div>
          <div>
            Experince unforgetabble travelling and touring with Tripify. Your
            perfect Travel companion for every adventure.
          </div>
        </section>
        <section className={footerStyles.second}>
          <div className={footerStyles.eachHead}>Resources</div>
          <ul>
            <li>Download</li>
            <li>Help Center</li>
            <li>Gide Book</li>
          </ul>
        </section>

        <section className={footerStyles.third}>
          <div className={footerStyles.eachHead}>Travellers</div>
          <ul>
            <li>Enterprise</li>
            <li>Customer</li>
            <li>Why Travel</li>
          </ul>
        </section>
        <section className={footerStyles.fourth}>
          <div className={footerStyles.eachHead}>Company</div>
          <ul>
            <li>Travelling</li>
            <li>Success</li>
            <li>About</li>
          </ul>
        </section>
        <section className={footerStyles.fifth}>
          <div className={footerStyles.eachHead}>Get App</div>
          <ul>
            <li>App Store</li>
            <li>Google Play Store</li>
            <li>Terms & Conditions</li>
          </ul>
        </section>
      </section>

      <section className={footerStyles.bottom}>
        <div>
          <FontAwesomeIcon icon={faTwitter} />
        </div>
        <div>
          <FontAwesomeIcon icon={faFacebook} />
        </div>
        <div>
          <FontAwesomeIcon icon={faLinkedin} />
        </div>
        <div>
          <FontAwesomeIcon icon={faInstagram} />
        </div>
      </section>
    </section>
  );
}