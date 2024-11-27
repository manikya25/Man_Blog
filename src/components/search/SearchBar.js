import React, { useState } from 'react';
import "./SearchBar.scss";
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {

  const [results, setResults] = useState([]);
  return (
    <div className='bar'>
        <div className='search-bar-container'>
        <SearchInput  setResults={setResults}/>
        <SearchResults results={results}/>
        </div>

    </div>
    
  )
}
export default SearchBar;