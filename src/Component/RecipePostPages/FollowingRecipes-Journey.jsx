import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Journey.css"
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png"
import "../../CSS Files/Sheba.css"
import defaultPfp from "../../assets/default_user.png";
import search from "../../assets/search-icon.png";
import lockIcon from "../../assets/lock.png";
import { CiGrid2H } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import {FiList} from "react-icons/fi";
import { TranslationContext } from "../../Translations/Translation";


const FollowingRecipes = ( appRefresh ) => {
    const translations = useContext(TranslationContext).translations.RecipePages;
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
    const userID = sessionStorage.getItem("user");
    const userToken = sessionStorage.getItem("token");
    const [searchValue, setSearchValue] = useState("");
    const [resultCount, setResultCount] = useState(20);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [gridView, setGridView] = useState(true);
    const [listView, setListView] = useState(false);
    const location = useLocation();
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        if (!isLoaded) {
            loadPosts(resultCount);
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
    }, [lastScrollTop, location, sortBy, resultCount]);

    // END ChatGPT code

    function handleHover() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        setOpacity(1);
    }

    const loadPosts = async (take) => {
        let url = `${process.env.REACT_APP_API_PATH}/users/${userID}`;
        try {
            let userResponse = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });

            let userData = await userResponse.json();

            let friendData = await fetch(
                process.env.REACT_APP_API_PATH + "/connections?fromUserID=" + userID,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                });

            let friendResult = await friendData.json();

            let followerIDs = friendResult[0].map(post => post.toUserID);


        if ((followerIDs).length === 0) {
            setRecipes([]);
            setIsLoaded(true);
            return;
        }

            let hiddenPostsLocal = []

            hiddenPostsLocal = userData.attributes.hiddenPosts;

            let i = 0;

            let ing_query = process.env.REACT_APP_API_PATH + "/posts?content=Recipe&take=20&sort=newest";

            while (i < (followerIDs).length) {
                ing_query = ing_query.concat("&authorIDIn=");
                ing_query = ing_query.concat(followerIDs[i]);
                i++;
            }

            let postsResponse = await fetch(ing_query, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            });
            let postsResult = await postsResponse.json();

            if (postsResult) {

                const visiblePosts = postsResult[0].filter(post => {
                    const notHidden = !hiddenPostsLocal.includes(post.id);
                    const notPrivate = post.attributes.postType === "Public" ||
                        (post.attributes.postType === "Private" && post.authorID.toString() === userID);
                    return notHidden && notPrivate;
                });

                if (visiblePosts.length < postsResult[0].length) {
                    setShowLoadMore(true);
                } else {
                    setShowLoadMore(false);
                }

                if (postsResult[0].length < take) {
                    setShowLoadMore(false);
                }

                // Sort based on the sorting selection
                        if (sortBy === "popular") {
                            visiblePosts.sort((a, b) => (b.reactions?.length ?? 0) - (a.reactions?.length ?? 0));
                        }

                setRecipes(visiblePosts);
                setIsLoaded(true);
            }
        } catch (error) {
            console.error("ERROR loading posts", error);
        }
    };

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
                    loadPosts(resultCount);
                } else {
                    console.error("Failed to update hidden posts");
                }
            } else {
                console.log("Post already hidden");
            }
        } catch (error) {
            console.error("Error updating hidden posts:", error);
        }
    };

    function checkForImage(item) {
        if (item.attributes.pictureURL && item.attributes.pictureURL !== "https://webdev.cse.buffalo.eduundefined") {
            return item.attributes.pictureURL;
        } else {
            return transparent;
        }
    }

    function handleSearch(event) {
        event.preventDefault();
        setSearchValue(event.target.value)
        navigate('/cuisines?=' + searchValue);
    }

    function checkForName(item) {
        if (item.attributes) {
            if (item.attributes.recipeName) {
                if ((item.attributes.recipeName).length > 16) {
                    return item.attributes.recipeName.slice(0, 15) + "..."
                }
                return item.attributes.recipeName;
            } else {
                return translations["DefaultName"]
            }
        } else {
            return translations["DefaultName"]
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

    function handleLoadMore() {
        setResultCount(resultCount + 20);
        loadPosts(resultCount + 20);
    }

    function toggleView(id) {
        let rem = "";
        let add = "";
        if (id === "grid_icon") {
            add = "grid_icon";
            rem = "list_icon"
            setGridView(true);
            setListView(false);
        } else {
            rem = "grid_icon";
            add = "list_icon";
            setGridView(false);
            setListView(true);
        }

        let rmClas = document.getElementById(rem);
        let adClas = document.getElementById(add);

        rmClas.classList.remove("icon_toggle");
        adClas.classList.add("icon_toggle");
    }

    function checkForDesc(item) {
        if (item.attributes) {
            if (item.attributes.recipeDescription) {
                return item.attributes.recipeDescription;
            } else {
                return translations["No Description."]
            }
        } else {
            return translations["No Description."]
        }
    }

    function handleRedirect(item) {
        navigate('/post/' + item.id);
    }

    function SortingControls({sortBy, setSortBy}) {
        const [showDropdown, setShowDropdown] = useState(false);

        const handleSortChange = (newSort) => {
            setSortBy(newSort);
            setShowDropdown(false);
            setIsLoaded(false);
        };

        return (
            <div className="sorting-controls" style={{position: 'relative'}}>
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

    function handleKeyViews (e, id) {
        if (e.keyCode === 13) {
            toggleView(id);
        }
    }

    function handleHideKey (e, item) {
        if (e.keyCode === 13) {
            hidePost(item.id);
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
                    onClick={e => navigate("/following/recipes")}
                >
                    {translations["Following Recipes"]}
                </TabButton>
                <TabButton
                    tabId="all-recipes"
                    activeTab={"fyp"}
                    onClick={e => navigate("/following/cookbooks")}
                >
                    {translations["Following Cookbooks"]}
                </TabButton>
            </div>
            </div>
            <div className={"spacer2"}></div>
            <div className={"search_views_container"}>
                <SortingControls sortBy={sortBy} setSortBy={setSortBy}/>
                <form className="search-bar" onSubmit={(event) => handleSearch(event)}>
                    <input
                        className="search-input"
                        type="text"
                        placeholder={translations["search-placeholder"]}
                        onChange={(event) => setSearchValue(event.target.value.replace(/\s/g, ""))}
                    />
                    <img onClick={(event) => handleSearch(event)} src={search} alt="Search" className="search-icon" draggable="false"/>
                </form>
                <div className={"toggle_view_container"}>
                        <div id={"grid_icon"} className={"icon_container icon_toggle"}>
                            <CiGrid41 onKeyDown={e => handleKeyViews(e, "grid_icon")} id={"recipe_grid_view_button"} tabIndex={"0"} className={"select_icon"} onClick={e => toggleView("grid_icon")} size={40}/>
                        </div>
                        <div id={"list_icon"} className={"icon_container"}>
                            <CiGrid2H onKeyDown={e => handleKeyViews(e, "list_icon")} id={"recipe_list_view_button"} tabIndex={"0"} className={"select_icon"} onClick={e => toggleView("list_icon")} size={40}/>
                        </div>
                    </div>
            </div>
            {recipes.length === 0 && <p style={{textAlign: 'center'}}>{translations["No recipes found."]}</p>}
            {gridView ?
                <div className="landing_page_recipes_container">
                    {recipes.map((item, index) => (
                        <div className='single_recipe_container' key={index}>
                            <div className="single_recipe" id={checkForName(item)} tabIndex={"0"} onClick={() => navigate('/post/' + item.id)} onKeyDown={e => handleEnter(e, item)}>
                                <div className={"single_recipe_image_container"}>
                                    <img className="single_recipe_image" src={checkForImage(item)}
                                         alt={checkForName(item)} draggable="false"/>
                                    {item.attributes.postType === "Private" && (
                                        <img src={lockIcon} alt="Private" className="private_post_icon" draggable="false"/>
                                    )}
                                </div>
                                <p className="single_recipe_undertext">{checkForName(item)}</p>
                                <p className="single_recipe_undertext">{item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + translations["Likes"] : item.reactions.length + translations["Like"]}</p>
                                <p className="single_recipe_undertext">{"By: " + item.author.attributes.username}</p>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    hidePost(item.id);
                                }}
                                        onKeyDown={(event) => {event.stopPropagation(); handleHideKey(event, item);}}
                                        className="hide_post_fyp">{translations["Hide Post"]}
                                </button>
                            </div>
                        </div>
                    ))}
                </div> : null}
            {listView ?
                <div className={"a-t-c-list-container"}>
                    {recipes.map((item) => (
                        <div className={"a-t-c-single-recipe-container"} key={item.id} id={checkForName(item)} tabIndex={"0"} onKeyDown={event => handleEnter(event, item)}>
                            <div className={"a-t-c-recipe-image-container"} onClick={() => handleRedirect(item)}>
                                <img className={"a-t-c-recipe-image"} alt={checkForName(item)}
                                     src={checkForImage(item)} draggable="false"/>
                            </div>
                            <div className={"a-t-c-text-container"}>
                                <div className={"a-t-c-recipe-title-container"} onClick={() => handleRedirect(item)}>
                                    <div className={"a-t-c-recipe-title"}>{checkForName(item)}</div>
                                </div>
                                <div className={"a-t-c-recipe-desc-container"} onClick={() => handleRedirect(item)}>
                                    <div className={"a-t-c-recipe-desc"}>{checkForDesc(item)}</div>
                                </div>
                                <div className={"a-t-c-hide-button-container"}>
                                    <div className={"a-t-c-hide-button-spacer"}
                                         onClick={() => handleRedirect(item)}>{"By: " + item.author.attributes.username}
                                    </div>
                                    <div className={"a-t-c-hide-button-spacer"}
                                         onClick={() => handleRedirect(item)}>{item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + translations["Likes"] : item.reactions.length + translations["Like"]}
                                    </div>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        hidePost(item.id);
                                    }}
                                            onKeyDown={(event) => {event.stopPropagation(); handleHideKey(event, item);}}
                                            className="hide_post_fyp">{translations["Hide Post"]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> : null}
            <div className={"center_div"}>
                {showLoadMore ? <button className="load_more_button" onClick={handleLoadMore}>{translations["Load More"]}</button> : null}
            </div>
            <Link to={"/post-recipe"}>
                <button className="create_recipe_button">{translations["Post a Recipe"]}</button>
            </Link>
        </div>
    );
};

export default FollowingRecipes;