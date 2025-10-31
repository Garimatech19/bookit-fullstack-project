import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // If the input is empty, navigate to home (clears search)
    // Otherwise, navigate to home with the search query
    if (inputValue.trim()) {
      navigate(`/?search=${inputValue.trim()}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow pressing Enter to search
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-white border-b border-border-light sticky top-0 z-10">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={() => setInputValue('')}>
          <img 
            src="/img/attachment.png"
            alt="Highway Delite" 
            className="h-10" 
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search experiences"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 bg-bg-light border border-border-light rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="bg-primary text-dark font-semibold px-6 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm"
        >
          Search
        </button>
      </div>
    </header>
  );
};

export default Header;