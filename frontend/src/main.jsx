import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51R1WauJJDzb104DjzCvgefM7p6JzskU5xUCsfPqdLF8TyOAsbXX3iEdTP8XCDyIZg6N2tGNw0UEe4joEWa1Cii0e00WBed4puM");


createRoot(document.getElementById('root')).render(
 


  
  
  <Elements  stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
          </Elements>
   
  
)
