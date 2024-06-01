import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Journey.css";
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png"
import helpIcon from "../../assets/delete.png";
import lockIcon from "../../assets/lock.png";
import { FiList } from "react-icons/fi";
import { TranslationContext } from "../../Translations/Translation";

const MyRecipes = ( appRefresh ) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const userID = sessionStorage.getItem("user");
    const userToken = sessionStorage.getItem("token");
    const [noneFound, setNoneFound] = useState(false);
    const location = useLocation();
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const translations = useContext(TranslationContext).translations.RecipePages;
    const [buttonText, setButtonText] = useState(translations["delete_recipes"])

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
    }, [lastScrollTop, location, sortBy]);

    // END ChatGPT code

    function handleHover() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        setOpacity(1);
    }


    const loadPosts = () => {
        // if the user is not logged in, we don't want to try loading posts, because it will just error out.
        if (sessionStorage.getItem("token") && sessionStorage.getItem('user')) {

            const query = escape('{"path": "recipe_authorID", "equals":"' + userID + '"}')

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
                    if (result) {

                        if (result[0].length === 0) {
                            setNoneFound(true);
                        } else {
                            setNoneFound(false)
                        }

                        let visiblePosts = result[0];

                        // Sort based on the sorting selection
                        if (sortBy === "popular") {
                            visiblePosts.sort((a, b) => (b.reactions?.length ?? 0) - (a.reactions?.length ?? 0));
                        }

                        setRecipes(visiblePosts);
                        setIsLoaded(true);
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
            <img onKeyDown={e => {e.stopPropagation(); handleKeyDelete(e, text);}} src={helpIcon} tabIndex={"0"} className="delete_recipe_icon" alt={translations["delete_post_button_confirm"]} onClick={() => deletePost(text)}/>
        );
    }

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
            navigate('/post/' + item.id);
        }
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

    function SortingControls({sortBy, setSortBy}) {
        const [showDropdown, setShowDropdown] = useState(false);

        const handleSortChange = (newSort) => {
            setSortBy(newSort);
            setShowDropdown(false);
            setIsLoaded(false);
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

    return (
        <div className="my_recipes">
            <div className={"sticky_tabs_nav"} onMouseEnter={handleHover}
                 style={{opacity, transition: 'opacity 0.3s ease', width: "100vw", position: "fixed", zIndex: 2}}>
                <div className="tabs_fyp">
                    <TabButton
                        tabId="fyp"
                        activeTab={"fyp"}
                        onClick={e => navigate("/my-recipes")}
                    >
                        {translations["my_recipes"]}
                    </TabButton>
                    <TabButton
                        tabId="all-recipes"
                        activeTab={"fyp"}
                        onClick={e => navigate("/my-cookbooks")}
                    >
                        {translations["my_cookbooks"]}
                    </TabButton>
                </div>
            </div>
            <div className={"spacer2"}></div>
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
            <br/>
            <div className="landing_page_recipes_container">
                {noneFound ? <p style={{textAlign: 'center'}}>{translations["no_recipes_yet"]}</p> : null}
                {recipes.map((item) => (
                    <div className='single_recipe_container' key={item.id}>
                        <div id={checkForName(item)} className="single_recipe" tabIndex={"0"} onClick={() => handleRedirect(item)} onKeyDown={event => handleEnter(event, item)}>
                            {item.attributes.postType === "Private" && (
                                <img src={lockIcon} className="private_post_icon" alt={translations["private_post"]}/>
                            )}
                            <div className={"single_recipe_image_container"}>
                                <img className="single_recipe_image" src={checkForImage(item)}
                                     alt={checkForName(item)}></img>
                            </div>
                            <p className="single_recipe_undertext">{checkForName(item)}</p>
                            <p className="single_recipe_undertext">{item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + translations["Likes"] : item.reactions.length + translations["Like"]}</p>
                            {showDeleteButton ? <img onKeyDown={e => {e.stopPropagation(); handleKeyDelete(e, item.id);}} src={helpIcon} tabIndex={"0"} className="delete_recipe_icon" alt={translations["delete_post_button_confirm"]} onClick={e => {e.stopPropagation(); deletePost(item.id)}}/>: null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default MyRecipes;