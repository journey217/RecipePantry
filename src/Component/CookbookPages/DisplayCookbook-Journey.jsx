import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Journey.css"
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import defaultUser from "../../assets/default_user.png"
import {IoArrowBackCircleSharp} from "react-icons/io5";
import { TranslationContext } from "../../Translations/Translation";

const DisplayCookbook = () => {
    const userToken = sessionStorage.getItem("token");
    const userID = sessionStorage.getItem("user");
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [cookbook, setCookbook] = useState({});
    const [cbPFP, setCbPFP] = useState("");
    const [cbName, setCbName] = useState("");
    const [cbDesc, setCbDesc] = useState("");
    const [cbTags, setCbTags] = useState("");
    const [cbImage, setCbImage] = useState("");
    const [cbAuthor, setCbAuthor] = useState("");
    const [cbSavedBy, setCbSavedBy] = useState([]);
    const [showRemoved, setShowRemoved] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const location = useLocation()
    const [showAdded, setShowAdded] = useState(false);
    const [showNotAdded, setShowNotAdded] = useState(false);
    const [showDeleteButton2, setShowDeleteButton2] = useState(false);
    const [showDeleteButton22, setShowDeleteButton22] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const translations = useContext(TranslationContext).translations.CookbookPages.DisplayCookbookJourney;


    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        loadCookbook();
    }, [location]);

    const loadCookbook = async () => {

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
            const cookbook_id = splits[splits.length - 1];
            let url = process.env.REACT_APP_API_PATH + "/posts/" + cookbook_id;
            let query = escape('{"path": "memberOf", "arrayContains":' + cookbook_id + '}');
            let url1 = process.env.REACT_APP_API_PATH + "/posts?attributes=" + query;
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
                        setCookbook(result);
                        setCbPFP(result.author.attributes.picture)
                        if (result.authorID === parseInt(sessionStorage.getItem("user"))) {
                            setShowDeleteButton(true);
                            setShowDeleteButton2(true)
                        }
                        setCbName(result.attributes.cbName);
                        setCbDesc(result.attributes.cbDesc);
                        setCbAuthor(result.author.attributes.username);
                        if (result.attributes.savedBy) {
                            setCbSavedBy(result.attributes.savedBy);
                        }
                        let tags = result.attributes.cbTags;
                        if (tags.constructor.name !== "Array") {
                            if (tags !== "") {
                                let split_tags = tags.split(",");
                                let split_tags_stripped = split_tags.map((s_tag) =>
                                    s_tag.replace(" ", "")
                                );
                                setCbTags(split_tags_stripped);
                            }
                        } else {
                            if (tags) {
                                setCbTags(tags);
                            }
                        }
                        setCbImage(result.attributes.cbImageURL);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            fetch(url1, {
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
                    setRecipes(visiblePosts);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
    };

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
                return translations["unnamed"]
            }
        } else {
            return translations["unnamed"]
        }
    }

    function checkForDesc(item) {
        if (item.attributes) {
            if (item.attributes.recipeDescription) {
                return item.attributes.recipeDescription;
            } else {
                return translations["no_desc"]
            }
        } else {
            return translations["no_desc"]
        }
    }

    function handleRedirect(item) {
        navigate('/post/' + item.id);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function removeRecipe(recipe) {
        let membersList = recipe.attributes.memberOf;
        let index = recipe.attributes.memberOf.indexOf(cookbook.id);
        if (index > -1) {
            membersList.splice(index, 1);
        } else {
            return
        }
        let tagString = "";
        if (recipe.attributes.recipeTagString) {
            tagString = recipe.attributes.recipeTagString;
        }

        const newAttributes = recipe.attributes;

        newAttributes["recipeTagString"] = tagString;

        newAttributes["memberOf"] = membersList;

        newAttributes["recipe_authorID"] = recipe.authorID.toString();

        fetch(process.env.REACT_APP_API_PATH + "/posts/" + recipe.id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                authorID: recipe.authorID,
                content: "Recipe",
                attributes: newAttributes
            }),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    loadCookbook();
                },
                (error) => {
                    console.log(error)
                });
    }

    function RemovedFromCookbook() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p className={"a-t-c-recipe-removed-text"}>{translations["remove_recipe_success"]}
                        <br/>
                        <br/>
                        {translations["disappear_shortly"]}
                    </p>
                </div>
            </div>
        );
    }

    function Tags({input}) {
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
                    <div id={item} tabIndex={"0"} onKeyDown={event => handleKeyTag(event, item)} key={index} className="a-t-c-single-tag-container"
                             onClick={() => navigate('/search-cookbooks?=' + item)}>#{item}
                        </div>
                    ))}
                </div>
            );
        }
    }

    function handleKeyTag (e, item) {
        if (e.keyCode === 13) {
            navigate('/search-cookbooks?='+item);
        }
    }

    function handleKeyRemove (e, item) {
        if (e.keyCode === 13) {
            removeRecipe(item);
        }
    }

    function handleSaveCookbook() {
        let newList = cbSavedBy;
        if (cbSavedBy.includes(userID)) {
            setShowNotAdded(true);
            sleep(3000).then(r => setShowNotAdded(false));
            return
        }
        newList.push(userID);
        const splits = window.location.href.split('/');
        const cookbook_id = splits[splits.length - 1];
        let url = process.env.REACT_APP_API_PATH + "/posts/" + cookbook_id;

        let tagString = ""
        if (cookbook.attributes.cookbookTagString) {
            tagString = cookbook.attributes.cookbookTagString;
        }

        const newAttributes = cookbook.attributes;

        newAttributes["cb_authorID"] = cookbook.authorID.toString();

        newAttributes["savedBy"] = newList;

        newAttributes["cookbookTagString"] = tagString;

        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                authorID: cookbook.authorID.toString(),
                content: "Cookbook",
                attributes: newAttributes
            }),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    // console.log(result)
                    setShowAdded(true);
                    sleep(4000).then(r => setShowAdded(false));
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    function CookbookSaved() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p className={"center-text"}>{translations["saved_to_bookmarks"]}
                        <br/>
                        <br/>
                        {translations["disappear_shortly"]}
                    </p>
                </div>
            </div>
        );
    }

    function CookbookNotSaved() {
        return (
            <div className="recipe_posted_pop_error">
                <div>

                    <p className={"center-text"}>{translations["already_saved"]}
                        <br/>
                        <br/>
                        {translations["disappear_shortly"]}
                    </p>
                </div>
            </div>
        );
    }

    // function DeletePost() {
    //     return (
    //
    //     );
    // }

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
                sleep(4000).then(r =>navigate("/my-cookbooks"));
            })
            .catch((error) => {
                alert("error!" + error);
            });
    };

    function DeleteSuccess() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p className={"a-t-c-recipe-removed-text"}>This cookbook has been successfully deleted.
                        <br/>
                        <br/>
                        You will be redirected to 'My Cookbooks' shortly.
                    </p>
                </div>
            </div>
        );
    }

    const DeleteButton = (text) => {
        return (
            <img
                src={helpIcon}
                className="delete_recipe_icon_2"
                alt={translations["delete_post_alt"]}
                onClick={() => deletePost(text)}
                draggable="false"
            />
        );
    };

    const handleShowDelete = () => {
        let del = document.getElementById("delete_button");
        setShowDeleteButton22(!showDeleteButton22);
        if (showDeleteButton22 === false) {
            del.innerText = translations["cancel"];
        } else {
            del.innerText = translations["delete_cookbook"];
        }
    };

    function handleEnter (e, item) {
        if (e.keyCode === 13) {
            navigate("/post/"+item.id);
        }
    }

    return (
        <div className={"display-cookbook-container"}>
            <h1 className={"br-margin-bottom"}></h1>
            <div className="display_recipe_button_nav br-margin-bottom">
                <div className="display_recipe_button_nav_item_1">
                    <button
                        className="go_back_button"
                        onClick={() => window.history.back()}
                    >
                        <IoArrowBackCircleSharp/>{translations["back"]}
                    </button>
                </div>
                <div className="display_recipe_button_nav_item">
                </div>
                <div className="display_recipe_button_nav_item_3">
                    {showDeleteButton2 && (
                        <>
                            {/* Edit Recipe Button */}
                            <button
                                className="edit-recipe-button"
                                onClick={() => navigate(`/edit-cookbook/${cookbook.id}`)}
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
                                {translations["edit_cookbook"]}
                            </button>
                            <button
                                id="delete_button"
                                className="delete_recipe_button"
                                onClick={handleShowDelete}
                            >
                                {translations["delete_cookbook"]}
                            </button>
                        </>
                    )}
                    {showDeleteButton22 && <DeleteButton text={cookbook.id}/>}
                </div>
            </div>
            <div className={"add-to-cookbook-image-desc-container"}>
                <div className={"a-t-c-title-container"}>
                    <br/>
                    <div className="a-t-c-title">{cbName}</div>
                    <p className={"a-t-c-desc"}>{cbDesc}</p>
                    <br/>
                    <Tags input={cbTags}/>
                    <div className={"display-cookbook-username-picture-container"}>
                        <div className={"d-cb-u-p-center-container"}>
                            <div onClick={() => navigate("/profile/" + cookbook.authorID)}
                                 className={"d-cb-pfp-container"}>
                                <img className={"profile_picture_recipe"} src={cbPFP || defaultUser} alt={cbAuthor} draggable="false"/>
                            </div>
                            <div className={"d-cb-u-p-spacer"}></div>
                            <div className={"d-cb-u-p-spacer"}></div>
                            <p className={"d-cb-name"}><Link to={"/profile/" + cookbook.authorID}>{"@"+cbAuthor}</Link></p>
                            <p className={"p_spacer"}></p>
                            <p className="display_recipe_likes">{cbSavedBy.length  > 1 || cbSavedBy.length  === 0 ? cbSavedBy.length  + translations["bookmarks_undertext"]: cbSavedBy.length  + translations["bookmark_undertext"]}</p>
                        </div>
                    </div>
                </div>
                <div className={"a-t-c-image-container"}>
                    <img className={"a-t-c-image"} src={cbImage} alt={cbName} draggable="false"/>
                </div>
            </div>
            <br/>
            <div className={"a-t-c-list-container"}>
                {recipes.map((item) => (
                    <div className={"a-t-c-single-recipe-container"} key={item.id} id={checkForName(item)} tabIndex={"0"} onKeyDown={event => handleEnter(event, item)}>
                        <div className={"a-t-c-recipe-image-container"} onClick={() => handleRedirect(item)}>
                            <img className={"a-t-c-recipe-image"} alt={checkForName(item)} src={checkForImage(item)} draggable="false"/>
                        </div>
                        <div className={"a-t-c-text-container"}>
                            <div className={"a-t-c-recipe-title-container"} onClick={() => handleRedirect(item)}>
                                <div className={"a-t-c-recipe-title"}>{checkForName(item)}</div>
                            </div>
                            <div className={"a-t-c-recipe-desc-container"} onClick={() => handleRedirect(item)}>
                                <div className={"a-t-c-recipe-desc"}>{checkForDesc(item)}</div>
                            </div>
                            <div className={"a-t-c-remove-button-container"}>
                                <div className={"a-t-c-remove-button-spacer"}
                                     onClick={() => handleRedirect(item)}></div>
                                {showDeleteButton ? <div className={"a-t-c-remove-recipe-button"} tabIndex={"0"} id={"remove_recipe_from_cookbook_button"} onKeyDown={e => {e.stopPropagation(); handleKeyRemove(e, item);}} onClick={() => removeRecipe(item)}>{translations["remove_from_cookbook"]}</div> : null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showRemoved ? <RemovedFromCookbook/> : null}
            {showAdded ? <CookbookSaved/> : null}
            {showNotAdded ? <CookbookNotSaved/> : null}
            {showDeleteSuccess ? <DeleteSuccess/>:null}
            <button onClick={handleSaveCookbook} className="create_recipe_button">{translations["bookmark"]}</button>
        </div>
    );
};

export default DisplayCookbook;