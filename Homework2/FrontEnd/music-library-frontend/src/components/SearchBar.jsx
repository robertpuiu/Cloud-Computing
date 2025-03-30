// components/SearchBar.jsx
import { useState } from 'react';

function SearchBar({ onSearch, onClear }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search songs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>
      {searchTerm && (
        <button type="button" onClick={handleClear} className="clear-btn">
          Clear
        </button>
      )}
    </form>
  );
}

export default SearchBar;
