import React from 'react';
import defaultImage from "../../assets/image_preview.png"
import search from "../../assets/search-icon.png";
import {CiGrid2H, CiGrid41} from "react-icons/ci";
import {FiList} from "react-icons/fi";

const FeedSearchStyleguide = () => {
    return (
        <div>
            <h2>Post Feeds:</h2>
            <h3>Post Cards:</h3>
            <p>
                <h4>Post Card in Grid View Example:</h4>
                <div className="single_recipe_container">
                    <div className="single_recipe" id={"example_recipe"} tabIndex={"0"}>
                        <div className={"single_recipe_image_container"}>
                            <img className="single_recipe_image" src={defaultImage} alt={"example recipe image"}/>
                        </div>
                        <p className="single_recipe_undertext">Example Recipe</p>
                        <p className="single_recipe_undertext">34 Likes</p>
                        <button className="hide_post_fyp">Hide Post</button>
                    </div>
                </div>
                <h4>CSS code for Post Card in Grid View:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".single_recipe {\n" +
                        "   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n" +
                        "   cursor: pointer;\n" +
                        "   outline: 1px solid #333333;\n" +
                        "   border-radius: 10px;\n" +
                        "   width: 220px;\n" +
                        "   height: fit-content;\n" +
                        "   margin-bottom: 20px;\n" +
                        "   margin-inline: 10px;\n" +
                        "   background-color: white;\n" +
                        "   padding-bottom: 10px;\n" +
                        "   transition: background-color 0.3s ease;\n" +
                        "}\n\n" +
                        ".single_recipe:hover {\n" +
                        "   background-color: #555;\n" +
                        "   color: white;\n" +
                        "}\n\n" +
                        ".single_recipe_image_container {\n" +
                        "    padding: 10px;\n" +
                        "    margin: auto;\n" +
                        "    position: relative;\n" +
                        "    width: 200px;\n" +
                        "    height: 200px;\n" +
                        "  }\n" +
                        "\n" +
                        "  .single_recipe_image {\n" +
                        "    position: absolute;\n" +
                        "    top: 0; bottom: 0; right: 0; left: 0;\n" +
                        "    margin: auto;\n" +
                        "    width: fit-content;\n" +
                        "    height: fit-content;\n" +
                        "    max-width: 200px;\n" +
                        "    max-height: 200px;\n" +
                        "    object-position: center;\n" +
                        "    object-fit: cover;\n" +
                        "    border-radius: 5px;\n" +
                        "  }\n" +
                        "\n" +
                        "  .single_recipe_undertext {\n" +
                        "    overflow-wrap: break-word;\n" +
                        "    padding-left: 10px;\n" +
                        "    font-size: 20px;\n" +
                        "    line-height: 27px;\n" +
                        "    text-align: left;\n" +
                        "    margin: 0;\n" +
                        "    padding-right: 3px;\n" +
                        "  }"
                    }</code>
                        </pre>
                </div>
                <h4>Post Card in List View Example:</h4>
                <div className={"a-t-c-single-recipe-container"} id={"example_recipe"} tabIndex={"0"}>
                    <div className={"a-t-c-recipe-image-container"}>
                        <img className={"a-t-c-recipe-image"} alt={"example recipe image"} src={defaultImage}/>
                    </div>
                    <div className={"a-t-c-text-container"}>
                        <div className={"a-t-c-recipe-title-container"}>
                            <div className={"a-t-c-recipe-title"}>Example Cookbook</div>
                        </div>
                        <div className={"a-t-c-recipe-desc-container"}>
                            <div className={"a-t-c-recipe-desc"}>Example Cookbook Description.</div>
                        </div>
                        <div className={"a-t-c-hide-button-container"}>
                            <div className={"a-t-c-hide-button-spacer"}>34 Bookmarks</div>
                        </div>
                    </div>
                </div>
                <h4>CSS code for Post Card in List View:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".a-t-c-single-recipe-container {\n" +
                        "    margin-inline: auto;\n" +
                        "    margin-bottom: 20px;\n" +
                        "    cursor: pointer;\n" +
                        "    background-color: #ffffff;\n" +
                        "    width: 98%;\n" +
                        "    max-width: 1450px;\n" +
                        "    height: 200px;\n" +
                        "    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n" +
                        "    border-style: ridge;\n" +
                        "    border-width: 1px;\n" +
                        "    border-color: black;\n" +
                        "    border-radius: 5px;\n" +
                        "    padding: 10px;\n" +
                        "    display: flex;\n" +
                        "    flex-direction: row;\n" +
                        "    flex-wrap: wrap;\n" +
                        "    transition: background-color 0.3s ease;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-single-recipe-container:hover {\n" +
                        "    background-color: #e5e5e5;\n" +
                        "  }\n\n" +
                        ".a-t-c-recipe-image-container {\n" +
                        "    margin: auto;\n" +
                        "    position: relative;\n" +
                        "    width: 200px;\n" +
                        "    height: 200px;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-recipe-image {\n" +
                        "    position: absolute;\n" +
                        "    top: 0; bottom: 0; right: 0; left: 0;\n" +
                        "    margin: auto;\n" +
                        "    width: fit-content;\n" +
                        "    height: fit-content;\n" +
                        "    max-width: 200px;\n" +
                        "    max-height: 200px;\n" +
                        "    object-position: center;\n" +
                        "    object-fit: cover;\n" +
                        "    border-radius: 5px;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-text-container {\n" +
                        "    margin-left: 15px;\n" +
                        "    text-align: left;\n" +
                        "    width: 75%;\n" +
                        "    height: 80%;\n" +
                        "    padding: 10px;\n" +
                        "    line-height: 25px;\n" +
                        "    font-family: Roboto,sans-serif;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-recipe-title-container {\n" +
                        "    width: 100%;\n" +
                        "    display: flex;\n" +
                        "    flex-direction: row;\n" +
                        "    flex-wrap: wrap;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-recipe-title {\n" +
                        "    font-weight: bold;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-recipe-desc-container {\n" +
                        "    width: 100%;\n" +
                        "    word-break: break-word;\n" +
                        "    height: 75%;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-recipe-desc {\n" +
                        "    font-size: 20px;\n" +
                        "  }"
                    }</code>
                        </pre>
                </div>
            </p>
            <h3>Search Bar and View Buttons:</h3>
            <p>
                <h4>Recipe/Cookbook Search Bar Example:</h4>
                <form className="search-bar">
                    <input className="search-input" type="text" placeholder="Search for a recipe..."/>
                    <img src={search} alt="Search" className="search-icon"/>
                </form>
                <h4>CSS code for Recipe/Cookbook Search Bar:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".search-bar {\n" +
                        "    display: flex;\n" +
                        "    justify-content: center;\n" +
                        "    margin-bottom: 2rem;\n" +
                        "}\n" +
                        "\n" +
                        ".search-input {\n" +
                        "    padding-left: .5rem;\n" +
                        "    font: inherit;\n" +
                        "    height: 2rem;\n" +
                        "    width: 70vw;\n" +
                        "    border: 1px solid black;\n" +
                        "    border-radius: 20px;\n" +
                        "    background-color: hsla(0, 0%, 0%, 0);\n" +
                        "    margin: .25rem 0;\n" +
                        "    background-color: white;\n" +
                        "}\n" +
                        "\n" +
                        ".search-input:hover {\n" +
                        "    outline: 1px solid black;\n" +
                        "}\n" +
                        "\n" +
                        ".search-input:focus {\n" +
                        "    background-color: white;\n" +
                        "}\n" +
                        "\n" +
                        ".search-icon{\n" +
                        "    height: 2rem;\n" +
                        "    width: auto;\n" +
                        "    margin-top: .3rem;\n" +
                        "    margin-left: -2.5rem;\n" +
                        "}"
                    }</code>
                        </pre>
                </div>
                <h4>Ingredient Search Component Example:</h4>
                <div className={"ing_search_container"}>
                    <form>
                        <div className={"textInputContainer"}>
                            <input maxLength={20} type="text" className={"ing_search_input"}
                                   placeholder={"ex. Tomato"}/>
                            <input maxLength={20} type="text" className={"ing_search_input"} placeholder={"ex. Bacon"}/>
                            <input maxLength={20} type="text" className={"ing_search_input"}
                                   placeholder={"ex. Lettuce"}/>
                            <input maxLength={20} type="text" className={"ing_search_input"} placeholder={"ex. Bread"}/>
                            <input maxLength={20} type="text" className={"ing_search_input"}
                                   placeholder={"ex. Cheese"}/>
                        </div>
                        <div className={"sub_button_cont"}>
                            <button className={"submit center_button"} type={"submit"}>Search</button>
                        </div>
                    </form>
                </div>
                <h4>CSS Code for Ingredient Search Component:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".textInputContainer {\n" +
                        "  text-align: center;\n" +
                        "  width: 70vw;\n" +
                        "  padding-bottom: 15px;\n" +
                        "  padding-top: 15px;\n" +
                        "  background-color: #eaa861;\n" +
                        "  border-radius: 25px;\n" +
                        "  display: flex;\n" +
                        "  flex-wrap: wrap;\n" +
                        "  flex-direction: row;\n" +
                        "  margin-bottom: 20px;\n" +
                        "  margin-inline: 5px;\n" +
                        "}\n" +
                        "\n" +
                        ".ing_search_input {\n" +
                        "  margin-inline: auto;\n" +
                        "  padding-left: .5rem;\n" +
                        "  font-size: medium;\n" +
                        "  height: 2rem;\n" +
                        "  border: 1px solid black;\n" +
                        "  border-radius: 20px;\n" +
                        "  background-color: hsla(0, 0%, 0%, 0);\n" +
                        "  background-color: white;\n" +
                        "  margin-bottom: 5px;\n" +
                        "}\n" +
                        "\n" +
                        ".sub_button_cont {\n" +
                        "  text-align: center;\n" +
                        "}\n" +
                        "\n" +
                        ".ing_search_container {\n" +
                        "  width: 70vw;\n" +
                        "  margin-inline: auto;\n" +
                        "  margin-bottom: 20px;\n" +
                        "}"
                    }</code>
                        </pre>
                </div>
                <h4>Switch View buttons Example:</h4>
                <div className={"toggle_view_container"}>
                    <div id={"grid_icon"} className={"icon_container icon_toggle"}>
                        <CiGrid41 id={"recipe_grid_view_button"} tabIndex={"0"} className={"select_icon"} size={40}/>
                    </div>
                    <div id={"list_icon"} className={"icon_container"}>
                        <CiGrid2H id={"recipe_list_view_button"} tabIndex={"0"} className={"select_icon"} size={40}/>
                    </div>
                </div>
                <h4>CSS code for Switch View buttons:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".toggle_view_container {\n" +
                        "  display: flex;\n" +
                        "  flex-direction: row;\n" +
                        "  background-color: white;\n" +
                        "  width: fit-content;\n" +
                        "  height: 42px;\n" +
                        "  border-width: 1px;\n" +
                        "  border-style: ridge;\n" +
                        "  border-color: black;\n" +
                        "  border-radius: 10px;\n" +
                        "  cursor: pointer;\n" +
                        "}\n" +
                        "\n" +
                        ".icon_container {\n" +
                        "  padding: 2px;\n" +
                        "  border-radius: 10px;\n" +
                        "  width: available;\n" +
                        "}\n" +
                        "\n" +
                        ".icon_container:hover {\n" +
                        "  transition: background-color 0.3s ease;\n" +
                        "  background-color: #a8a8a8;\n" +
                        "}\n" +
                        "\n" +
                        ".icon_toggle {\n" +
                        "  background-color: #a8a8a8;\n" +
                        "}"
                    }</code>
                        </pre>
                </div>
                <h4>Sorting Dropdown Button Example:</h4>
                <div className="sorting-controls" style={{position: 'relative'}}>
                    <div className="dropdown-button">
                        <FiList/>
                    </div>
                    <br/>
                    <br/>
                    <div className="dropdown-menu">
                        <button className={""}>Popular</button>
                        <button className={"active"}>Newest</button>
                    </div>
                </div>
                <br/>
                <br/>
                <h4>CSS Code for Sorting Dropdown Button</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".sorting-controls {\n" +
                        "    display: flex;\n" +
                        "    justify-content: center;\n" +
                        "    margin-top: 10px;\n" +
                        "    margin-bottom: 10px;\n" +
                        "    position: relative;\n" +
                        "}\n" +
                        "\n" +
                        ".sorting-controls .dropdown-button {\n" +
                        "    display: flex;\n" +
                        "    align-items: center;\n" +
                        "    cursor: pointer;\n" +
                        "    font-size: 30px;\n" +
                        "    border: none;\n" +
                        "    background: none;\n" +
                        "    color: #333;\n" +
                        "    margin-top: -0.8cm;\n" +
                        "    margin-left: -0.5cm;\n" +
                        "}\n" +
                        ".sorting-controls .dropdown-menu {\n" +
                        "    position: absolute;\n" +
                        "    top: calc(100% - 10px);\n" +
                        "    left: 50%;\n" +
                        "    transform: translateX(-50%) translateY(-10px);;\n" +
                        "    background-color: white;\n" +
                        "    border: 1px solid #ccc;\n" +
                        "    box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n" +
                        "    z-index: 10;\n" +
                        "    width: 15vw;\n" +
                        "    display: block;\n" +
                        "    overflow: hidden;\n" +
                        "    padding-right: 15px;\n" +
                        "}\n" +
                        "\n" +
                        ".sorting-controls .dropdown-menu button {\n" +
                        "    display: block;\n" +
                        "    width: calc(100% + 15px);\n" +
                        "    padding: 8px 5px;\n" +
                        "    text-align: center;\n" +
                        "    border: none;\n" +
                        "    background: none;\n" +
                        "    color: black;\n" +
                        "    cursor: pointer;\n" +
                        "    box-sizing: border-box;\n" +
                        "    border-radius: 0;\n" +
                        "}\n" +
                        "\n" +
                        ".sorting-controls button.active,\n" +
                        ".sorting-controls button:hover {\n" +
                        "    background-color: #87CEFA;\n" +
                        "    color: black;\n" +
                        "}"
                    }</code>
                        </pre>
                </div>
            </p>
        </div>
    );
};

export default FeedSearchStyleguide;