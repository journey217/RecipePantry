import React, {useEffect, useState, useContext} from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import "../CSS Files/Journey.css";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import siteTitle from "../assets/RP_Header.png";
import menuLines from "../assets/Menu_Lines.png";
import defaultUser from "../assets/default_user.png";
import siteIcon from "../assets/RP_Logo.png";
import { TranslationContext } from "../Translations/Translation";

const Navbar = ({ toggleModal, logout }) => {
    const location = useLocation(); //get the current location
    const [picture, setPicture] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const userID = sessionStorage.getItem("user");
    const userToken = sessionStorage.getItem("token");
    const isRegistrationPage = location.pathname.startsWith('/regist');
    const [isLoginPage, setIsLoginPage] = useState(false);
    const translations = useContext(TranslationContext).translations.Navbar;

    useEffect(() => {

        if (!userID || !userToken) {
            setIsLoginPage(true);
        }

        if (sessionStorage.getItem("user")) {
            fetch(
                `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem(
                    "user"
                )}`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.id) {
                        setShowDropdown(true);
                    }
                    if (result && result.attributes) {
                        setPicture(result.attributes.picture || defaultUser);
                    } else {
                        setPicture(defaultUser);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [location]);

    function handleEnter(e) {
        if (e.keyCode === 13) {
            let dd = document.getElementById("dd");
            let content = dd.querySelector("div");
            content.style.display = "block";
        }
    }

    function UserDropdown() {
        return (
            <div id={"dd"} className="dropdown">
                <button className="user_dropdown_button"><img className="profile_picture_nav" src={picture} alt={translations["user"]}/>
                </button>
                <button onKeyDown={e => handleEnter(e)} className="user_dropdown_button"><img className="profile_picture_nav" src={menuLines} alt={translations["user"]}/></button>
                <div className="dropdown-content">
                    <Link to="/profile" tabIndex={"0"}>{translations["profile"]}</Link>
                    <Link to="/my-recipes" tabIndex={"0"}>{translations["my_posts"]}</Link>
                    <Link to={"/following/recipes"} tabIndex={"0"}>{translations["following_posts"]}</Link>
                    <Link to="/likes" tabIndex={"0"}>{translations["liked_posts"]}</Link>
                    <Link to="/bookmarks" tabIndex={"0"}>{translations["bookmarks"]}</Link>
                    <Link to='/shopping-list' tabIndex={"0"}>{translations["shopping_list"]}</Link>
                    <Link to="/settings" tabIndex={"0"}>{translations["settings"]}</Link>
                    <Link to="/" onClick={logout} tabIndex={"0"}>{translations["logout"]}</Link>
                </div>
            </div>
        );
    }

    function CuisinesDropdown() {
        return (
            <div className="cuisine-dropdown">
                <Link className="nav-button" to="/cuisines?=">Cuisines</Link>
                <div className="dropdown-content">
                    <Link to="/cuisines?=italian">{translations["italian"]}</Link>
                    <Link to="/cuisines?=mexican">{translations["mexican"]}</Link>
                    <Link to="/cuisines?=american">{translations["american"]}</Link>
                    <Link to="/cuisines?=">{translations["search_cuisines"]}</Link>
                </div>
            </div>
        );
    }

    if (isRegistrationPage) {
        return (
            <div className="navBarRegistrationPage">
                <div id="sidenav" className="sidenav">
                    <img src={siteTitle} alt="Recipe Pantry" className="site_title"/>
                </div>
            </div>
        );
    }


    // Only render the navbar content if not on a registration page
    return !isRegistrationPage && !isLoginPage ? (
        <div className="navBars">
            <div id="sidenav" className="sidenav">
                <Link to={"/"}>
                    <img src={siteTitle} alt="Recipe Pantry" className="site_title"/>
                </Link>
                <ul className="navbar_ul">
                    <li className="navbar_li">
                        <Link to="/">
                            <IoHomeOutline color={"black"} size={65}/>
                        </Link>
                        <Link to={"/cuisines?="}>
                            <IoIosSearch color={"black"} size={65}/>
                        </Link>
                    </li>
                </ul>
                {showDropdown ? <UserDropdown/> : null}
            </div>

            <div className="mobile_nav">
                <Link to={"/"}>
                    <img src={siteIcon} alt="Recipe Pantry" className="site_title_mobile"/>
                </Link>
                <ul className="navbar_ul">
                    <li className="navbar_li">
                        <Link to="/">
                            <IoHomeOutline color={"black"} size={60}/>
                        </Link>
                        <Link to={"/cuisines?="}>
                            <IoIosSearch color={"black"} size={60}/>
                        </Link>
                    </li>
                </ul>
                {showDropdown ? <UserDropdown/> : null}
            </div>
        </div>
    ) : null;
};

export default Navbar;