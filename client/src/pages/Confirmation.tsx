import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const { refId } = location.state || { refId: 'ABC123XYZ' }; 

  return (
    <div className="container mx-auto">
      <div className="bg-white max-w-lg mx-auto p-10 mt-10 rounded-lg shadow-md text-center">
        
        <CheckCircle className="text-success mx-auto mb-4" size={64} />
        
        <h1 className="text-3xl font-bold text-dark mb-2">
          Booking Confirmed
        </h1>
        
        <p className="text-base text-medium mb-8">
          Ref ID: <span className="font-medium text-dark">{refId}</span>
        </p>

        <Link
          to="/"
          className="bg-bg-light text-dark font-semibold px-6 py-3 rounded-md 
                     hover:bg-border-light transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;