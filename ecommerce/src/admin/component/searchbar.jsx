import React, { useState } from "react";
import { Search, X } from "lucide-react";

const Searchbar = ({
  statesearchpro,
  placeholder = "Search...",
  value,
}) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleChange = (e) => {
    const newValue = e.target.value;

    setSearchValue(newValue);

    if (statesearchpro) {
      statesearchpro(newValue);
    }
  };

  const clearSearch = () => {
    setSearchValue("");

    if (statesearchpro) {
      statesearchpro("");
    }
  };

  return (
    <div className="admin-search-wrapper">
      <div className="admin-search">
        <Search
          className="admin-search-icon"
          size={19}
          strokeWidth={2}
        />

        <input
          type="text"
          value={searchValue}
          placeholder={placeholder}
          onChange={handleChange}
          aria-label={placeholder}
        />

        {searchValue && (
          <button
            type="button"
            className="admin-search-clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Searchbar;

