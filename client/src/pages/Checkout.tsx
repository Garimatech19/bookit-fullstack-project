import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { validatePromo, createBooking } from '../services/api';
import axios from 'axios';

// Define the validation schema for the form
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  promoCode: z.string().optional(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data passed from Details page
  const { experience, slot, taxes } = location.state || {};
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [finalApiError, setFinalApiError] = useState('');

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { terms: false },
  });

  // If no state, redirect to home
  useEffect(() => {
    if (!experience || !slot) {
      navigate('/');
    }
  }, [experience, slot, navigate]);

  if (!experience || !slot) {
    return null; // Redirecting...
  }
  
  const subtotal = experience.price;
  const total = Math.max(0, subtotal + taxes - promoDiscount);

  // Handle promo code validation
  const handleApplyPromo = async () => {
    const code = getValues('promoCode');
    if (!code) {
      setPromoError('Please enter a code.');
      return;
    }

    setIsCheckingPromo(true);
    setPromoError('');
    setPromoDiscount(0);

    try {
      const response = await validatePromo(code);
      const promo = response.data;
      
      // Implement discount logic
      if (promo.isPercent) {
        setPromoDiscount(subtotal * promo.discount);
      } else {
        setPromoDiscount(promo.discount);
      }

    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setPromoError('Invalid or expired promo code');
      } else {
        setPromoError('Error validating code');
      }
    } finally {
      setIsCheckingPromo(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setFinalApiError('');

    const bookingData = {
      slotId: slot.id,
      customerName: data.fullName,
      customerEmail: data.email,
      promoCode: data.promoCode || undefined,
      finalPrice: total,
    };

    try {
      const response = await createBooking(bookingData);
      
      // On success, navigate to confirmation
      navigate('/confirmation', {
        state: {
          refId: response.data.booking.id, // Pass the real booking ID
        }
      });

    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setFinalApiError('This slot is no longer available. Please go back and select a different slot.');
      } else {
        setFinalApiError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <Link to={`/details/${experience.id}`} className="inline-flex items-center gap-2 text-medium font-medium mb-4 hover:text-dark">
        <ArrowLeft size={18} />
        Checkout
      </Link>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md h-fit">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-medium mb-1">
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                className="w-full px-3 py-2 bg-bg-light border border-border-light rounded-md text-dark placeholder-light focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full px-3 py-2 bg-bg-light border border-border-light rounded-md text-dark placeholder-light focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>
          
          {/* Promo Code */}
          <div className="mt-4">
             <label htmlFor="promoCode" className="block text-sm font-medium text-medium mb-1">
                Promo code
              </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="promoCode"
                {...register('promoCode')}
                className="w-full px-3 py-2 bg-bg-light border border-border-light rounded-md text-dark placeholder-light focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Promo code"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isCheckingPromo}
                className="bg-dark text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm w-28"
              >
                {isCheckingPromo ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Apply'}
              </button>
            </div>
            {promoError && <p className="text-red-500 text-sm mt-1">{promoError}</p>}
            {promoDiscount > 0 && <p className="text-success text-sm mt-1">Promo applied! You saved ₹{promoDiscount}.</p>}
          </div>

          {/* ... Terms and Conditions... */}
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('terms')}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-medium">I agree to the terms and safety policy.</span>
            </label>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h3 className="text-lg font-semibold mb-4 pb-4 border-b border-border-light">Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-medium">Experience</span>
                <span className="font-medium text-right">{experience.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Date</span>
                <span className="font-medium">{slot.displayDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Time</span>
                <span className="font-medium">{slot.displayTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Qty</span>
                <span className="font-medium">1</span>
              </div>
            </div>

            <div className="space-y-2 text-sm mt-4 pt-4 border-t border-border-light">
              <div className="flex justify-between">
                <span className="text-medium">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Taxes</span>
                <span className="font-medium">₹{taxes}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Promo Discount</span>
                  <span className="font-medium">- ₹{promoDiscount}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-border-light">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">₹{total}</span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-dark font-semibold p-3 rounded-md mt-6
                         hover:bg-primary-dark transition-colors
                         disabled:bg-light disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Pay and Confirm'}
            </button>
            {finalApiError && <p className="text-red-500 text-sm mt-2 text-center">{finalApiError}</p>}
          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;