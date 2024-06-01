import React, { useEffect, useState, useContext } from "react";
import "../../CSS Files/Journey.css"
import {Link, useLocation, useNavigate} from "react-router-dom";
import transparent from "../../assets/image_preview.png";
import helpIcon from "../../assets/delete.png";
import { TranslationContext } from "../../Translations/Translation";

const LikedPosts = () => {
    const userToken = sessionStorage.getItem("token");
    const userID = sessionStorage.getItem("user");
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const translations = useContext(TranslationContext).translations.CookbookPages.SavedCookbooksJourney;

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
        let hiddenPostsLocal = userData.attributes.hiddenPosts;


        let url = process.env.REACT_APP_API_PATH + "/post-reactions?reactorID=" + userID;

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
                    const postArray = result[0].map(obj => obj.post);
                    const visiblePosts = postArray.filter(post => {
                        const notHidden = !hiddenPostsLocal.includes(post.id);
                        const notPrivate = post.attributes.postType === "Public" ||
                            (post.attributes.postType === "Private" && post.authorID.toString() === userID);
                        return notHidden && notPrivate;
                    });
                    setPosts(visiblePosts);
                    setIsLoaded(true);
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

    return (
        <div>
            <div className={"sticky_tabs_nav"} onMouseEnter={handleHover}
                 style={{opacity, transition: 'opacity 0.3s ease', width: "100vw", position: "fixed", zIndex: 2}}>
                <div className="tabs_fyp">
                    <TabButton
                        tabId="fyp"
                        activeTab={"all-recipes"}
                        onClick={e => navigate("/bookmarks")}
                    >
                        {translations["bookmarks"]}
                    </TabButton>
                    <TabButton
                        tabId="all-recipes"
                        activeTab={"all-recipes"}
                        onClick={e => navigate("/likes")}
                    >
                        {translations["liked_posts"]}
                    </TabButton>
                </div>
            </div>
            <div className={"spacer2"}></div>
            <br/>
            {posts.length === 0 && <p style={{textAlign: 'center'}}>{translations["no_recipes_found"]}</p>}
            <div className={"landing_page_recipes_container"}>
                {posts.map((item) => (
                    <div className='single_recipe_container' key={item.id}>
                        <div id={checkForName(item)} className="single_recipe" tabIndex={"0"} onClick={() => navigate('/post/' + item.id)} onKeyDown={event => handleEnter(event, item)}>
                            <div className={"single_recipe_image_container"}>
                                <img className="single_recipe_image" src={checkForImage(item)}
                                     alt={checkForName(item)} draggable="false"></img>
                            </div>
                            <p className="single_recipe_undertext">{checkForName(item)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedPosts;