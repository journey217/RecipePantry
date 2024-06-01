import React, { useEffect, useState, useContext } from "react";
import PostForm from "./PostForm";
import PostingList from "./PostingList";
import "../../CSS Files/Journey.css";
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png"
import helpIcon from "../../assets/delete.png";
import lockIcon from "../../assets/lock.png";
import { TranslationContext } from "../../Translations/Translation";

const HiddenRecipes = ( appRefresh ) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const userID = sessionStorage.getItem("user");
    const userToken = sessionStorage.getItem("token");
    const [noneFound, setNoneFound] = useState(false);
    const location = useLocation();
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const translations = useContext(TranslationContext).translations.RecipePages;

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        if (!isLoaded) {
            loadPosts();
        }


        // Scroll and resize event code courtesy of ChatGPT
        const handleScroll = () => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

            if (currentScrollTop > lastScrollTop) {
                setOpacity(.4); // Fade out
            } else {
                setOpacity(1); // Fade in
            }

            setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        };


        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [lastScrollTop, location]);

    // END ChatGPT code

    function handleHover() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        setOpacity(1);
    }


    const loadPosts = async () => {
        let url1 = `${process.env.REACT_APP_API_PATH}/users/${userID}`;
        let userResponse = await fetch(url1, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        let userData = await userResponse.json();
        let userAttributes = userData.attributes
        let hiddenPostsLocal = userData.attributes.hiddenPosts;

        if (hiddenPostsLocal.length === 0) {
            setRecipes([]);
            setNoneFound(true);
            return;
        } else {
            setNoneFound(false);
        }

        let i = 0

        let recipeArray = []

        while (i < hiddenPostsLocal.length) {

            let url2 = process.env.REACT_APP_API_PATH + "/posts/" + hiddenPostsLocal[i];

            try {
                let recipeResponse = await fetch(url2, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })

                let recipeData = await recipeResponse.json();
                if (recipeData) {
                    recipeArray.push(recipeData);
                }
            } catch (error) {
                let delIdx = hiddenPostsLocal.indexOf(hiddenPostsLocal[i]);
                let newHidden = hiddenPostsLocal.splice(delIdx, 1);
                userAttributes["hiddenPosts"] = newHidden;

                const bodyData = {
                    attributes: userAttributes
                };

                fetch(url1, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                    body: JSON.stringify(bodyData),
                })
                    .then((res) => res.json())
                    .then(
                        (result) => {
                            // console.log(result);
                        },
                        (error) => {
                            console.log(error)
                        });
            }
            i++;
        }
        setRecipes(recipeArray);
        setIsLoaded(true);
    };

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
            loadPosts();
        } else {
            console.error("Failed to update hidden posts");
        }

    };

    function handleRedirect(item) {
        navigate('/post/' + item.id);
    }


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
                return translations["default_name"]
            }
        } else {
            return translations["default_name"]
        }
    }

    function TabButton({tabId, activeTab, onClick, children}) {
        let isActive = tabId === activeTab;
        return (
            <button
                className={`tab-fyp-btn-${tabId} ${isActive ? 'active' : ''}`}
                onClick={() => onClick(tabId)}
            >
                {children}
            </button>
        );
    }

    function handleEnter (e, item) {
        if (e.keyCode === 13) {
            navigate("/post/"+item.id);
        }
    }

    function handleHideKey (e, item) {
        if (e.keyCode === 13) {
            unhidePost(item.id);
        }
    }

    return (
        <div className="my_recipes">
            <div className={"sticky_tabs_nav"} onMouseEnter={handleHover}
                 style={{opacity, transition: 'opacity 0.3s ease', width: "100vw", position: "fixed", zIndex: 2}}>
                <div className="tabs_fyp">
                    <TabButton
                        tabId="fyp"
                        activeTab={"all-recipes"}
                        onClick={e => navigate("/settings")}
                    >
                        {translations["settings"]}
                    </TabButton>
                    <TabButton
                        tabId="all-recipes"
                        activeTab={"all-recipes"}
                        onClick={e => navigate("/hidden-posts")}
                    >
                        {translations["hidden_posts"]}
                    </TabButton>
                </div>
            </div>
            <div className={"spacer2"}></div>
            <br/>
            <div className="landing_page_recipes_container">
                {noneFound ? <p style={{textAlign: 'center'}}>{translations["No recipes found."]}</p> : null}
                {recipes.map((item) => (
                    <div className='single_recipe_container' key={item.id}>
                        <div id={checkForName(item)} className="single_recipe" tabIndex={"0"} onClick={() => handleRedirect(item)} onKeyDown={event => handleEnter(event, item)}>
                            {item.attributes.postType === "Private" && (
                                <img src={lockIcon} className="private_post_icon" alt={translations["private_post"]} draggable="false"/>
                            )}
                            <div className={"single_recipe_image_container"}>
                                <img className="single_recipe_image" src={checkForImage(item)}
                                     alt={checkForName(item)} draggable="false"></img>
                            </div>
                            <p className="single_recipe_undertext">{checkForName(item)}</p>
                            <p className="single_recipe_undertext">{item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + translations["Likes"] : item.reactions.length + translations["Like"]}</p>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                unhidePost(item.id);
                            }}
                                    onKeyDown={(event) => {event.stopPropagation(); handleHideKey(event, item);}}
                                    className="hide_post_fyp">{translations["unhide"]}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default HiddenRecipes;