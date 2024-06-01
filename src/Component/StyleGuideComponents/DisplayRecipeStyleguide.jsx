import React from 'react';
import defaultImage from "../../assets/image_preview.png"
import {LuPrinter as Printer} from "react-icons/lu";
import defaultUser from "../../assets/default_user.png";
import {Link} from "react-router-dom";
import fullHeart from "../../assets/full_heart.png";
import emptyHeart from "../../assets/heart.png";
import commentSectionExample from "../../assets/comment-section-example.png"

const DisplayRecipeStyleguide = () => {

    function Tags2({input}) {
        for (let i = 0; i < input.length; i++) {
            input[i] = input[i].replace(/\s/g, '');
            if (input[i] === "") {
                input.splice(i, 1);
            }
        }
        if (input.length !== null && input.length > 0) {
            for (let i = 0; i < input.length; i++) {
                input[i] = input[i].replace(" ", "");
            }
            return (
                <div className="a-t-c-tags-container">
                    {input.map((item, index) => (
                        <div id={item} tabIndex={"0"} key={index} className="a-t-c-single-tag-container">#{item}
                        </div>
                    ))}
                </div>
            );
        }
    }

    function LikeButton({bool}) {
        if (bool === true) {
            return (
                <img className={"like_image"} src={fullHeart} alt={"Like Button"} draggable="false"/>
            );
        } else {
            return (
                <img className={"like_image"} src={emptyHeart} alt={"Like Button"} draggable="false"/>
            );
        }
    }

    return (
        <div>
            <h2>Recipe Display Page:</h2>
            <h3>Recipe Information:</h3>
            <p>
                <h4>Recipe General Information Example:</h4>
                <div className={"add-to-cookbook-image-desc-container"}>
                    <div className={"a-t-c-title-container"}>
                        <br/>
                        <div className="a-t-c-title">Example Recipe<Printer className="print-button"/></div>
                        <p className={"a-t-c-desc"}>Example Recipe Description</p>
                        <br/>
                        <Tags2 input={["Example", "Recipe", "Tags"]}/>
                        <div className="display_recipe_poster_likes_container">
                            <div className="display_recipe_poster_likes_item">
                                <div className={"display-cookbook-username-picture-container"}>
                                    <div className={"d-cb-u-p-center-container"}>
                                        <div className={"d-cb-pfp-container"}>
                                            <img className={"profile_picture_recipe"} src={defaultUser}
                                                 alt={"author name"}
                                                 draggable="false"/>
                                        </div>
                                        <div className={"d-cb-u-p-spacer"}></div>
                                        <p><Link to={"/styleguide"}>{"@ExampleUsername"}</Link></p>
                                    </div>
                                </div>
                            </div>
                            <div className="display_recipe_poster_likes_item">
                                <div className="display_recipe_like_img_count">
                                    <button className="display_recipe_like_button">
                                        <LikeButton bool={false}/>
                                    </button>
                                    <p className="display_recipe_likes">34 Likes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"display-recipe-image-container2"}>
                        <img className={"display_recipe_image2"} style={{width: "400px"}} src={defaultImage}
                             alt={"default recipe image"} draggable="false"/>
                    </div>
                </div>
                <h4>CSS for Recipe General Information:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".add-to-cookbook-image-desc-container {\n" +
                        "    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n" +
                        "    border-style: ridge;\n" +
                        "    border-width: 1px;\n" +
                        "    border-color: black;\n" +
                        "    border-radius: 5px;\n" +
                        "    background-color: white;\n" +
                        "    display: flex;\n" +
                        "    flex-direction: row;\n" +
                        "    flex-wrap: wrap;\n" +
                        "    margin: auto;\n" +
                        "    text-align: center;\n" +
                        "    width: 80%;\n" +
                        "    max-width: 1450px;\n" +
                        "    height: fit-content;\n" +
                        "    padding: 10px;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-image-container {\n" +
                        "    margin: auto;\n" +
                        "    width: 450px;\n" +
                        "    height: 450px;\n" +
                        "    position: relative;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-image {\n" +
                        "    top: 0; bottom: 0; left: 0; right: 0;\n" +
                        "    margin: auto;\n" +
                        "    position: absolute;\n" +
                        "    max-height: 450px;\n" +
                        "    max-width: 450px;\n" +
                        "    height: fit-content;\n" +
                        "    width: fit-content;\n" +
                        "    object-fit: cover; /* covers the box and crops */\n" +
                        "    object-position: center;\n" +
                        "    border-radius: 20px;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-title-container {\n" +
                        "    word-break: break-word;\n" +
                        "    width: 50%;\n" +
                        "    height: 100%;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-title {\n" +
                        "    font-weight: bold;\n" +
                        "    padding-top: 10px;\n" +
                        "    margin: auto;\n" +
                        "    width: 50%;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-desc {\n" +
                        "    overflow-wrap: break-word;\n" +
                        "    height: fit-content;\n" +
                        "    min-height: 200px;\n" +
                        "    padding-top: 10px;\n" +
                        "    margin: auto;\n" +
                        "    max-width: 80%;\n" +
                        "  }\n\n" +
                        ".a-t-c-tags-container {\n" +
                        "    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n" +
                        "    border-style: ridge;\n" +
                        "    border-width: 1px;\n" +
                        "    border-color: black;\n" +
                        "    border-radius: 5px;\n" +
                        "    background-color: papayawhip;\n" +
                        "    width: 60%;\n" +
                        "    margin: auto;\n" +
                        "    overflow: auto;\n" +
                        "    white-space: nowrap;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-single-tag-container {\n" +
                        "    display: inline-block;\n" +
                        "    text-align: center;\n" +
                        "    padding: 5px;\n" +
                        "    margin: 4px;\n" +
                        "    text-decoration: none;\n" +
                        "    background-color: #4f9bff;\n" +
                        "    color: white;\n" +
                        "    border-radius: 10px;\n" +
                        "  }\n" +
                        "\n" +
                        "  .a-t-c-single-tag-container:hover {\n" +
                        "    cursor: pointer;\n" +
                        "    background-color: #555;\n" +
                        "    color: white;\n" +
                        "  }"
                    }</code>
                        </pre>
                </div>
            </p>
            <h3>Recipe Ingredients and Steps:</h3>
            <p>
                <h4>Recipe Ingredients Example:</h4>
                <div className="display_list_container br-margin-bottom">
                    <h4 className={"list_title"}>Ingredients</h4>
                    {["Example", "Recipe", "Ingredients", "List"].map((ingredient, index) => (
                        <p className="display_ingredients" key={index}>
                        <span className="ingredient-and-button">
                            <span>{"• " + ingredient} </span>
                            <button id={index} className={"add_to_shopping_list_button"}>
                                Add to Shopping List
                            </button>
                        </span>
                        </p>
                    ))}
                </div>
                <h4>Recipe Steps Example:</h4>
                <div className="display_list_container br-margin-bottom">
                <h4 className={"list_title"}>Preparation Steps</h4>
                {["Example", "Recipe", "Steps", "List"].map((step, index) => (
                    <p className="display_steps" key={index}>
                        {index + 1 + ". " + step}
                    </p>
                ))}
            </div>
                <h4>CSS Code for Recipe Ingredients and Recipe Steps:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".display_list_container {\n" +
                        "    margin-inline: auto;\n" +
                        "    padding-top: 10px;\n" +
                        "    padding-bottom: 10px;\n" +
                        "    padding-left: 10px;\n" +
                        "    text-align: left;\n" +
                        "    background-color: white;\n" +
                        "    width: 80%;\n" +
                        "    border-width: thin;\n" +
                        "    border-style: ridge;\n" +
                        "    border-color: black;\n" +
                        "    border-radius: 10px;\n" +
                        "  }"
                    }</code>
                        </pre>
                </div>
            </p>
            <h3>Recipe Comments:</h3>
            <p>
                <h4>Recipe Comment Section Example:</h4>
                <img src={commentSectionExample} style={{width: "70vw"}} alt={"Comment section example image"}/>
                <h4>CSS Code for Recipe Comment Section:</h4>
                <div className={"code_box_container"}>
                    <pre>
                    <code className={"css_code_box"}>{
                        ".comments-container {\n" +
                        "  padding: 1rem;\n" +
                        "}\n" +
                        "\n" +
                        ".no-comments-msg {\n" +
                        "  text-align: center;\n" +
                        "  font-size: 1.125rem;\n" +
                        "}\n" +
                        "\n" +
                        ".comments-wrapper {\n" +
                        "  max-height: 20rem;\n" +
                        "  overflow-y: auto;\n" +
                        "}\n" +
                        "\n" +
                        ".comments-wrapper ul{\n" +
                        "  margin: 0;\n" +
                        "  padding: 0;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-wrapper + .comment-wrapper {\n" +
                        "  padding-top: 1rem;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-text-wrapper {\n" +
                        "  font-size: 1rem;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-user-pfp {\n" +
                        "  padding-right: 0.5rem;\n" +
                        "  display: inline-flex;\n" +
                        "}\n" +
                        "\n" +
                        ".user-pfp {\n" +
                        "  height: 2rem;\n" +
                        "  width: 2rem;\n" +
                        "  border-radius: 100%;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-username {\n" +
                        "  margin-top: 10px;\n" +
                        "  font-size: 0.9rem;\n" +
                        "  font-weight: 600;\n" +
                        "}\n" +
                        "\n" +
                        ".new-comment {\n" +
                        "  padding-top: 1rem;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-input-wrapper {\n" +
                        "  position: relative;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-input-box {\n" +
                        "  padding: 0.7rem 0rem 0.7rem 0.5rem;\n" +
                        "  margin: 0;\n" +
                        "  width: calc(100% - 0.5rem);\n" +
                        "  border: 1px solid black;\n" +
                        "  border-radius: 1rem;\n" +
                        "  outline: none;\n" +
                        "}\n" +
                        "\n" +
                        ".submit-icon {\n" +
                        "  position: absolute;\n" +
                        "  float: right;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-submit-btn {\n" +
                        "  margin: auto;\n" +
                        "  height: 80%;\n" +
                        "  width: 2rem;\n" +
                        "  border: 1px solid;\n" +
                        "  border-radius: 100%;\n" +
                        "  position: absolute;\n" +
                        "  right: 0.2rem;\n" +
                        "  top: 0;\n" +
                        "  bottom: 0;\n" +
                        "  z-index: 1;\n" +
                        "}\n" +
                        "\n" +
                        ".submit-icon {\n" +
                        "  top: 57%;\n" +
                        "  right: 0.45rem;\n" +
                        "  transform: translateY(-50%);\n" +
                        "  z-index: 2;\n" +
                        "  margin: auto;\n" +
                        "  pointer-events: none;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-submit-btn:enabled {\n" +
                        "  background-color: #CF6E4F;\n" +
                        "  border-color: black;\n" +
                        "  color: white;\n" +
                        "  cursor: pointer;\n" +
                        "}\n" +
                        "\n" +
                        ".comment-submit-btn:disabled {\n" +
                        "  display: none;\n" +
                        "}"
                    }</code>
                        </pre>
                </div>
            </p>
        </div>
    );
};

export default DisplayRecipeStyleguide;