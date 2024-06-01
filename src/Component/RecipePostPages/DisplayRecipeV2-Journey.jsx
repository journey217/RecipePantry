import React, { useEffect, useState, useContext } from "react";
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
import { TranslationContext } from "../../Translations/Translation";


const DisplayRecipeV2 = ( { toggleConversions, toggleAddCookbook } ) => {
    const translations = useContext(TranslationContext).translations.DisplayRecipeV2;
    const [recipe, setRecipe] = useState([]);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [image, setImage] = useState("");
    const [recipeName, setRecipeName] = useState("");
    const [recipeID, setRecipeID] = useState(0);
    const [recipeLikes, setRecipeLikes] = useState(0);
    const [recipeTags, setRecipeTags] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [recipeDesc, setRecipeDesc] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(false);
    const [recipeReactions, setRecipeReactions] = useState([]);
    const [poster, setPoster] = useState("");
    const [posterID, setPosterID] = useState(0);
    const [showTags, setShowTags] = useState(false);
    const [showDeleteButton2, setShowDeleteButton2] = useState(false);
    const [posterPFP, setPosterPFP] = useState("");
    const userToken = sessionStorage.getItem("token");
    const userID = sessionStorage.getItem("user");
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState(true);
    const [isPrint, setIsPrint] = useState(false);
    const [deleteButtonText, setDeleteButtonText] = useState(translations["delete_recipe"]);
    var isTooLong = false; // test
    const [showHiddenSuccess, setShowHiddenSuccess] = useState(false);
    const [showDeleteSuccess ,setShowDeleteSuccess] = useState(false);
    const [hidden, setHidden] = useState(false);


    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        loadPost();
    }, [userToken, navigate]);


    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "");
    }

    const loadPost = async () => {

        let url1 = `${process.env.REACT_APP_API_PATH}/users/${userID}`;

        let userResponse = await fetch(url1, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        let userData = await userResponse.json();

        let hiddenPostsLocal = []

        if (userData.attributes.hiddenPosts) {
            hiddenPostsLocal = userData.attributes.hiddenPosts;
        }

        const splits = window.location.href.split("/");
        const recipe_id = splits[splits.length - 1];
        let url = process.env.REACT_APP_API_PATH + "/posts/" + recipe_id;
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
                    if (parseInt(userID) === parseInt(result.authorID)) {
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
                    if (hiddenPostsLocal.includes(result.id)) {
                        setHidden(true);
                    }
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
                        }
                    } else {
                        if (tags) {
                            setRecipeTags(tags);
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
                    if (result.attributes.pictureURL) {
                        setImage(result.attributes.pictureURL);
                    } else {
                        setImage(transparent);
                    }
                }
            })
            .catch((err) => {
                console.log("ERROR loading posts", err);
            });
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
                setShowDeleteSuccess(true);
                sleep(4000).then(r =>navigate("/my-recipes"));
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
                alt={translations["delete_post"]}
                onClick={() => deletePost(text)}
                draggable="false"
            />
        );
    };

    const handleShowDelete = () => {
        let del = document.getElementById("delete_button");
        setShowDeleteButton(!showDeleteButton);
        if (showDeleteButton === false) {
            del.innerText = (translations["cancel"]);
        } else {
            del.innerText = (translations["delete_recipe"]);
        }
    };

    function addIngredient(ingredient) {
        const userID = sessionStorage.getItem("user");
        //check if in cart already
        let query = escape('{"path": "authorID", "equals":"' + userID + '"}');
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
                    if (found) {
                        incrementIngredient(ingredient, itemID, currentCount);
                    } else {
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
                attributes: {
                    "authorID": sessionStorage.getItem("user"),
                    "ingredient": ingredient,
                    "count": currentCount + 1
                }
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
        } else {
            addIngredient(ingredient);
        }
        let but = document.getElementById(e.target.id);
        but.classList.remove("add_to_shopping_list_button");
        // if (true === false) {
        but.classList.add("added_button");
        but.innerText = translations["Added"];
        but.disabled = true;

        sleep(1500).then(
            () => {
                but.classList.remove("added_button");
                but.classList.add("add_to_shopping_list_button");
                but.innerText = translations["Add to Shopping List"];
                but.disabled = false;
            });
    }

    function IngredientsList() {
        return (
            <div className="display_list_container br-margin-bottom">
                <h4 className={"list_title"}>{translations["Ingredients"]}</h4>
                {recipeIngredients.map((ingredient, index) => (
                    <p className="display_ingredients" key={index}>
          <span className="ingredient-and-button">
            <span className={"ingredient"}>{"• " + ingredient} </span>
            <button
                id={index}
                className={"add_to_shopping_list_button"}
                onClick={(e) => handleButtonChange(e, ingredient)}
            >
              {translations["Add to Shopping List"]}
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
                <h4 className={"list_title"}>{translations["Preparation Steps"]}</h4>
                {recipeSteps.map((step, index) => (
                    <p className="display_steps" key={index}>
                        {index + 1 + ". " + step}
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
                <Comments parent={recipeID} posterID={posterID}/>
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
                <img className={"like_image"} src={fullHeart} alt={translations["Like Button"]} draggable="false"/>
            );
        } else {
            return (
                <img className={"like_image"} src={emptyHeart} alt={translations["Like Button"]} draggable="false"/>
            );
        }
    }

    // function DeletePost() {
    //     return (
    //     );
    // }

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

    function RecipeInfo() {
        return (
            <div className={"ing_steps_container"}>
                <IngredientsList/>
                <StepsList/>
            </div>
        );
    }

    function handleSwitch(type, a, i) {
        let active = document.getElementById(a);
        let inactive = document.getElementById(i);
        active.classList.add("active");
        inactive.classList.remove("active");
        if (type === "info") {
            setShowInfo(true);
            setShowComments(false);
        } else {
            setShowInfo(false);
            setShowComments(true);
        }
    }

    const unhidePost = async (postId) => {
        const userUrl = `${process.env.REACT_APP_API_PATH}/users/${userID}`;
        const userResponse = await fetch(userUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        const userData = await userResponse.json();
        const userAttributes = userData.attributes;
        let hiddenPostsLocal = userAttributes.hiddenPosts;

        let delIdx = hiddenPostsLocal.indexOf(postId);
        hiddenPostsLocal.splice(delIdx, 1);
        userAttributes["hiddenPosts"] = hiddenPostsLocal;

        const bodyData = {
            attributes: userAttributes
        };

        const patchResponse = await fetch(userUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify(bodyData),
        })

        if (patchResponse.ok) {
            setHidden(false);
        } else {
            console.error("Failed to update hidden posts");
        }

    };

    const PrintRecipe = () => {
        return (
            <div>
                <div className={"print_container"}>
                    <div className={"print_item"}>
                        <div className="print-header">
                            <h2 style={{wordBreak: "break-word"}}>{recipeName}</h2>
                            <p>{translations["By"]}: {poster}</p>
                        </div>
                        <img className={"print_image"} src={checkForImage(image)} alt={recipeName} draggable="false"/>
                    </div>
                    <div className={"print_item"}>
                        <div className="print-ingredients">
                            <h3>{translations["Ingredients"]}</h3>
                            {recipeIngredients.map((ingredient, index) => (
                                <p style={{wordBreak: "break-word"}} key={index}>
                                    <span>{"• " + ingredient} </span>
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className={"print_spacer"}></div>
                    <div className={"print_item"}>
                        <div className="print-preparation">
                            <h3>{translations["Preparation Steps"]}</h3>
                            {recipeSteps.map((step, index) => (
                                <p style={{wordBreak: "break-word"}} key={index}>
                                    {index + 1 + ". " + step}
                                </p>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handlePrint = (e) => {
        setIsPrint(true)
        window.print();
    }

    const hidePost = async (postId) => {
        const userUrl = `${process.env.REACT_APP_API_PATH}/users/${userID}`;
        try {
            const userResponse = await fetch(userUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });

            const userData = await userResponse.json();
            const userAttributes = userData.attributes || {};
            let hiddenPostsLocal = userAttributes.hiddenPosts;

            if (!hiddenPostsLocal.includes(postId)) {
                hiddenPostsLocal.push(postId);
                userAttributes.hiddenPosts = hiddenPostsLocal;

                const bodyData = {
                    attributes: userAttributes
                };

                const patchResponse = await fetch(userUrl, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(bodyData)
                });

                if (patchResponse.ok) {
                    setShowHiddenSuccess(true);
                    sleep(4000).then(r =>navigate("/"));
                } else {
                    console.error("Failed to update hidden posts");
                }
            } else {
                console.error("Post already hidden");
            }
        } catch (error) {
            console.error("Error updating hidden posts:", error);
        }
    };

    function HiddenSuccess() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p className={"a-t-c-recipe-removed-text"}>This recipe has been successfully hidden.
                        <br/>
                        <br/>
                        You will be redirected to the homepage shortly.
                    </p>
                </div>
            </div>
        );
    }

    function DeleteSuccess() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p className={"a-t-c-recipe-removed-text"}>This recipe has been successfully deleted.
                        <br/>
                        <br/>
                        You will be redirected to 'My Recipes' shortly.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="print-area2"><PrintRecipe/></div>
            <div className="my_recipes">
                <h1 className={"page_title br-margin-bottom"}></h1>
                <div className="display_recipe_button_nav br-margin-bottom">
                    <div className="display_recipe_button_nav_item_1">
                        <button
                            className="go_back_button"
                            onClick={() => window.history.back()}
                        >
                            <IoArrowBackCircleSharp/> {translations["Back"]}
                        </button>
                    </div>
                    <div className="display_recipe_button_nav_item">
                    </div>
                    <div className="display_recipe_button_nav_item_3">
                        <button
                            className={"create_conversions_button_2"}
                            onClick={toggleConversions}
                        >
                            {translations["Unit Conversions"]}
                        </button>
                        {hidden ?
                                 <button
                                    onClick={() => unhidePost(recipeID)}
                                    style={{
                                        backgroundColor: "#CF6E4F",
                                        color: "white",
                                        margin: "10px 10px 10px 5px",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#A65035")
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#CF6E4F")
                                    }
                                    >{translations["unhide"]}</button>:<button
                                    onClick={() => hidePost(recipeID)}
                                    style={{
                                        backgroundColor: "#CF6E4F",
                                        color: "white",
                                        margin: "10px 10px 10px 5px",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#A65035")
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#CF6E4F")
                                    }
                                >{translations["hide_post"]}</button>}
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
                                    {translations["Edit Recipe"]}
                                </button>
                                <button
                                    id="delete_button"
                                    className="delete_recipe_button"
                                    onClick={handleShowDelete}
                                >
                                    {translations["delete_recipe"]}
                                </button>
                            </>
                        )}
                        {showDeleteButton && <DeleteButton text={recipeID}/>}
                    </div>
                </div>
                <div className={"add-to-cookbook-image-desc-container"}>
                    <div className={"a-t-c-title-container"}>
                        <br/>
                        <div className="a-t-c-title">{recipeName}<Printer onClick={handlePrint}
                                                                          className="print-button"/></div>
                        <p className={"a-t-c-desc"}>{recipeDesc}</p>
                        <br/>
                        <Tags2 input={recipeTags}/>
                        <div className="display_recipe_poster_likes_container">
                            <div className="display_recipe_poster_likes_item">
                                <div className={"display-cookbook-username-picture-container"}>
                                    <div className={"d-cb-u-p-center-container"}>
                                        <div onClick={() => navigate("/profile/" + posterID)}
                                             className={"d-cb-pfp-container"}>
                                            <img className={"profile_picture_recipe"} src={posterPFP || defaultUser}
                                                 alt={poster} draggable="false"/>
                                        </div>
                                        <div className={"d-cb-u-p-spacer"}></div>
                                        <p><Link to={"/profile/" + posterID}>{"@" + poster}</Link></p>
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
                                    <p className="display_recipe_likes">{recipeLikes > 1 || recipeLikes === 0 ? recipeLikes + translations["likes"]: recipeLikes + translations["like"]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"display-recipe-image-container2"}>
                        <img className={"display_recipe_image2"} src={checkForImage(image)} alt={recipeName}
                             draggable="false"/>
                    </div>
                </div>
                <div className="tabs_fyp">
                    <button id={"fyp"} className={"tab-fyp-btn-fyp active"}
                            onClick={e => handleSwitch("info", "fyp", "all-recipes")}>{translations["Recipe"]}
                    </button>
                    <button id={"all-recipes"} className={"tab-fyp-btn-all-recipes"}
                            onClick={e => handleSwitch("comments", "all-recipes", "fyp")}>{translations["Comments"]}
                    </button>
                    <div className={"br-margin-bottom"}></div>
                </div>
                <div className={"info_comments_container"}>
                    {showInfo ? <RecipeInfo/> : null}
                    {showComments ? <CommentSection/> : null}
                </div>
                <button className="create_recipe_button" onClick={toggleAddCookbook}>{translations["Add to Cookbook"]}</button>
                {showHiddenSuccess ? <HiddenSuccess/>:null}
                {showDeleteSuccess ? <DeleteSuccess/>:null}
            </div>
        </div>
    );

    function Tags2({input}) {
        for (let i = 0; i < input.length; i++) {
            input[i] = input[i].replace(/\s/g, '');
            if (input[i] === "") {
                input.splice(i, 1);
            }
        }
        if (input.length !== null && input.length > 0) {
            for (let i = 0; i < input.length; i++) {
                input[i] = input[i].replace(" ", "");
            }
            return (
                <div className="a-t-c-tags-container">
                    {input.map((item, index) => (
                        <div id={item} tabIndex={"0"} onKeyDown={event => handleKeyTag(event, item)} key={index}
                             className="a-t-c-single-tag-container"
                             onClick={() => navigate('/cuisines?=' + item)}>#{item}
                        </div>
                    ))}
                </div>
            );
        }
    }

    function handleKeyTag(e, item) {
        if (e.keyCode === 13) {
            navigate('/cuisines?=' + item);
        }
    }
};
export default DisplayRecipeV2;