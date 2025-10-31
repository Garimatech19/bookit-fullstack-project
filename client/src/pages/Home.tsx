import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard';
import type { Experience } from '../types/types';
import { getExperiences } from '../services/api';

const Home = () => {
  // Get the search parameters from the URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search'); 

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);
        // Pass the search query to the API
        const response = await getExperiences(searchQuery);
        setExperiences(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch experiences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [searchQuery]);

  if (loading) {
    return <div className="text-center p-10 font-medium">Loading experiences...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      {experiences.length === 0 && searchQuery && (
        <div className="text-center p-10 text-medium font-medium">
          No experiences found for "{searchQuery}".
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
};

export default Home;