import React, { useEffect, useState, useContext } from "react";
import PostForm from "./RecipePostPages/PostForm";
import PostingList from "./RecipePostPages/PostingList";
import "../CSS Files/Journey.css"
import {Link} from "react-router-dom";
import { TranslationContext } from "../Translations/Translation";

const UserBios = () => {
  const translations = useContext(TranslationContext).translations.UserBiosJourney;

  return (
    <div>
      <h3 className="page_title">{translations["dev_pages"]}</h3>
        <center>
            <a href={"https://webdev.cse.buffalo.edu/hci/teams/uimax/journey-profile.html"}>{translations["journey_profile"]}</a>
            <br/>
            <a href={"https://webdev.cse.buffalo.edu/hci/teams/uimax/aboutme-jessica.html"}>{translations["jessica_profile"]}</a>
            <br/>
            <a href={"https://webdev.cse.buffalo.edu/hci/teams/uimax/aboutme-tiffany.html"}>{translations["tiffany_profile"]}</a>
            <br/>
            <a href={"https://webdev.cse.buffalo.edu/hci/teams/uimax/sheba-profile.html"}>{translations["sheba_profile"]}</a>
            <br/>
            <a href={"https://webdev.cse.buffalo.edu/hci/teams/uimax/personalpage-andrew.html"}>{translations["andrew_profile"]}</a>
        </center>
    </div>
  );
};

export default UserBios;