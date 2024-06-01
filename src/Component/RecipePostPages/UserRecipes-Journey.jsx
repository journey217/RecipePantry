import React, { useEffect, useState } from "react";
import PostForm from "./PostForm";
import PostingList from "./PostingList";
import "../../CSS Files/Journey.css"
import {Link, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png";

const UserRecipes = ( appRefresh ) => {

  const [recipes, setRecipes] = useState([]);
  const [hiddenPosts, setHiddenPosts] = useState(JSON.parse(localStorage.getItem('hiddenPosts') || '[]'));
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [username, setUsername] = useState("DefaultUsername");
  const userID = sessionStorage.getItem("user");

  // load all the posts in the database to display on the screen in the home page
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

    // if the user is not logged in, we don't want to try loading posts, because it will just error out.
    if (sessionStorage.getItem("token") && sessionStorage.getItem('user')) {

        const query = escape('{"path": "recipe_authorID", "equals":"'+user_id+'"}')

      let url = process.env.REACT_APP_API_PATH + "/posts?attributes="+query;

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
          console.log(result)
          if (result) {
            setIsLoaded(true);
            const visiblePosts = result[0].filter(post => {
                        const notHidden = !hiddenPostsLocal.includes(post.id);
                        const notPrivate = post.attributes.postType === "Public" ||
                            (post.attributes.postType === "Private" && post.authorID.toString() === userID);

                        return notHidden && notPrivate;
                    });
            setRecipes(visiblePosts);
            // console.log("Got Posts");
          }
        })
        .catch((err) => {
          setIsLoaded(true);
          setError(err);
          console.log("ERROR loading posts");
        });
    }
  };



  // variable for userToken to check authorization
  const userToken = sessionStorage.getItem("token");
  const navigate = useNavigate();
  // useEffect hook, this will run everything inside the callback
  // function once when the component loads
  // the dependency array has userToken inside of it, which means the useEffect will
  // run everything inside of it everytime the userToken variable changes

  useEffect(() => {
      // console.log(userToken);

      // if the user is not logged in, go back to the default route, which will take them to the login page
      if (!userToken) {
        navigate("/");
      }

      loadPosts()
      // the first thing we do when the component is ready is load the posts.
  }, [userToken, navigate]);

    function checkForImage(item) {
      if (item.attributes) {
          if (item.attributes.pictureURL && item.attributes.pictureURL !== "https://webdev.cse.buffalo.eduundefined") {
              return item.attributes.pictureURL;
          } else {
              return transparent
          }
      } else {
          return transparent
      }
  }

  function checkForName(item) {
      if (item.attributes) {
          if (item.attributes.recipeName) {
              return item.attributes.recipeName;
          } else {
              return "DefaultName"
          }
      } else {
          return "DefaultName"
      }
  }


  return (
    <div className="my_recipes">
      <h3 className="page_title">{username}'s Recipes</h3>
      <br/>
        <div className="landing_page_recipes_container">
                {recipes.map((item, index) => (
                    <div className='single_recipe_container' onClick={() => navigate('/post/' + item.id)}>
                    <div className="single_recipe" key={index}>
                        <div className={"single_recipe_image_container"}>
                            <img className="single_recipe_image" src={checkForImage(item)} alt={checkForName(item)} draggable="false"></img>
                        </div>
                        <p className="single_recipe_undertext">{checkForName(item)}</p>
                        <p className="single_recipe_undertext">{item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + " Likes": item.reactions.length + " Like"}</p>
                    </div>
                    </div>
                ))}
            </div>
            <Link to={"/post-recipe"}><button className="create_recipe_button">Post a Recipe</button></Link>
    </div>
  );
};


export default UserRecipes;