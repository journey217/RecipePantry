import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Journey.css"
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import { TranslationContext } from "../../Translations/Translation";
import {FiList} from "react-icons/fi";

const SavedCookbooks = () => {
    const userToken = sessionStorage.getItem("token");
    const userID = sessionStorage.getItem("user");
    const navigate = useNavigate();
    const [cookbooks, setCookbooks] = useState([]);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const translations = useContext(TranslationContext).translations.CookbookPages.SavedCookbooksJourney;
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

            let query = escape('{"path": "savedBy", "arrayContains":"' + userID + '"}');

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

    const removePost = (input) => {
        let membersList = input.attributes.savedBy;
        let index = input.attributes.savedBy.indexOf(userID);
        if (index > -1) {
            membersList.splice(index, 1);
        } else {
            return
        }
        let postID = input.id
        let tagString = "";
        if (input.attributes.cookbookTagString) {
            tagString = input.attributes.cookbookTagString;
        }

        const newAttributes = input.attributes;

        newAttributes["cb_authorID"] = input.authorID.toString();

        newAttributes["savedBy"] = membersList;

        newAttributes["cookbookTagString"] = tagString;

        fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                authorID: input.authorID.toString(),
                content: "Cookbook",
                attributes: newAttributes
            }),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    loadPosts()
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const DeleteButton = (text) => {
        return (
            <img src={helpIcon} className="delete_recipe_icon" alt={translations["delete_post_alt"]} onClick={() => removePost(text)} draggable="false"/>
        );
    }

    const handleShowDelete = () => {
        setShowDeleteButton(!showDeleteButton);
        let button_text = document.getElementById("delete_button");
        if (showDeleteButton === false) {
            button_text.innerText = translations["finish"];
        } else {
            button_text.innerText = translations["remove_cookbooks"];
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
            removePost(text);
        }
    }

    return (
        <div>
            <div className={"sticky_tabs_nav"} onMouseEnter={handleHover}
                 style={{opacity, transition: 'opacity 0.3s ease', width: "100vw", position: "fixed", zIndex: 2}}>
                <div className="tabs_fyp">
                    <TabButton
                        tabId="fyp"
                        activeTab={"fyp"}
                        onClick={e => navigate("/bookmarks")}
                    >
                        {translations["bookmarks"]}
                    </TabButton>
                    <TabButton
                        tabId="all-recipes"
                        activeTab={"fyp"}
                        onClick={e => navigate("/likes")}
                    >
                        {translations["liked_posts"]}
                    </TabButton>
                </div>
            </div>
            <div className={"spacer2"}></div>
            <div className="delete_button_container">
                <button id="delete_button" className="delete_recipe_button" onClick={handleShowDelete}>{translations["remove_cookbooks"]}
                </button>
            </div>
            <SortingControls sortBy={sortBy} setSortBy={setSortBy} />
            <br/>
            {cookbooks.length === 0 && <p style={{textAlign: 'center'}}>{translations["no_cookbooks_found"]}</p>}
            <div className={"landing_page_recipes_container"}>
                {cookbooks.map((item) => (
                    <div className='single_recipe_container-saved-cb' key={item.id}>
                        <div className="single_recipe-saved-cb"  onClick={() => handleRedirect(item)} id={checkForName(item)} tabIndex={"0"} onKeyDown={e => handleEnter(e, item)}>

                            <div className={"single_recipe_image_container"}>
                                <img className="single_recipe_image" src={checkForImage(item)}
                                     alt={checkForName(item)} draggable="false"></img>
                            </div>

                            <p className="single_recipe_undertext">{checkForName(item)}</p>
                            <p className="single_recipe_undertext">{item.attributes.savedBy.length > 1 || item.attributes.savedBy.length === 0 ? item.attributes.savedBy.length + translations["bookmarks_undertext"] : item.attributes.savedBy.length + translations["bookmark_undertext"]}</p>
                            {showDeleteButton ? <img onKeyDown={e => {e.stopPropagation(); handleKeyDelete(e, item);}} src={helpIcon} tabIndex={"0"} className="delete_recipe_icon" alt="Remove Post Button Confirm" onClick={() => removePost(item)}/>: null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedCookbooks;