import React, {useEffect, useState, useContext} from "react";
import "../../CSS Files/Journey.css"
import {Link, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import search from "../../assets/search-icon.png";
import {CiGrid2H, CiGrid41} from "react-icons/ci";
import {FiList} from "react-icons/fi";
import { TranslationContext } from "../../Translations/Translation";

const Cookbooks = ( appRefresh ) => {

    const [cookbooks, setCookbooks] = useState([]);
    const userToken = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const userID = sessionStorage.getItem("user");
    const [searchValue, setSearchValue] = useState("");
    const [resultCount, setResultCount] = useState(20);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [gridView, setGridView] = useState(true);
    const [listView, setListView] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const translations = useContext(TranslationContext).translations.CookbookPages.CookbooksJourney;

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
    }, [lastScrollTop, sortBy, resultCount]);

    // END ChatGPT code

    function handleHover() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        setOpacity(1);
    }

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        loadPosts(resultCount)
    }, [userToken, navigate, userID]);


    const loadPosts = (take) => {
        if (sessionStorage.getItem("token") && sessionStorage.getItem('user')) {
            let url = process.env.REACT_APP_API_PATH + "/posts?content=Cookbook&take=" + take;

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
                        setIsLoaded(true);

                        if (result[0].length < take) {
                            setShowLoadMore(false);
                        } else {
                            setShowLoadMore(true);
                        }

                        let visiblePosts = result[0];

                        if (sortBy === "popular") {
                            visiblePosts.sort((a, b) => (b.attributes.savedBy?.length ?? 0) - (a.attributes.savedBy?.length ?? 0));
                        }

                        setCookbooks(visiblePosts);
                    }
                })
                .catch((err) => {
                    setIsLoaded(true);
                    console.log("ERROR loading posts", err);
                });
        }
    };

    function checkForImage(item) {
        if (item.attributes.cbImageURL && item.attributes.cbImageURL !== "https://webdev.cse.buffalo.eduundefined") {
            return item.attributes.cbImageURL;
        } else {
            return transparent
        }
    }

    function checkForName(item) {
        if (item.attributes) {
            if (item.attributes.cbName) {
                if ((item.attributes.cbName).length > 16) {
                    return item.attributes.cbName.slice(0, 10) + "..."
                }
                return item.attributes.cbName;
            } else {
                return translations["default_name"]
            }
        } else {
            return translations["default_name"]
        }
    }

    function handleSearch(event) {
        event.preventDefault();
        setSearchValue(event.target.value)
        navigate('/search-cookbooks?=' + searchValue);
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
            if (item.attributes.cbDesc) {
                return item.attributes.cbDesc;
            } else {
                return translations["no_desc"]
            }
        } else {
            return translations["no_desc"]
        }
    }

    function handleRedirect(item) {
        navigate('/post/cookbook/' + item.id);
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
            navigate("/post/cookbook/"+item.id);
        }
    }

    function handleKeyViews (e, id) {
        if (e.keyCode === 13) {
            toggleView(id);
        }
    }

    return (
        <div className="my_recipes">
            <div className={"sticky_tabs_nav"} onMouseEnter={handleHover}
                 style={{opacity, transition: 'opacity 0.3s ease', width: "100vw", position: "fixed", zIndex: 2}}>

                <div className="tabs_fyp2">
                    <TabButton
                        tabId="fyp"
                        activeTab={"cookbooks"}
                        onClick={e => navigate("/fyp")}
                    >
                        {translations["for_you"]}
                    </TabButton>
                    <TabButton
                        tabId="all-recipes"
                        activeTab={"cookbooks"}
                        onClick={e => navigate("/")}
                    >
                        {translations["home"]}
                    </TabButton>
                    <TabButton
                        tabId="cookbooks"
                        activeTab={"cookbooks"}
                        onClick={e => navigate("/cookbooks")}
                    >
                        {translations["cookbooks"]}
                    </TabButton>
                </div>
            </div>
            <div className={"search_views_container"}>
                <div className={"spacer2"}></div>
                <SortingControls sortBy={sortBy} setSortBy={setSortBy} />
                <form className="search-bar" onSubmit={(event) => handleSearch(event)}>
                    <input
                        className="search-input"
                        type="text"
                        placeholder={translations["search_cookbook_placeholder"]}
                        onChange={(event) => setSearchValue(event.target.value.replace(/\s/g, ""))}
                    />
                    <img onClick={(event) => handleSearch(event)} src={search} alt={translations["search_alt"]}
                         className="search-icon" draggable="false"/>
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
            {gridView ?
                <div className="landing_page_recipes_container">
                    {cookbooks.map((item) => (
                        <div className='single_recipe_container' key={item.id}>
                            <div className="single_recipe" id={checkForName(item)} tabIndex={"0"} onClick={() => navigate('/post/cookbook/' + item.id)} onKeyDown={e => handleEnter(e, item)}>
                                <div className={"single_recipe_image_container"}>
                                    <img className="single_recipe_image" src={checkForImage(item)}
                                         alt={item.attributes.cbName} draggable="false"></img>
                                </div>
                                <p className="single_recipe_undertext">{checkForName(item)}</p>
                                <p className="single_recipe_undertext_author">{item.attributes.savedBy.length > 1 || item.attributes.savedBy.length === 0 ? item.attributes.savedBy.length + translations["bookmarks"]: item.attributes.savedBy.length + translations["bookmark"]}</p>
                            </div>
                        </div>
                    ))}
                </div> : null}
            {listView ?
                <div className={"a-t-c-list-container"}>
                    {cookbooks.map((item) => (
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
                                    <div className={"a-t-c-hide-button-spacer"} onClick={() => handleRedirect(item)}>
                                        {item.attributes.savedBy.length > 1 || item.attributes.savedBy.length === 0 ? item.attributes.savedBy.length + translations["bookmarks"]: item.attributes.savedBy.length + translations["bookmark"]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> : null}
            <div className={"center_div"}>
                {showLoadMore ? <button className="load_more_button" onClick={handleLoadMore}>{translations["load_more"]}</button> : null}
            </div>
            <Link to={"/create-a-cookbook"}>
                <button className="create_recipe_button">{translations["create_cookbook"]}</button>
            </Link>
        </div>
    );
};


export default Cookbooks;