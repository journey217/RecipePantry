import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Journey.css"
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import { TranslationContext } from "../../Translations/Translation";
import { FiList } from "react-icons/fi";

const MyCookbooks = () => {
    const userToken = sessionStorage.getItem("token");
    const userID = sessionStorage.getItem("user");
    const navigate = useNavigate();
    const [cookbooks, setCookbooks] = useState([]);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [noneFound, setNoneFound] = useState(false);
    const translations = useContext(TranslationContext).translations.CookbookPages.MyCookbooksJourney;
    const location = useLocation();
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [buttonText, setButtonText] = useState(translations["delete_cookbooks"]);

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
        if (sessionStorage.getItem("token") && sessionStorage.getItem('user')) {

            let query = escape('{"path": "cb_authorID", "equals":"' + userID + '"}');

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

                        if (result[0].length === 0) {
                            setNoneFound(true);
                        } else {
                            setNoneFound(false)
                        }
                        let visiblePosts = result[0];

                        if (sortBy === "popular") {
                            visiblePosts.sort((a, b) => (b.attributes.savedBy?.length ?? 0) - (a.attributes.savedBy?.length ?? 0));
                        }

                        setCookbooks(visiblePosts);
                        setIsLoaded(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

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

    const deletePost = (input) => {
        // let postID = input.text;
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

    const handleShowDelete = () => {
        let delBut = document.getElementById("delete-button");
        setShowDeleteButton(!showDeleteButton);
        if (showDeleteButton === false) {
            delBut.innerText = (translations["finish"]);
        } else {
            delBut.innerText = (translations["delete_cookbooks"]);
        }
    }

    function handleRedirect(item) {
        if (!showDeleteButton) {
            navigate('/post/cookbook/' + item.id);
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

    function handleKeyDelete (e, text) {
        if (e.keyCode === 13) {
            deletePost(text);
        }
    }

    return (
        <div className="my_cookbooks">
            <div className={"sticky_tabs_nav"} onMouseEnter={handleHover}
                 style={{opacity, transition: 'opacity 0.3s ease', width: "100vw", position: "fixed", zIndex: 2}}>
                <div className="tabs_fyp">
                    <TabButton
                        tabId="fyp"
                        activeTab={"all-recipes"}
                        onClick={e => navigate("/my-recipes")}
                    >
                        {translations["my_recipes"]}
                    </TabButton>
                    <TabButton
                        tabId="all-recipes"
                        activeTab={"all-recipes"}
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
                        {translations["delete_cookbooks"]}
                    </button>
                </div>
                <div className="post-button-wrapper">
                    <Link to={"/create-a-cookbook"}>
                        <button className="create-recipe-button">{translations["create_cookbook"]}</button>
                    </Link>
                </div>
            </div>
            <SortingControls sortBy={sortBy} setSortBy={setSortBy}/>
            <br/>
            <div className={"landing_page_recipes_container"}>
                {noneFound ? <p style={{textAlign: 'center'}}>{translations["no_cookbooks_yet"]}</p> : null}
                {cookbooks.map((item) => (
                    <div className='single_recipe_container' key={item.id} onClick={() => handleRedirect(item)}>
                        <div className="single_recipe" id={checkForName(item)} tabIndex={"0"} onClick={() => navigate('/post/cookbook/' + item.id)} onKeyDown={e => handleEnter(e, item)}>
                            <div className={"single_recipe_image_container"}>
                                <img className="single_recipe_image" src={checkForImage(item)}
                                     alt={checkForName(item)}></img>
                            </div>
                            <p className="single_recipe_undertext">{checkForName(item)}</p>
                            <p className="single_recipe_undertext">{item.attributes.savedBy.length > 1 || item.attributes.savedBy.length === 0 ? item.attributes.savedBy.length + translations["bookmarks"] : item.attributes.savedBy.length + translations["bookmark"]}</p>
                            {showDeleteButton ? <img onKeyDown={e => {e.stopPropagation(); handleKeyDelete(e, item.id);}} src={helpIcon} tabIndex={"0"} className="delete_recipe_icon" alt={translations["delete_post_button_confirm"]} onClick={e => {e.stopPropagation(); deletePost(item.id)}}/>: null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCookbooks;