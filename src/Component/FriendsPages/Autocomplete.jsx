import React, { useState } from "react";
import PropTypes from "prop-types";

const Autocomplete = ({ suggestions, selectAutocomplete }) => {
  // the active selection's index
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  // the suggestions that match the user's input
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  // whether or not the suggestion list is shown
  const [showSuggestions, setShowSuggestions] = useState(false);
  // input from the user
  const [userInput, setUserInput] = useState("");

  // Event fired when the input value is changed
  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    let filteredSuggestions = suggestions;
    // Filter our suggestions that don't contain the user's input
    if (suggestions) {
      filteredSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.attributes.username
            .toLowerCase()
            .indexOf(userInput.toLowerCase()) > -1
      );
    }

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    setActiveSuggestion(0);
    setFilteredSuggestions(filteredSuggestions);
    setShowSuggestions(true);
    setUserInput(userInput);
  };

  // Event fired when the user clicks on a suggestion
  const onClick = (e) => {
    // Update the user input and reset the rest of the state
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);
    let selectedId = e.currentTarget.id;
    selectAutocomplete(selectedId);
    // console.log("Friend selected is " + selectedId);
  };

  // Event fired when the user presses a key down
  const onKeyDown = (e) => {
    // User pressed the enter key, update the input and close the suggestions
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion]);
    }
    // User pressed the arrow up key, so decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the arrow down key, so increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  let suggestionsListComponent = null;

  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <div className="autocomplete">
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className =
                index === activeSuggestion ? "suggestion-active" : "";
              return (
                <li
                  className={className}
                  key={suggestion.id}
                  id={suggestion.id}
                  onClick={onClick}
                >
                  {suggestion.attributes.username}
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      suggestionsListComponent = (
        <div className="autocomplete">
          <em>No suggestions, you're on your own!</em>
        </div>
      );
    }
  } else {
    suggestionsListComponent = <div className="autocomplete" />;
  }

  return (
    <>
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
      />
      <br />
      {suggestionsListComponent}
    </>
  );
};

export default Autocomplete;

// PropTypes is a mechanism in React for validating the properties (props) passed to a component.
// Here, Autocomplete component's PropTypes are defined to specify the expected data types for its props.
// 'suggestions' prop is expected to be an instance of an Array.
Autocomplete.propTypes = {
  suggestions: PropTypes.instanceOf(Array)
};

// defaultProps is used to specify default values for props in case they are not provided when using the component.
// If 'suggestions' prop is not provided, it defaults to an empty array.
Autocomplete.defaultProps = {
  suggestions: [],
};