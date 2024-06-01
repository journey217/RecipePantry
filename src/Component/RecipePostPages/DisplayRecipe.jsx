//unused
import React, { useEffect, useState } from "react";
import PostForm from "./PostForm";
import PostingList from "./PostingList";
import Comments from "./Comments-Jessica";
import "../../CSS Files/Journey.css";
import { Link, useNavigate } from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import emptyHeart from "../../assets/heart.png";
import fullHeart from "../../assets/full_heart.png";
import defaultUser from "../../assets/default_user.png"
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { LuPrinter as Printer } from "react-icons/lu";

const DisplayRecipe = ( { toggleConversions, toggleAddCookbook } ) => {

  const [recipe, setRecipe] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [image, setImage] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [recipeID, setRecipeID] = useState(0);
  const [recipeLikes, setRecipeLikes] = useState(0);
  const [recipeTags, setRecipeTags] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState([]);
  const [recipeDesc, setRecipeDesc] = useState("");
  const [showRecipeIng, setShowRecipeIng] = useState(false);
  const [showRecipeSteps, setShowRecipeSteps] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [recipeReactions, setRecipeReactions] = useState([]);
  const [poster, setPoster] = useState("");
  const [posterID, setPosterID] = useState(0);
  const [showTags, setShowTags] = useState(false);
  const [showDeleteButton2, setShowDeleteButton2] = useState(false);
  const [showTagsDiv, setShowTagsDiv] = useState(true);
  const [deleteButtonText, setDeleteButtonText] = useState("Delete Recipe");
  const [posterPFP, setPosterPFP] = useState("");


  function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "");
  }

  // load all the posts in the database to display on the screen in the home page
  const loadPost = () => {
    // if the user is not logged in, we don't want to try loading posts, because it will just error out.
    if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
      const userID = parseInt(sessionStorage.getItem("user"));
      const userToken = sessionStorage.getItem("token");

      const splits = window.location.href.split("/");
      const recipe_id = splits[splits.length - 1];
      let url = process.env.REACT_APP_API_PATH + "/posts/" + recipe_id;

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
            if (result) {
              if (result.author.attributes.username !== "") {
                setPoster(result.author.attributes.username);
              }
              setPosterID(result.author.id);
              setPosterPFP(result.author.attributes.picture);
              if (userID === parseInt(result.authorID)) {
                setShowDeleteButton2(true);
              }
              setRecipeReactions(result.reactions);
              if (result.reactions.length > 0) {
                let i = 0;
                let found = false;
                while (i < result.reactions.length) {
                  if (
                      result.reactions[i].reactorID ===
                      parseInt(sessionStorage.getItem("user"))
                  ) {
                    found = true;
                    setLiked(true);
                    i = result.reactions.length;
                  } else {
                    i++;
                  }
                }
                if (found === false) {
                  setLiked(false);
                }
              }
              setRecipe(JSON.stringify(result));
              setRecipeName(escapeHtml(result.attributes.recipeName));
              setRecipeDesc(escapeHtml(result.attributes.recipeDescription));
              setRecipeID(result.id);
              setRecipeLikes(result.reactions.length);
              setImage(result.attributes.pictureURL);
              let tags = result.attributes.recipeTags;
              if (tags.constructor.name !== "Array") {
                if (tags !== "") {
                  let split_tags = tags.split(",");
                  let split_tags_stripped = split_tags.map((s_tag) =>
                      escapeHtml(s_tag.replace(" ", ""))
                  );
                  setRecipeTags(split_tags_stripped);
                } else {
                  setShowTagsDiv(false);
                }
              } else {
                if (tags) {
                  setRecipeTags(tags);
                } else {
                  setShowTagsDiv(false)
                }
              }
              let ingred = result.attributes.recipeIngredients;
              if (ingred !== "") {
                let split_ingred = ingred.split(",");
                if (split_ingred.length === 1) {
                  setRecipeIngredients([split_ingred]);
                } else {
                  let split_ingred_stripped = split_ingred.map((s_ingred) =>
                      escapeHtml(s_ingred.trimStart())
                  );
                  setRecipeIngredients(split_ingred_stripped);
                }
              }
              let steps = result.attributes.recipeSteps;
              if (steps !== "") {
                let split_steps = steps.split(",");
                if (split_steps.length === 1) {
                  setRecipeSteps([split_steps]);
                } else {
                  let split_steps_stripped = split_steps.map((s_step) =>
                      escapeHtml(s_step.trimStart())
                  );
                  setRecipeSteps(split_steps_stripped);
                }
              }
              if (recipe.attributes.pictureURL) {
                setImage(recipe.attributes.pictureURL);
              } else {
                setImage(transparent);
              }
            }
          })
          .catch((err) => {
            setIsLoaded(true);
            setError(err);
            // console.log("ERROR loading posts");
          });
    }
  };

  const deletePost = (input) => {
    let postID = input.text;
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
        .then((result) => {
          navigate("/my-recipes");
        })
        .catch((error) => {
          alert("error!" + error);
        });
  };

  const DeleteButton = (text) => {
    return (
        <img
            src={helpIcon}
            className="delete_recipe_icon_2"
            alt="Delete Post"
            onClick={() => deletePost(text)}
            draggable="false"
        />
    );
  };

  const handleShowDelete = () => {
    setShowDeleteButton(!showDeleteButton);
    let button_text = document.getElementById("delete_button");
    if (showDeleteButton === false) {
      setDeleteButtonText("Cancel");
    } else {
      setDeleteButtonText("Delete Recipe");
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
    // if the user is not logged in, go back to the default route, which will take them to the login page
    if (!userToken) {
      navigate("/");
    }

    loadPost();
    // the first thing we do when the component is ready is load the posts.
  }, [userToken, navigate]);

  function addIngredient (ingredient) {
    const userID = sessionStorage.getItem("user");
    //check if in cart already
    let query = escape('{"path": "authorID", "equals":"'+userID+'"}');
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
              let found = false;
              let itemID = "";
              let currentCount = 0;
              for (let cartItem of result[0]) {
                if (cartItem.attributes.ingredient === ingredient) {
                  found = true;
                  itemID = cartItem.id;
                  currentCount = cartItem.attributes.count;
                  break;
                }
              }
                if (found){
                  incrementIngredient(ingredient, itemID, currentCount);
                } 
                else{
                  addNewIngredient(ingredient);
                }
            }
            })
        .catch((err) => {
            console.log(err);
        });
}

    function incrementIngredient(ingredient, postID, currentCount) {
      fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          attributes: {"authorID": sessionStorage.getItem("user"), "ingredient": ingredient,"count": currentCount + 1}
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log("incremented ingredient count");
        })
        .catch((err) => {
          console.log(err);
      });
    }
  

    function addNewIngredient(ingredient) {
    // make the api call to post
    fetch(process.env.REACT_APP_API_PATH + "/posts", {
      method: "post",
      headers: {
        "Content-Type": "application/json", 
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem("user"),
        content: "List Item",
        attributes: {"authorID": sessionStorage.getItem("user"), "ingredient": ingredient, "count": 1}
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("added ingredient to shopping list")

        },
      (error) => {
          console.log(error);
      })
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleButtonChange(e, ingredient) {
  if (Array.isArray(ingredient)) {
    addIngredient(ingredient[0]);
  }else{
  addIngredient(ingredient);
  };
  let but = document.getElementById(e.target.id);
  but.classList.remove("add_to_shopping_list_button");
  but.classList.add("added_button");
  but.innerText = "Added";
  but.disabled = true;

  sleep(1500).then(
    () => {
      but.classList.remove("added_button");
      but.classList.add("add_to_shopping_list_button");
      but.innerText = "Add to Shopping List";
      but.disabled = false;
    }
  );

} 

function IngredientsList() {
  return (
    <div className="display_list_container br-margin-bottom">
      {recipeIngredients.map((ingredient, index) => (
        <p className="display_ingredients" key={index}>
          <span className="ingredient-and-button">
            <span>{"• " + ingredient} </span>
            <button
              id={index}
              className={"add_to_shopping_list_button"}
              onClick={(e) => handleButtonChange(e, ingredient)}
            >
              Add to Shopping List
            </button>
          </span>
        </p>
      ))}
    </div>
  );
}

  function StepsList() {
    return (
        <div className="display_list_container br-margin-bottom">
          {recipeSteps.map((step, index) => (
              <p className="display_steps" key={index}>
                {"• " + step}
              </p>
          ))}
        </div>
    );
  }

  function CommentSection() {
    return (
        <div
            className="display_list_container br-margin-bottom"
            style={{
              padding: 0,
            }}
        >
          <Comments parent={recipeID} posterID={posterID}/> {/* posterID == NEW ADDITION */}
        </div>
    );
  }

  const tagPost = (thisPostID) => {
    //find the appropriate reaction to delete - namely, the one from the current user

    let userReaction = -1;
    if (recipeReactions.length > 0) {
      recipeReactions.forEach((reaction) => {
        if (reaction.reactorID === parseInt(sessionStorage.getItem("user"))) {
          userReaction = reaction.id;
        }
      });
    }

    // if there is one, delete it.
    if (userReaction >= 0) {
      //make the api call to post
      fetch(
          process.env.REACT_APP_API_PATH + "/post-reactions/" + userReaction,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
      ).then(
          (result) => {
            setLiked(false);
            loadPost();
          },
          (error) => {
            alert("error!" + error);
          }
      );
    } else {
      //make the api call to post
      fetch(process.env.REACT_APP_API_PATH + "/post-reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          reactorID: sessionStorage.getItem("user"),
          postID: thisPostID,
          name: "like",
        }),
      }).then(
          (result) => {
            loadPost();
          },
          (error) => {
            alert("error!" + error);
          }
      );
    }
  };

  function LikeButton({bool}) {
    if (bool === true) {
      return (
          <img className={"like_image"} src={fullHeart} alt={"Like Button"} draggable="false"/>
      );
    } else {
      return (
          <img className={"like_image"} src={emptyHeart} alt={"Like Button"} draggable="false"/>
      );
    }
  }

  function DeletePost() {
    return (
        <button
            id="delete_button"
            className="delete_recipe_button"
            onClick={handleShowDelete}
        >
          {deleteButtonText}
        </button>
    );
  }

  function handleLike() {
    tagPost(recipeID);
  }

  function checkForImage(image) {
    if (image !== "" && image !== "https://webdev.cse.buffalo.eduundefined") {
      return image;
    } else {
      return transparent;
    }
  }

  function TagsDiv() {
    return (
        <button
            className={"display_ingred_steps_dropdown"}
            onClick={() => setShowTags(!showTags)}
        >
          View Tags
        </button>
    );
  }



  const PrintRecipe = () => {

    return(
    <div>
        <div className="print-header">
            <h2>{recipeName}</h2>
            <p>By: {poster}</p>
        </div>
        <div className="print-ingredients">
          <h3>Ingredients</h3>
        {recipeIngredients.map((ingredient, index) => (
        <p key={index}>
            <span>{"• " + ingredient} </span>
        </p>
      ))}
        </div>
        <div className="print-preparation">
            <h3>Preparation</h3>
            {recipeSteps.map((step, index) => (
              <p key={index}>
                {"• " + step}
              </p>
          ))}
        </div>
    </div>
    );
    }

  const handlePrint = (e) => {
    window.print();
  }


  return (
    <div>
    <div className="print-area">
    <PrintRecipe/>
    </div>
      <div className="my_recipes">
        <br/>
          <div className="display_recipe_button_nav">
            <div className="display_recipe_button_nav_item_1">
              <button
                  className="go_back_button"
                  onClick={() => window.history.back()}
              >
                <IoArrowBackCircleSharp /> Back
              </button>
            </div>
            <div className="display_recipe_button_nav_item">
              <h1 className="display_recipe_button_nav_title">{recipeName} 
              <Printer onClick={handlePrint} className="print-button"/></h1>
            </div>
            <div className="display_recipe_button_nav_item_3">
              <button
                  className={"create_conversions_button_2"}
                  onClick={toggleConversions}
              >
                Unit Conversions
              </button>
              {showDeleteButton2 && (
                  <>
                      {/* Edit Recipe Button */}
                    <button
                        className="edit-recipe-button"
                        onClick={() => navigate(`/edit-recipe/${recipeID}`)}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          margin: "10px 10px 10px 5px",
                          padding: "10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#045D05")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "green")
                        }
                    >
                      Edit Recipe
                    </button>
                    <DeletePost/>
                  </>
              )}
              {showDeleteButton && <DeleteButton text={recipeID}/>}
            </div>
          </div>
        <div className="display_recipe_items">
          <div className="display_recipe_description">
            <div className={"d-r-desc-container"}>
              <p className={"d-r-desc-text"}>{recipeDesc}</p>
            </div>
            <div className="display_recipe_poster_likes_container">
              <div className="display_recipe_poster_likes_item">
                <div className={"display-cookbook-username-picture-container"}>
                        <div className={"d-cb-u-p-center-container"}>
                            <div onClick={() => navigate("/profile/"+posterID)} className={"d-cb-pfp-container"}>
                                <img className={"profile_picture_recipe"} src={posterPFP || defaultUser} alt={poster} draggable="false"/>
                            </div>
                            <div className={"d-cb-u-p-spacer"}></div>
                        <p><Link to={"/profile/"+posterID}>{poster}</Link></p>
                        </div>
                    </div>
              </div>
              <div className="display_recipe_poster_likes_item">
                <div className="display_recipe_like_img_count">
                  <button
                      className="display_recipe_like_button"
                      onClick={handleLike}
                  >
                    {liked ? (
                        <LikeButton bool={true}/>
                    ) : (
                        <LikeButton bool={false}/>
                    )}
                  </button>
                  <p className="display_recipe_likes">{recipe.reactions.length > 1 || recipe.reactions.length === 0 ? recipe.reactions.length + " Likes": recipe.reactions.length + " Like"}</p>
                </div>
              </div>
              <div className="display_recipe_poster_likes_item"></div>
              
            </div>
            <br/>
          </div>
          <div className="display_recipe_image_ingr_steps_container">
            <div className={"display-recipe-image-container"}>
              <img
                className="display_recipe_image"
                src={checkForImage(image)}
                alt={recipeName}
                draggable="false"
              />
            </div>
            <div className="display_recipe_ingr_steps_container">
                <button
                    className={"display_ingred_steps_dropdown"}
                    onClick={() => setShowRecipeIng(!showRecipeIng)}
                >
                  View Ingredients
                </button>
                {showRecipeIng ? <IngredientsList/> : <div className={"br-margin-bottom"}/>}
                <button
                    className={"display_ingred_steps_dropdown"}
                    onClick={() => setShowRecipeSteps(!showRecipeSteps)}
                >
                  View Preparation Steps
                </button>
                {showRecipeSteps ? <StepsList/> : <div className={"br-margin-bottom"}/>}
                <button
                    className={"display_ingred_steps_dropdown"}
                    onClick={() => setShowComments(!showComments)}
                >
                  View Comment Section
                </button>
                {showComments ? <CommentSection/> : <div className={"br-margin-bottom"}/>}
                {showTagsDiv ? <TagsDiv/> : null}
                {showTags ? <Tags input={recipeTags}/> : null}
            </div>
          </div>
          <br/>
          <br/>
        </div>
        <button className="create_recipe_button" onClick={toggleAddCookbook}>Add to Cookbook</button>
    </div>
    </div>
  );

  function Tags({input}) {
    for (let i = 0; i < input.length; i++) {
      input[i] = input[i].replace(/\s/g, '');
      if (input[i] === "") {
        input.splice(i, 1);
      }
    }
    const navigate = useNavigate();
    return (
        <div className="display_tags_rows">
          {input.map((item, index) => (
              <div key={index}>
                <div
                    className="display_recipe_single_tag_container"
                    onClick={() => navigate('/cuisines?=' + item)}
                >
                  <p className="display_recipe_tag_text">#{item}</p>
                </div>
              </div>
          ))}
        </div>
    );
  }
}
export default DisplayRecipe;
