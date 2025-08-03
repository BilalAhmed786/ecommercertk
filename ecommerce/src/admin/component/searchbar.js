import React from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const searchbar = ({statesearchpro}) => {
  return (
    <div> <div className='search-bar'>
              <input
                type="text"
                placeholder='Search users...'
                onChange={(e) => statesearchpro(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} className='search-icon' />
            </div></div>
  )
}

export default searchbar