import React, { useState, useEffect, useContext } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png"
import search from "../../assets/search-icon.png"
import * as events from "events";
import {CiGrid2H, CiGrid41} from "react-icons/ci";
import { TranslationContext } from "../../Translations/Translation";
import {FiList} from "react-icons/fi";


const SearchByIngredients = () => {

    const [recipes, setRecipes] = useState([]);
    const userToken = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const userID = sessionStorage.getItem("user");
    const location = useLocation();
    const [ing1, setIng1] = useState('');
    const [ing2, setIng2] = useState('');
    const [ing3, setIng3] = useState('');
    const [ing4, setIng4] = useState('');
    const [ing5, setIng5] = useState('');
    const [noneFound, setNoneFound] = useState(false);
    const [showError, setShowError] = useState(false);
    const [resultCount, setResultCount] = useState(20);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [gridView, setGridView] = useState(true);
    const [listView, setListView] = useState(false);
    const translations = useContext(TranslationContext).translations.Cuisines.SearchByIngredientsJourney;
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
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

    function ErrorPopUp({text}) {
        return (
            <div>
                <p className="ing_error_div">{text}</p>
            </div>
        );
    }

    const loadPosts = async (e, take, sort) => {
        e.preventDefault();

        let toQuery = [];

        if (ing1.replace(/\s/g, '') !== '') {
            toQuery.push(ing1.replace(/\s/g, ''));
        }

        if (ing2.replace(/\s/g, '') !== '') {
            toQuery.push(ing2.replace(/\s/g, ''));
        }

        if (ing3.replace(/\s/g, '') !== '') {
            toQuery.push(ing3.replace(/\s/g, ''));
        }

        if (ing4.replace(/\s/g, '') !== '') {
            toQuery.push(ing4.replace(/\s/g, ''));
        }

        if (ing5.replace(/\s/g, '') !== '') {
            toQuery.push(ing5.replace(/\s/g, ''));
        }

        if (toQuery.length === 0) {
            setShowError(true);
            return
        } else {
            setShowError(false);
        }

        let url10 = `${process.env.REACT_APP_API_PATH}/users/${userID}`;

        let userResponse = await fetch(url10, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        let userData = await userResponse.json();
        let hiddenPostsLocal = userData.attributes.hiddenPosts;

        let i = 0;

        let ing_query = process.env.REACT_APP_API_PATH + "/posts?attributes=";

        while (i < (toQuery).length) {

            if (i > 0) {
                ing_query = ing_query.concat("&attributes=");
            }

            let query = escape('{"path": "recipeIngredients", "stringContains": "' + toQuery[i] + '"}');

            ing_query = ing_query.concat(query);

            i++;
        }

        ing_query = ing_query.concat("&take=" + take);


        fetch(ing_query, {
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

                    if (visiblePosts.length === 0) {
                        setNoneFound(true);
                    } else {
                        setNoneFound(false);
                    }

                    if (visiblePosts.length < result[0].length) {
                        setShowLoadMore(true);
                    } else {
                        setShowLoadMore(false);
                    }

                    if (result[0].length < take) {
                        setShowLoadMore(false);
                    }

                    // Sort based on the sorting selection
                    if (sort === "popular") {
                        visiblePosts.sort((a, b) => (b.reactions?.length ?? 0) - (a.reactions?.length ?? 0));
                    }

                    setRecipes(visiblePosts);
                }
            })
            .catch((err) => {
                console.log("ERROR loading posts", err);
            });
    };

    function checkForImage(item) {
        if (item.attributes.pictureURL && item.attributes.pictureURL !== "https://webdev.cse.buffalo.eduundefined") {
            return item.attributes.pictureURL;
        } else {
            return transparent
        }
    }

    function checkForName(item) {
        if (item.attributes) {
            if (item.attributes.recipeName) {
                if ((item.attributes.recipeName).length > 16) {
                    return item.attributes.recipeName.slice(0, 15) + "..."
                }
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
                className={`tab-fyp2-btn-${tabId} ${isActive ? 'active' : ''}`}
                onClick={() => onClick(tabId)}
            >
                {children}
            </button>
        );
    }

    function handleLoadMore(e) {
        setResultCount(resultCount + 20);
        loadPosts(e, resultCount + 20, sortBy);
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
                return translations["no_desc"]
            }
        } else {
            return translations["no_desc"]
        }
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
            let hiddenPostsLocal = userData.attributes.hiddenPosts;

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
                    let newRecipes = recipes.filter(post => {
                        return post.id !== postId
                    })
                    setRecipes(newRecipes);
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

    function handleRedirect(item) {
        navigate('/post/' + item.id);
    }

    function SortingControls({sortBy, setSortBy}) {
        const [showDropdown, setShowDropdown] = useState(false);

        const handleSortChange = (newSort) => {
            setSortBy(newSort);
            setShowDropdown(false);
        };

        return (
            <div className="sorting-controls-ing" style={{position: 'relative'}}>
                <div className="dropdown-button" onClick={() => setShowDropdown(!showDropdown)}>
                    <FiList/>
                </div>
                {showDropdown && (
                    <div className="dropdown-menu">
                        <button className={sortBy === "popular" ? "active" : ""}
                                onClick={() => handleSortChange("popular")}>{translations["popular"]}
                        </button>
                        <button className={sortBy === "newest" ? "active" : ""}
                                onClick={() => handleSortChange("newest")}>{translations["newest"]}
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
                <div className="tabs_fyp2">
                    <TabButton
                        tabId="fyp"
                        activeTab={"fyp"}
                        onClick={e => navigate("/ingredient-search")}
                    >
                        {translations["ingredients"]}
                    </TabButton>
                    <TabButton
                        tabId="all-recipes"
                        activeTab={"fyp"}
                        onClick={e => navigate("/cuisines?=")}
                    >
                        {translations["recipes"]}
                    </TabButton>
                    <TabButton
                        tabId="cookbooks"
                        activeTab={"fyp"}
                        onClick={e => navigate("/search-cookbooks?=")}
                    >
                        {translations["cookbooks"]}
                    </TabButton>
                </div>
            </div>
            <div className={"spacer2"}></div>
            <div className={"center_div"}>
                {showError ? <ErrorPopUp text={translations["ingredient_num_error"]}/> : null}
            </div>
            <div className={"search_views_container"}>
                <SortingControls sortBy={sortBy} setSortBy={setSortBy}/>
                <div className={"ing_search_container"}>
                    <form onSubmit={e => loadPosts(e, resultCount, sortBy)}>
                        <div className={"textInputContainer"}>
                            <input maxLength={20} type="text" className={"ing_search_input"} placeholder={translations["ingredient_placeholder1"]}
                                   onChange={e => setIng1(e.target.value)}/>
                            <input maxLength={20} type="text" className={"ing_search_input"} placeholder={translations["ingredient_placeholder2"]}
                                   onChange={e => setIng2(e.target.value)}/>
                            <input maxLength={20} type="text" className={"ing_search_input"} placeholder={translations["ingredient_placeholder3"]}
                                   onChange={e => setIng3(e.target.value)}/>
                            <input maxLength={20} type="text" className={"ing_search_input"} placeholder={translations["ingredient_placeholder4"]}
                                   onChange={e => setIng4(e.target.value)}/>
                            <input maxLength={20} type="text" className={"ing_search_input"} placeholder={translations["ingredient_placeholder5"]}
                                   onChange={e => setIng5(e.target.value)}/>
                        </div>
                        <div className={"sub_button_cont"}>
                            <button className={"submit center_button"} type={"submit"}>{translations["search"]}</button>
                        </div>
                    </form>
                </div>
                <div className={"toggle_view_container"}>
                        <div id={"grid_icon"} className={"icon_container icon_toggle"}>
                            <CiGrid41 onKeyDown={e => handleKeyViews(e, "grid_icon")} id={"recipe_grid_view_button"} tabIndex={"0"} className={"select_icon"} onClick={e => toggleView("grid_icon")} size={40}/>
                        </div>
                        <div id={"list_icon"} className={"icon_container"}>
                            <CiGrid2H onKeyDown={e => handleKeyViews(e, "list_icon")} id={"recipe_list_view_button"} tabIndex={"0"} className={"select_icon"} onClick={e => toggleView("list_icon")} size={40}/>
                        </div>
                    </div>
            </div>
            {noneFound ? <p style={{textAlign: 'center'}}>{translations["no_recipes_found"]}</p> : null}

            {gridView ?
                <div className="landing_page_recipes_container">
                    {recipes.map((item) => (
                        <div className='single_recipe_container'>
                            <div className="single_recipe" id={checkForName(item)} tabIndex={"0"} onClick={() => navigate('/post/' + item.id)} onKeyDown={e => handleEnter(e, item)}>
                                <div className={"single_recipe_image_container"}>
                                    <img className="single_recipe_image" src={checkForImage(item)}
                                         alt={checkForName(item)} draggable="false"></img>
                                </div>
                                <p className="single_recipe_undertext">{checkForName(item)}</p>
                                <p className="single_recipe_undertext">{item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + " Likes" : item.reactions.length + " Like"}</p>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    hidePost(item.id);
                                }}
                                        onKeyDown={(event) => {event.stopPropagation(); handleHideKey(event, item);}}
                                        className="hide_post_fyp">{translations["hide_post"]}
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
                                         onClick={() => handleRedirect(item)}>{item.reactions.length > 1 || item.reactions.length === 0 ? item.reactions.length + translations["likes"] : item.reactions.length + translations["like"]}</div>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        hidePost(item.id);
                                    }}
                                            onKeyDown={(event) => {event.stopPropagation(); handleHideKey(event, item);}}
                                            className="hide_post_fyp">{translations["hide_post"]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> : null}
            <div className={"center_div"}>
                {showLoadMore ?
                    <button className="load_more_button" onClick={e => handleLoadMore(e)}>{translations["load_more"]}</button> : null}
            </div>
            <Link to={"/post-recipe"}>
                <button className="create_recipe_button">{translations["post_recipe"]}</button>
            </Link>
        </div>
    );
};

export default SearchByIngredients;