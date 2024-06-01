import React, { useEffect, useState, useContext } from "react";
import PostForm from "../RecipePostPages/PostForm";
import PostingList from "../RecipePostPages/PostingList";
import "../../CSS Files/Jessica.css";
import { Link, useNavigate } from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import { TranslationContext } from "../../Translations/Translation";
import {FiList} from "react-icons/fi";

const MyCookbooks = () => {
  const userToken = sessionStorage.getItem("token");
  const userID = sessionStorage.getItem("user");
  const navigate = useNavigate();
  const [cookbooks, setCookbooks] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const translations = useContext(TranslationContext).translations.CookbookPages.UserCookbooksJourney;

  useEffect(() => {
    if (!userToken || !userID) {
      navigate("/");
    }
    loadPosts();
  }, [userToken, navigate, userID, sortBy]);

  const loadPosts = () => {
    if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
      const splits = window.location.href.split("/");
      const user_id = splits[splits.length - 1];

      let query = escape('{"path": "cb_authorID", "equals":"' + user_id + '"}');

      let url = process.env.REACT_APP_API_PATH + "/posts?attributes=" + query;

      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result) {
            let visiblePosts = result[0];

            if (sortBy === "popular") {
                visiblePosts.sort((a, b) => (b.attributes.savedBy?.length ?? 0) - (a.attributes.savedBy?.length ?? 0));
            }
            setCookbooks(result[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  function checkForImage(item) {
    if (item.attributes) {
      if (item.attributes.cbImageURL && item.attributes.cbImageURL !== "https://webdev.cse.buffalo.eduundefined") {
        return item.attributes.cbImageURL;
      } else {
        return transparent;
      }
    } else {
      return transparent;
    }
  }

  function checkForName(item) {
    if (item.attributes) {
      if (item.attributes.cbName) {
        return item.attributes.cbName;
      } else {
        return translations["default_name"];
      }
    } else {
      return translations["default_name"];
    }
  }

  function handleRedirect(item) {
    navigate("/post/cookbook/" + item.id);
  }

  function SortingControls({sortBy, setSortBy}) {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setShowDropdown(false);
    };

    return (
        <div className="sorting-controls-2" style={{position: 'relative'}}>
            <div className="dropdown-button" onClick={() => setShowDropdown(!showDropdown)}>
                <FiList/>
            </div>
            {showDropdown && (
                <div className="dropdown-menu">
                    <button className={sortBy === "popular" ? "active" : ""}
                            onClick={() => handleSortChange("popular")}>{translations["popular"]}
                    </button>
                    <button className={sortBy === "newest" ? "active" : ""}
                            onClick={() => handleSortChange("newest")}>{translations["newest"]}
                    </button>
                </div>
            )}
        </div>
    );
}

    function handleEnter (e, item) {
        if (e.keyCode === 13) {
            navigate("/post/cookbook/"+item.id);
        }
    }

  if (cookbooks.length === 0) {
    return (
      <div className="my-recipes">
        <div className="my_recipes_container my-recipes-container">
          <div className="noposts-text">{translations["no_cookbooks_yet"]}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="my-cookbooks">
        <SortingControls sortBy={sortBy} setSortBy={setSortBy} />
        <div className="cookbooks-list-container my-cookbooks-container">
          {cookbooks.map((item) => (
            <div
              className="single_recipe_container"
              key={item.id}
              onClick={() => handleRedirect(item)}
            >
              <div className="single_recipe" id={checkForName(item)} tabIndex={"0"} onClick={() => navigate('/post/' + item.id)} onKeyDown={e => handleEnter(e, item)}>
                <div className={"single_recipe_image_container"}>
                <img
                  className="single_recipe_image"
                  src={checkForImage(item)}
                  alt={checkForName(item)}
                  draggable="false"
                ></img>
                </div>
                <p className="single_recipe_undertext">{checkForName(item)}</p>
                <p className="single_recipe_undertext">
                  {item.attributes.savedBy.length > 1 || item.attributes.savedBy.length === 0 ? item.attributes.savedBy.length + translations["bookmarks"]: item.attributes.savedBy.length + translations["bookmark"]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default MyCookbooks;
