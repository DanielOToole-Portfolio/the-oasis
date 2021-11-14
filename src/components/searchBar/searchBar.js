import React from "react";
import { Link } from "react-router-dom";
import algoliasearch from "algoliasearch/lite";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
import {
  InstantSearch,
  SearchBox,
  Hits,
  connectHighlight,
} from "react-instantsearch-dom";

const searchClient = algoliasearch(
  "9HB2T2G9O7",
  "96c81f07cd5b9c42dac7807736279f8a"
);

const SearchBar = () => {
  const search = document.getElementById("search");
  const hits = document.querySelector(".ais-Hits");
  const searchInput = document.querySelector(".ais-SearchBox-input");

  const openMenu = () => {
    search.classList.add("active");
    document.body.classList.add("bodyNoScroll");

    if (document.querySelector(".ais-Hits-item").clicked == true) {
      alert("button was clicked");
    }
  };
  const closeMenu = () => {
    search.classList.remove("active");
    document.body.classList.remove("bodyNoScroll");
  };

  const handleChange = () => {
    if (searchInput === document.activeElement) {
      hits.style.opacity = "1";
    }
  };

  return (
    <div>
      <div className="icon s">
        <SearchIcon onClick={openMenu} />
      </div>
      <div className="search" id="search">
        <div className="icon x">
          <XIcon onClick={closeMenu} />
        </div>
        <div className="form">
          <InstantSearch
            searchClient={searchClient}
            indexName="The-Oasis-Users"
          >
            <SearchBox
              className="bar"
              translations={{
                placeholder: "Search users...",
              }}
              onChange={handleChange}
            />
            <Hits hitComponent={Hit} />
          </InstantSearch>
        </div>
      </div>
    </div>
  );
};

const CustomHighlight = connectHighlight(
  ({ highlight, attribute, userId, hit }) => {
    const parsedHit = highlight({
      highlightProperty: "_highlightResult",
      attribute,
      userId,
      hit,
    });
    const handleClick = () => {
      search.classList.remove("active");
      document.body.classList.remove("bodyNoScroll");
    };

    return (
      <div>
        {parsedHit.map((part) =>
          part.isHighlighted ? (
            <Link
              onClick={handleClick}
              key={part.value}
              to={`/p/${part.value}`}
            >
              <mark>{part.value}</mark>
            </Link>
          ) : (
            <Link
              onClick={handleClick}
              key={part.value}
              to={`/p/${part.value}`}
            >
              {part.value}
            </Link>
          )
        )}
      </div>
    );
  }
);

const Hit = ({ hit }) => (
  <>
    <CustomHighlight attribute="username" userId="userId" hit={hit} />
  </>
);

export default SearchBar;
