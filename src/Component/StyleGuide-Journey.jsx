import React, { useEffect, useState } from "react";
import "../CSS Files/Journey.css"
import LoginRegistrationStyleGuide from "./Login-Registration-StyleGuide";
import FeedSearchStyleguide from "./StyleGuideComponents/FeedSearchStyleguide";
import DisplayRecipeStyleguide from "./StyleGuideComponents/DisplayRecipeStyleguide";
import TiffanyStyleguide from "./Tiffany-Styleguide";
import DisplayCookbooksStyleGuide from "./StyleGuideComponents/DisplayCookbooksStyleguide";
import ShoppingListStyleguide from "./StyleGuideComponents/ShoppingListStyleguide";
import ProfileSettingsStyleGuide from "./StyleGuideComponents/ProfileSettingsStyleGuide"

const StyleGuide = () => {
    const [showDisplayRecipe, setShowDisplayRecipe] = useState(false);
    const [showFeedSearch, setShowFeedSearch] = useState(false);
    const [showLoginRegist, setShowLoginRegis] = useState(false);
    const [showGenStyles, setShowGenStyles] = useState(false);
    const [showDisplayCookbook, setShowDisplayCookbook] = useState(false);
    const [showShopping,setShowShopping] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

  return (
    <div>
      <h1 className="page_title">Style Guide for Recipe Pantry</h1>
        <p className={"page_title"}>Click a button to display style guide</p>
        <br/>
            <div className={"style_guide_container"}>
                <div className="style_guide_component">
                    <button className={"display_ingred_steps_dropdown"} onClick={e => setShowGenStyles(!showGenStyles)}>General Styles</button>
                    {showGenStyles ? <TiffanyStyleguide/>:null}
                </div>
                <div className="style_guide_component">
                    <button className={"display_ingred_steps_dropdown"} onClick={e => setShowDisplayRecipe(!showDisplayRecipe)}>Display Recipe Page</button>
                    {showDisplayRecipe ? <DisplayRecipeStyleguide/>:null}
                </div>
                 <div className="style_guide_component">
                    <button className={"display_ingred_steps_dropdown"} onClick={e => setShowDisplayCookbook(!showDisplayCookbook)}>Display Cookbook Page</button>
                    {showDisplayCookbook ? <DisplayCookbooksStyleGuide/>:null}
                </div>
                <div className="style_guide_component">
                    <button className={"display_ingred_steps_dropdown"} onClick={e => setShowFeedSearch(!showFeedSearch)}>Feed and Search Pages</button>
                    {showFeedSearch ? <FeedSearchStyleguide/>:null}
                </div>
                <div className="style_guide_component">
                    <button className={"display_ingred_steps_dropdown"} onClick={e => setShowShopping(!showShopping)}>Shopping List Page</button>
                    {showShopping ? <ShoppingListStyleguide/>:null}
                </div>
                <div className="style_guide_component">
                    <button className={"display_ingred_steps_dropdown"} onClick={e => setShowProfile(!showProfile)}>Profile and Settings Pages</button>
                    {showProfile ? <ProfileSettingsStyleGuide/>:null}
                </div>
                <div className="style_guide_component">
                    <button className={"display_ingred_steps_dropdown"} onClick={e => setShowLoginRegis(!showLoginRegist)}>Login and Registration Pages</button>
                    {showLoginRegist ?<LoginRegistrationStyleGuide/>:null}
                </div>
            </div>
    </div>
  );
};

export default StyleGuide;