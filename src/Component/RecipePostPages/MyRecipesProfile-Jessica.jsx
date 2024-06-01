import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Journey.css";
import { Link, useNavigate } from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import {FiList} from "react-icons/fi";
import { TranslationContext } from "../../Translations/Translation";

const MyRecipes = (appRefresh) => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const userID = sessionStorage.getItem("user");
  const userToken = sessionStorage.getItem("token");
  const [sortBy, setSortBy] = useState("newest");
  const translations = useContext(TranslationContext).translations.RecipePages;
  const [buttonText, setButtonText] = useState(translations["delete_recipes"]);

  useEffect(() => {
    if (!userToken || !userID) {
      navigate("/");
    }
    loadPosts();
  }, [userToken, navigate, userID, sortBy]);

  const loadPosts = () => {
    // if the user is not logged in, we don't want to try loading posts, because it will just error out.
    if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
      const query = escape(
        '{"path": "recipe_authorID", "equals":"' + userID + '"}'
      );

      let url = process.env.REACT_APP_API_PATH + "/posts?attributes=" + query;

      // console.log(query)


      // make an api request to fetch all the posts which are original posts (not comments/don't have a parentId)
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result)
          if (result) {
            let visiblePosts = result[0];
            // Sort based on the sorting selection
            if (sortBy === "popular") {
                visiblePosts.sort((a, b) => (b.reactions?.length ?? 0) - (a.reactions?.length ?? 0));
            }
            setRecipes(visiblePosts);
          }
        })
        .catch((err) => {
          console.log("ERROR loading posts", err);
        });
    }
  };

  const deletePost = (input) => {
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + input, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((result) => {
        loadPosts();
      })
      .catch((error) => {
        console.log("error!" + error);
      });
  };

  const DeleteButton = (text) => {
    return (
      <img
        src={helpIcon}
        className="delete_recipe_icon"
        alt={translations["delete_post"]}
        onClick={() => deletePost(text)}
        draggable="false"
      />
    );
  };

  const handleShowDelete = () => {
      let del = document.getElementById("delete-button");
        setShowDeleteButton(!showDeleteButton);
        if (showDeleteButton === false) {
            del.innerText = (translations["finish"]);
        } else {
            del.innerText = (translations["delete_recipes"]);
        }
    }

  function handleRedirect(item) {
    if (!showDeleteButton) {
      navigate("/post/" + item.id);
    }
  }

  function checkForImage(item) {
    if (item.attributes) {
      if (item.attributes.pictureURL && item.attributes.pictureURL !== "https://webdev.cse.buffalo.eduundefined") {
        return item.attributes.pictureURL;
      } else {
        return transparent;
      }
    } else {
      return transparent;
    }
  }

  function checkForName(item) {
    if (item.attributes) {
      if (item.attributes.recipeName) {
        return item.attributes.recipeName;
      } else {
        return translations["default_name"];
      }
    } else {
      return translations["default_name"];
    }
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
                                onClick={() => handleSortChange("popular")}>{translations["Popular"]}
                        </button>
                        <button className={sortBy === "newest" ? "active" : ""}
                                onClick={() => handleSortChange("newest")}>{translations["Newest"]}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    function handleEnter (e, item) {
        if (e.keyCode === 13) {
            navigate("/post/"+item.id);
        }
    }

    function handleKeyDelete (e, text) {
        if (e.keyCode === 13) {
            deletePost(text);
        }
    }

  if (recipes.length === 0){
    return (
      <div className="my-recipes">
        <div className="buttons-container">
        <div className="post-button-wrapper">
          <Link to={"/post-recipe"}>
            <button className="create-recipe-button">{translations["Post a Recipe"]}</button>
          </Link>
        </div>
      </div>
        <div className="my_recipes_container my-recipes-container">
          <div className="noposts-text">{translations["no_recipes_yet"]}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-recipes">
      <div className="buttons-container">
        <div className="delete-button-wrapper">
          <button
            id="delete-button"
            className="delete-recipe-button"
            onClick={handleShowDelete}
          >
            {translations["delete_recipes"]}
          </button>
        </div>
        <div className="post-button-wrapper">
          <Link to={"/post-recipe"}>
            <button className="create-recipe-button">{translations["Post a Recipe"]}</button>
          </Link>
        </div>
      </div>
        <SortingControls sortBy={sortBy} setSortBy={setSortBy}/>
      <div className="my_recipes_container my-recipes-container">
        {recipes.map((item) => (
          <div
            className="single_recipe_container"
            key={item.id}
            onClick={() => handleRedirect(item)}
          >
            <div id={checkForName(item)} className="single_recipe" tabIndex={"0"} onClick={() => handleRedirect(item)} onKeyDown={event => handleEnter(event, item)}>
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
                {item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + translations["Likes"] : item.reactions.length + translations["Like"]}
              </p>
                {showDeleteButton ? <img onKeyDown={e => {e.stopPropagation(); handleKeyDelete(e, item.id);}} src={helpIcon} tabIndex={"0"} className="delete_recipe_icon" alt={translations["delete_post_button_confirm"]} onClick={e => {e.stopPropagation(); deletePost(item.id)}}/>: null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default MyRecipes;

