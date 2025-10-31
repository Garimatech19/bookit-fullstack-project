import { Link } from 'react-router-dom';
import type { Experience } from '../types/types'; 

interface Props {
  experience: Experience;
}

const ExperienceCard = ({ experience }: Props) => {
  const { id, title, description, location, price, imageUrl } = experience;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/details/${id}`}>
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <span
            className="bg-gray-200 text-medium text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {location}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-dark mb-1">{title}</h3>
        <p className="text-sm text-medium mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-medium">From</span>
            <p className="text-lg font-bold text-dark">₹{price}</p>
          </div>
          <Link
            to={`/details/${id}`}
            className="bg-primary text-dark font-semibold px-5 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;