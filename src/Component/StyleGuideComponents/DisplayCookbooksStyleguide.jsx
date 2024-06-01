import React from 'react';
import "../../CSS Files/Andrew.css";
import exampleCB from "../../assets/StyleguideAndrew/cookbookExample.JPG";
import exampleRecipe from "../../assets/StyleguideAndrew/recipeExample.JPG";
import mark from "../../assets/StyleguideAndrew/errBtn.JPG";
import err from "../../assets/StyleguideAndrew/errMsg.JPG"

const DisplayCookbooksStyleGuide = () => {
    return (
        <div>
            <h2>Cookbooks Display Page:</h2>
            <h3>Example cookbook:</h3>
            <center><img src={exampleCB} alt="Example Cookbook" style={{width: "80%", height: "80%"}}></img></center>
            <h3>Recipe section of this cookbook:</h3>
            <center><img src={exampleRecipe} alt="Example Recipe" style={{width: "80%", height: "80%"}}></img></center>
            <h3>Bookmarks feature:</h3>
            <center><img src={mark} alt="Bookmark" ></img></center>
            <h3>Error checking:</h3>
            <center><img src={err} alt="Bookmark Error" ></img></center>
            <h3>Cookbook Display CSS:</h3>
            <div className={"code_box_container"}>
                <pre>
                    <code className={"css_code_box"}>
                        {
                            ".cookbook-item-container {\n" +
                            "  cursor: pointer;\n" +
                            "  outline: 2px solid #333333;\n" +
                            "  width: 220px;\n" +
                            "  height: 330px;\n" +
                            "  margin-bottom: 20px;\n" +
                            "}\n" +
                            "\n" +
                            ".cookbook-image {\n" +
                            "  padding: 10px;\n" +
                            "  width: 200px;\n" +
                            "  height: 200px;\n" +
                            "}\n" +
                            "\n" +
                            ".cookbook-undertext {\n" +
                            "  padding-left: 10px;\n" +
                            "  font-size: 20px;\n" +
                            "  line-height: 27px;\n" +
                            "  text-align: left;\n" +
                            "  margin: 0;\n" + 
                            "}"
                        }
                    </code>
                </pre>
            </div>
        </div>
    );
}

export default DisplayCookbooksStyleGuide;