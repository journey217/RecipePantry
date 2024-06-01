import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Jessica.css";
import { useNavigate } from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import { FiList } from "react-icons/fi";
import { TranslationContext } from "../../Translations/Translation";

const UserRecipes = (appRefresh) => {
  const [recipes, setRecipes] = useState([]);
  const translations = useContext(TranslationContext).translations.RecipePages;
  const [sortBy, setSortBy] = useState("newest");
  const userID = sessionStorage.getItem("user");

  const loadPosts = async () => {

    let url10 = `${process.env.REACT_APP_API_PATH}/users/${userID}`;

    let userResponse = await fetch(url10, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    let userData = await userResponse.json();
    let hiddenPostsLocal = userData.attributes.hiddenPosts;

    const splits = window.location.href.split("/");
    const user_id = splits[splits.length - 1];

    if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
      const query = escape(
          '{"path": "recipe_authorID", "equals":"' + user_id + '"}'
      );

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
              const visiblePosts = result[0].filter(post => {
                const notHidden = !hiddenPostsLocal.includes(post.id);
                const notPrivate = post.attributes.postType === "Public" ||
                    (post.attributes.postType === "Private" && post.authorID.toString() === userID);

                return notHidden && notPrivate;
              });
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

  const userToken = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/");
    }
    loadPosts();
  }, [userToken, navigate, sortBy]);

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

    function handleRedirect(item) {
      navigate("/post/" + item.id);
  }

  function handleEnter (e, item) {
        if (e.keyCode === 13) {
            navigate("/post/"+item.id);
        }
    }


  if (recipes.length === 0) {
    return (
      <div className="my-recipes">
        <div className="my_recipes_container my-recipes-container">
          <div className="noposts-text">{translations["no_recipes_yet"]}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="my-recipes">
        <SortingControls sortBy={sortBy} setSortBy={setSortBy}/>
        <div className="my_recipes_container my-recipes-container">
          {recipes.map((item) => (
            <div
              className="single_recipe_container"
              onClick={() => navigate("/post/" + item.id)}
              key={item.id}
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
                  {item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + translations["Likes"]: item.reactions.length + translations["Like"]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default UserRecipes;
