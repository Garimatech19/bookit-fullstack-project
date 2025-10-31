import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getExperienceById } from '../services/api';
import type { ExperienceWithSlots } from '../types/types';

// Cache for Intl formatters for performance
const dateFormatters: Record<string, Intl.DateTimeFormat> = {};
const timeFormatters: Record<string, Intl.DateTimeFormat> = {};

const formatDateLabel = (isoDate: string) => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  const key = 'en-US' + options.timeZone;
  if (!dateFormatters[key]) {
    dateFormatters[key] = new Intl.DateTimeFormat('en-US', options);
  }
  return dateFormatters[key].format(new Date(isoDate));
};

const formatTimeLabel = (isoDate: string) => {
  const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
  const key = 'en-US' + options.timeZone;
  if (!timeFormatters[key]) {
    timeFormatters[key] = new Intl.DateTimeFormat('en-US', options);
  }
  return timeFormatters[key].format(new Date(isoDate)).toLowerCase();
};

const getDatePart = (isoDate: string) => {
  return isoDate.split('T')[0];
};

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [experience, setExperience] = useState<ExperienceWithSlots | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const taxes = 59; 

  // Fetch data on component mount
  useEffect(() => {
    if (!id) {
      setError('No experience ID provided.');
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getExperienceById(id);
        setExperience(response.data);
        
        // Auto-select the first available date
        if (response.data.slots.length > 0) {
          setSelectedDate(getDatePart(response.data.slots[0].startTime));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load experience details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Get unique available dates 
  const availableDates = experience
    ? [...new Set(experience.slots.map(s => getDatePart(s.startTime)))]
    : [];

  // Get time slots for the currently selected date
  const timesForSelectedDate = experience
    ? experience.slots.filter(slot => getDatePart(slot.startTime) === selectedDate)
    : [];
  
  const selectedSlot = experience
    ? experience.slots.find(s => s.id === selectedTimeSlotId)
    : null;

  const handleConfirm = () => {
    if (!selectedSlot || !experience) return;
    
    // Pass the selected data to the checkout page
    navigate('/checkout', {
      state: {
        experience,
        slot: {
          ...selectedSlot,
          // Send formatted date/time for easy display on checkout
          displayDate: formatDateLabel(selectedSlot.startTime),
          displayTime: formatTimeLabel(selectedSlot.startTime),
        },
        taxes,
        quantity,
      }
    });
  };

  if (loading) {
    return <div className="text-center p-10 font-medium">Loading details...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 font-medium">{error}</div>;
  }

  if (!experience) {
    return <div className="text-center p-10 font-medium">Experience not found.</div>;
  }

  // Calculate totals
  const subtotal = experience.price * quantity;
  const total = subtotal + taxes;

  return (
    <div className="container mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-medium font-medium mb-4 hover:text-dark">
        <ArrowLeft size={18} />
        Back to Home
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <img src={experience.imageUrl} alt={experience.title} className="w-full h-80 object-cover rounded-lg mb-6" />
          
          <h1 className="text-3xl font-bold mb-3">{experience.title}</h1>
          <p className="text-base text-medium mb-6">{experience.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Choose date</h3>
            <div className="flex flex-wrap gap-3">
              {availableDates.map(date => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTimeSlotId(null); 
                  }}
                  className={`px-4 py-2 rounded-md border text-sm font-medium
                    ${selectedDate === date 
                      ? 'bg-primary border-primary text-dark' 
                      : 'bg-white border-border-light text-dark hover:bg-gray-50'}`
                  }
                >
                  {formatDateLabel(date)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Choose time</h3>
            <p className="text-xs text-medium mb-3">All times are in IST (GMT +5:30)</p>
            <div className="flex flex-wrap gap-3">
              {timesForSelectedDate.map(slot => {
                const isSoldOut = !slot.isAvailable;
                const isSelected = selectedTimeSlotId === slot.id;
                
                return (
                  <button
                    key={slot.id}
                    disabled={isSoldOut}
                    onClick={() => setSelectedTimeSlotId(slot.id)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium
                      ${isSelected 
                        ? 'bg-primary border-primary text-dark' 
                        : 'bg-white border-border-light text-dark'}
                      
                      ${isSoldOut 
                        ? 'bg-gray-100 text-light border-gray-200 cursor-not-allowed'
                        : 'hover:bg-gray-50'}
                    `}
                  >
                    {formatTimeLabel(slot.startTime)}
                    {isSoldOut && <span className="text-xs text-light ml-2">(Sold out)</span>}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <div className="bg-bg-light p-4 rounded-md">
              <p className="text-sm text-medium">Scenic routes, trained guides, and safety briefing. Minimum age 10.</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border-light">
              <span className="text-medium">Starts at</span>
              <span className="text-lg font-bold">₹{experience.price}</span>
            </div>
           
            <div className="flex justify-between items-center mb-4">
              <span className="text-medium">Quantity</span>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 border rounded-l hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-t border-b">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 border rounded-r hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-medium">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-medium">Taxes</span>
              <span className="font-medium">₹{taxes}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border-light">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">₹{total}</span>
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className="w-full bg-primary text-dark font-semibold p-3 rounded-md mt-6
                         hover:bg-primary-dark transition-colors
                         disabled:bg-light disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;