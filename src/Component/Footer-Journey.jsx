import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "../CSS Files/Journey.css";
import { TranslationContext } from "../Translations/Translation";
import { RiHome2Line } from "react-icons/ri";
import { PiBooks } from "react-icons/pi";

// pull in the images for the menu items
import postIcon from "../assets/post.svg";
import friendIcon from "../assets/friends.svg";
import settingIcon from "../assets/settings.svg";
import helpIcon from "../assets/help.svg";
import exitIcon from "../assets/exit.png";
import groupIcon from "../assets/group.png";
import homeIcon from "../assets/Home _Icon.png";
import siteTitle from "../assets/RP_Header.png";
import cartIcon from "../assets/shopping_cart.png";
import menuLines from "../assets/Menu_Lines.png";
import defaultUser from "../assets/default_user.png";
import cookbookIcon from "../assets/cookbook.png";
import siteIcon from "../assets/RP_Logo.png";
import styleIcon from "../assets/Styleguide.png";
import userPages from "../assets/user_pages.png";
import LanguageSwitcher from "../Translations/LanguageSwitcher";

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
const Footer = ({}) => {
  console.log(
    "Footer-Journey.jsx | useContext(TranslationContext):",
    useContext(TranslationContext)
  );
  const translations =
    useContext(TranslationContext).translations.FooterJourney;

  return (
    <div className="footer">
      <div className={"footer_resources_container"}>
        <LanguageSwitcher />
        <h4>{translations["resources"]}</h4>
        <ul>
          <li>
            <Link to={"/dev-profiles"}>{translations["dev_pages"]}</Link>
          </li>
          <li>
            <Link to={"/styleguide"}>{translations["style_guide"]}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
