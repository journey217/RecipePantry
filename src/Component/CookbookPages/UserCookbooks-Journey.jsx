import React, { useEffect, useState, useContext } from "react";
import PostForm from "../RecipePostPages/PostForm";
import PostingList from "../RecipePostPages/PostingList";
import "../../CSS Files/Journey.css"
import {Link, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import { TranslationContext } from "../../Translations/Translation";

const MyCookbooks = () => {
    const userToken = sessionStorage.getItem("token");
    const userID = sessionStorage.getItem("user");
    const navigate = useNavigate();
    const [cookbooks, setCookbooks] = useState([]);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [username, setUsername] = useState("DefaultUsername");
    const translations = useContext(TranslationContext).translations.CookbookPages.UserCookbooksJourney;

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        loadPosts()
    }, [userToken, navigate, userID]);

    const loadPosts = () => {
    if (sessionStorage.getItem("token") && sessionStorage.getItem('user')) {

        const splits = window.location.href.split('/');
      const user_id = splits[splits.length - 1];

      fetch(
          `${process.env.REACT_APP_API_PATH}/users/` +user_id,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.attributes.username) {
                    setUsername(result.attributes.username);
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });

        let query = escape('{"path": "cb_authorID", "equals":"'+user_id+'"}');

        let url = process.env.REACT_APP_API_PATH + "/posts?attributes="+query;

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
                    setCookbooks(result[0]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }};

    function checkForImage(item) {
      if (item.attributes) {
          if (item.attributes.cbImageURL && item.attributes.cbImageURL !== "https://webdev.cse.buffalo.eduundefined") {
              return item.attributes.cbImageURL;
          } else {
              return transparent
          }
      } else {
          return transparent
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
      if (!showDeleteButton) {
          navigate('/post/cookbook/' + item.id);
       }
  }

  function handleEnter (e, item) {
        if (e.keyCode === 13) {
            navigate("/post/cookbook/"+item.id);
        }
    }

    return (
        <div>
            <h3 className="page_title">{username}{translations["user_cookbooks"]}</h3>
            <br/>
            <div className={"cookbooks-list-container"}>
                {cookbooks.map((item) => (
                    <div className='single_recipe_container' key={item.id} onClick={() => handleRedirect(item)}>
                    <div className="single_recipe" id={checkForName(item)} tabIndex={"0"} onClick={() => navigate('/post/cookbook/' + item.id)} onKeyDown={e => handleEnter(e, item)}>
                        <div className={"single_recipe_image_container"}>
                            <img className="single_recipe_image" src={checkForImage(item)} alt={checkForName(item)} draggable="false"></img>
                        </div>
                        <p className="single_recipe_undertext">{checkForName(item)}</p>
                        <p className="single_recipe_undertext">{item.attributes.savedBy.length > 1 || item.attributes.savedBy.length === 0 ? item.attributes.savedBy.length + " Bookmarks": item.attributes.savedBy.length + " Bookmark"}</p>
                    </div>
                    </div>
                ))}
            </div>
            <Link to={"/create-a-cookbook"}><button className="create_recipe_button">{translations["create_cookbook"]}</button></Link>
        </div>
    );
};

export default MyCookbooks;