import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

const Buy = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');


  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("")



// stripe payment gateway code
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  useEffect(() => {
    const fetchBuyCourseData = async() => {
      if (!token) {
        setError("Please login to Purchase!");
        return;
      }

      try {
        
        const response = await axios.post(`http://localhost:8000/api/v1/course/buy/${courseId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });

        // toast.success(response.data.message || "Course Purchased Successfully!");
        setLoading(false);
        // navigate('/purchased');
        setCourse(response.data.courseData);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 400) {
          setError("You have already purchased the course");
        } else {
          setError(error?.response?.data?.error || "An error occurred");
        }
      }
    }

    fetchBuyCourseData();
  }, [courseId])

  const handlePurchase = async (event) => {
    
    event.preventDefault();

    if (!stripe || !elements) {

      console.log("stripe or element not found")
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.

    setLoading(false);

    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("CardElement not found")
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe payment method error ', error);
      setLoading(false);
      setCardError(error.message)
    } else {
      console.log('[PaymentMethod created]', paymentMethod);
    }

    if (!clientSecret) {
      console.log("No Client Secret found")
      setLoading(false)
      return
    }



    const { paymentIntent, error:confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      },
    );

    if (confirmError) {
      setCardError(confirmError.message)
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment Succeeded : ", paymentIntent)
      setCardError("your payment id: ", paymentIntent.id)
      const paymentInfo = {
        email:user?.user?.email,
        user_id: user.user._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      }

      console.log("Payment Info: ", paymentInfo)
    }
  

  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <button
        className='bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-700 duration-300'
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "Processing" : "Buy Now"}
      </button>
    </div>
  );
};

export default Buy;
