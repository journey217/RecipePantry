// src/AddRecipe.js
import React, { useState, useEffect, useContext } from 'react';
import "../../CSS Files/Journey.css"
import {Link, useNavigate} from "react-router-dom";
import { TranslationContext } from '../../Translations/Translation';

const AddRecipe = ({ onAdd, toggleConversions }) => {
    const translations = useContext(TranslationContext).translations.RecipeForm;
    const prefTrans = useContext(TranslationContext).translations.ProfilePages.ShowProfileJessica;
    const navigate = useNavigate();
    const [newIngredients, setNewIngredients] = useState('');
    const [newSteps, setNewSteps] = useState('');
    const [newName, setNewName] = useState('');
    const [newTags, setNewTags] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newFilename, setNewFilename] = useState('');
    const [showPosted, setShowPosted] = useState(false);
    const [file, setFile] = useState();
    const [showNameError, setShowNameError] = useState(false);
    const [showIngredientError, setShowIngredientError] = useState(false);
    const [showStepsError, setShowStepsError] = useState(false);
    const [showImageError, setShowImageError] = useState(false);
    const [showSizeError, setShowSizeError] = useState(false);
    const [showDescriptionError, setShowDescriptionError] = useState(false);
    const [fileSize, setFileSize] = useState(0);
    const [picture, setPicture] = useState("");
    const userID = sessionStorage.getItem("user");
    const userToken = sessionStorage.getItem("token");
    const [cuisines, setCuisines] = useState([]);
    const [diet, setDiet] = useState([]);
    const [otherCuisine, setOtherCuisine] = useState("");
    const [otherDiet, setOtherDiet] = useState("");
    const [cuisineError, setCuisineError] = useState(false);
    const [dietError, setDietError] = useState(false);
    const [taggedName, setTaggedName] = useState("");
    const [postType, setPostType] = useState("Public");
    const minWidth = 200;
    const minHeight = 200;
    const [dimError, setDimError] = useState(false);


    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
    }, [userToken, navigate, userID]);

    function handleChange(event) {
        event.preventDefault();

        setFileSize(event.target.files[0].size);

        setNewFilename(event.target.value)
        setFile(URL.createObjectURL(event.target.files[0]));

        // event.target.files[0] holds the file object that the user is uploading
        const file = event.target.files[0];

        // FormData objects are used to capture HTML form and submit it using fetch or another network method.
        // provides a way to construct a set of key/value pairs representing form fields and their values
        // we can use this formData to send the attributes for the file-uploads endpoint
        const formData = new FormData();

        formData.append("uploaderID", sessionStorage.getItem("user")); // the id of the user who is uploading the file
        formData.append("attributes", JSON.stringify({})); // attributes holds an empty object, can put whatever you want here
        formData.append("file", file); // the file itself

        // make api call to file-uploads endpoint to post the profile picture
        fetch(process.env.REACT_APP_API_PATH + "/file-uploads", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: formData, // send the formdata to the backend
        })
            .then((res) => res.json())
            .then((result) => {
                // pictureURL holds the url of where the picture is stored to show on the page
                let pictureURL = "https://webdev.cse.buffalo.edu" + result.path;
                setPicture(pictureURL);
            });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function ErrorPopUp({text}) {
        return (
            <div>
                <p className="errorText">{text}</p>
            </div>
        );
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "");
    }

    const submitHandler = (event) => {
        event.preventDefault();

        let errorCount = 0;

        if (newName === '') {
            setShowNameError(true);
            errorCount++;
        } else {
            setShowNameError(false);
        }

        if (newDescription === '') {
            setShowDescriptionError(true);
            errorCount++;
        } else {
            setShowDescriptionError(false);
        }

        if (newIngredients === '') {
            setShowIngredientError(true);
            errorCount++;
        } else {
            setShowIngredientError(false);
        }

        if (newSteps === '') {
            setShowStepsError(true);
            errorCount++;
        } else {
            setShowStepsError(false);
        }

        if (newFilename === '') {
            setShowImageError(true);
            errorCount++;
        } else {
            setShowImageError(false);
        }

        if (fileSize > 3e6) {
            setShowSizeError(true);
            errorCount++
        } else {
            setShowSizeError(false);
        }

        if (cuisines.length < 1 && otherCuisine === "") {
            setCuisineError(true);
            errorCount++
        } else {
            setCuisineError(false)
        }

        if (diet.length < 1 && otherDiet === "") {
            setDietError(true)
            errorCount++;
        } else {
            setDietError(false);
        }

        let img = document.getElementById("user_input_image");

        if (img.naturalWidth < minWidth || img.naturalHeight < minHeight) {
            setDimError(true);
            errorCount++;
        } else {
            setDimError(false);
        }

        if (errorCount !== 0) {
            window.scrollTo(0, 0);
            return
        }

        let taggedName2 = escapeHtml(taggedName.replace(/\s/g, ""))

        let tagArray = []

        if (newTags !== "") {
            let split_tags = newTags.split(",");
            let split_tags_stripped = split_tags.map((s_tag) =>
                escapeHtml(s_tag.replace(/\s/g, ''))
            );
            tagArray = split_tags_stripped;
        }

        if (cuisines) {
            tagArray = tagArray.concat(cuisines);
        }

        if (diet) {
            tagArray = tagArray.concat(diet);
        }

        let otherList = [];

        if (otherCuisine !== "") {
            otherList.push(otherCuisine.replace(/\s/g, ''));
        }

        if (otherDiet !== "") {
            otherList.push(otherDiet.replace(/\s/g, ''));
        }

        if (otherList) {
            tagArray = tagArray.concat(otherList);
        }

        fetch(process.env.REACT_APP_API_PATH + "/posts", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: "Recipe",
                attributes: {
                    "recipe_authorID": userID,
                    "recipeName": escapeHtml(newName),
                    "recipeDescription": escapeHtml(newDescription),
                    "recipeIngredients": escapeHtml(newIngredients),
                    "recipeSteps": escapeHtml(newSteps),
                    "recipeTags": tagArray.concat([taggedName2]),
                    "recipeTagString": (tagArray.concat([taggedName2])).toString(),
                    "pictureURL": picture,
                    "memberOf": [],
                    "postType": postType,
                },
            }),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setNewSteps('');
                    setNewIngredients('');
                    setNewName('');
                    setNewDescription('')
                    setNewTags('');
                    setNewFilename('');
                    setFile(null);
                    setPicture('');
                    setCuisines([]);
                    setDiet([]);
                    setOtherDiet('');
                    setOtherCuisine('');
                    setPostType('');
                    // set a status message, and then set a timeout to clear it after a few seconds
                    setShowPosted(!showPosted);
                    sleep(4000).then(r => navigate('/my-recipes'));
                },
                (error) => {
                    console.log("error!");
                });
    };

    function handleCheck(id, type) {
        let check_box = document.getElementById(id)
        id = id.trim().toLowerCase();
        if (check_box.checked) {
            if (type === "Cuisine") {
                let cuisineList = cuisines
                cuisineList.push(id);
                setCuisines(cuisineList);
            } else {
                let dietList = diet;
                dietList.push(id);
                setDiet(dietList)
            }
        } else {
            if (type === "Cuisine") {
                let cuisineList = cuisines
                let idx = cuisines.indexOf(id)
                if (idx > -1) {
                    cuisineList.splice(idx, 1);
                    setCuisines(cuisineList);
                }
            } else {
                let dietList = diet;
                let idx = diet.indexOf(id)
                if (idx > -1) {
                    dietList.splice(idx, 1);
                    setDiet(dietList)
                }
            }
        }
    }

    function handleSetOther(e, type) {
        if (type === "cuisine") {
            let other = e.target.value
            other = other.replace(/\s/g, '')
            setOtherCuisine(other)
        } else if (type === "diet") {
            let other = e.target.value
            other = other.replace(/\s/g, '')
            setOtherDiet(other)
        }
    }

    function handleKeyCheck(e, id, type) {
        if (e.keyCode === 13) {
            handleCheck(id, type)
        }
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <h2 className="page_title br-margin-bottom">{translations["Post a Recipe"]}</h2>
                <div className="recipe_container_row">
                    <div className="recipe_info_container">
                        {showNameError ? <ErrorPopUp text={translations["name-error"]}/> : null}
                        <label>{translations["Recipe Name"]}: <span className="asterisk">*</span>
                            <input
                                maxLength={25}
                                placeholder={translations["name-placeholder"]}
                                type="text" value={newName} className="recipe_name_box"
                                onChange={(e) => (setNewName(e.target.value), setTaggedName(e.target.value.replace(/\s/g, "")))}/>
                        </label>
                        <br/>
                        <br/>
                        {showDescriptionError ? <ErrorPopUp text={translations["description-error"]}/> : null}
                        <label>{translations["Description"]}: <span className="asterisk">*</span><br/>
                            <textarea
                                maxLength={312}
                                className="text_box"
                                placeholder={translations["description-placeholder"]}
                                rows="5"
                                cols="70"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)} // e.target.value gets the value that the user inputs
                            >
          </textarea>
                        </label>
                        <br/>
                        <br/>
                        {showIngredientError ? <ErrorPopUp text={translations["ingredients-error"]}/> : null}
                        <label>{translations["Ingredients"]}: <span className="asterisk">*</span><br/>
                            <span className="text_format_instruct">{translations["ingredients-commas"]}</span>
                            <br/>
                            <textarea className="text_box"
                                      maxLength={500}
                                      placeholder={translations["ingredients-placeholder"] }
                                      rows="5"
                                      cols="70"
                                      value={newIngredients}
                                      onChange={(e) => setNewIngredients(e.target.value)} // e.target.value gets the value that the user inputs
                            >
          </textarea>
                            <br/>
                            <div className="conversions_button_spacing">
                                <br/>
                                <div onClick={toggleConversions} className="create_conversions_button_mobile">
                                    {translations["Unit Conversions"]}
                                </div>
                                <br/>
                            </div>
                        </label>
                        <br/>
                        {showStepsError ? <ErrorPopUp text={translations["steps-error"]}/> : null}
                        <label>{translations["Preparation Steps"]}: <span className="asterisk">*</span><br/>
                            <span className="text_format_instruct">{translations["steps-commas"]}</span> <br/>
                            <textarea
                                className="text_box"
                                maxLength={500}
                                placeholder={translations["steps-placeholder"]}
                                rows="5"
                                cols="70"
                                value={newSteps}
                                onChange={(e) => setNewSteps(e.target.value)} // e.target.value gets the value that the user inputs
                            >
          </textarea>
                            <br/>
                        </label>
                        <br/>
                        <label>{translations["Add Tags"]}:<br/>
                            <span className="text_format_instruct">{translations["tags-commas"]}</span> <br/>
                            <textarea
                                maxLength={100}
                                placeholder={translations["tags-placeholder"]}
                                className="text_box"
                                rows="2"
                                cols="35"
                                value={newTags}
                                onChange={(e) => setNewTags(e.target.value)}
                            />
                            <br/>
                            <br/>
                            <label>{translations["Post Privacy"]}: <span className="asterisk">*</span>
                                <select
                                    value={postType}
                                    onChange={(e) => setPostType(e.target.value)}
                                    className="recipe_name_box"
                                >
                                    <option value="Public">{translations["Public"]}</option>
                                    <option value="Private">{translations["Private"]}</option>
                                </select>
                            </label>
                            <br/>
                            <br/>
                        </label>
                    </div>
                    <div className="recipe_info_container_2">
                        {cuisineError ? <ErrorPopUp text={translations["cuisine-error"]}/> : null}
                        <fieldset className={"choose-cuisine-checkbox-container br-margin-bottom"}>
                            <legend>{translations["Choose Cuisine Categories"]} <span className="asterisk">*</span></legend>

                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Italian" name="Italian" onChange={(e) => {
                                    e.stopPropagation();
                                    handleCheck("Italian", "Cuisine");
                                }}/>
                                <label htmlFor="Italian">{prefTrans["italian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Japanese" name="Japanese"
                                       onChange={(e) => handleCheck("Japanese", "Cuisine")}/>
                                <label htmlFor="Japanese">{prefTrans["japanese"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Chinese" name="Chinese"
                                       onChange={(e) => handleCheck("Chinese", "Cuisine")}/>
                                <label htmlFor="Chinese">{prefTrans["chinese"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Greek" name="Greek"
                                       onChange={(e) => handleCheck("Greek", "Cuisine")}/>
                                <label htmlFor="Greek">{prefTrans["greek"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Brazilian" name="Brazilian"
                                       onChange={(e) => handleCheck("Brazilian", "Cuisine")}/>
                                <label htmlFor="Brazilian">{prefTrans["brazilian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Indonesian" name="Indonesian"
                                       onChange={(e) => handleCheck("Indonesian", "Cuisine")}/>
                                <label htmlFor="Indonesian">{prefTrans["indonesian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="American" name="American"
                                       onChange={(e) => handleCheck("American", "Cuisine")}/>
                                <label htmlFor="American">{prefTrans["american"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Mexican" name="Mexican"
                                       onChange={(e) => handleCheck("Mexican", "Cuisine")}/>
                                <label htmlFor="Mexican">{prefTrans["mexican"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Spanish" name="Spanish"
                                       onChange={(e) => handleCheck("Spanish", "Cuisine")}/>
                                <label htmlFor="Spanish">{prefTrans["spanish"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="French" name="French"
                                       onChange={(e) => handleCheck("French", "Cuisine")}/>
                                <label htmlFor="French">{prefTrans["french"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Indian" name="Indian"
                                       onChange={(e) => handleCheck("Indian", "Cuisine")}/>
                                <label htmlFor="Indian">{prefTrans["indian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Korean" name="Korean"
                                       onChange={(e) => handleCheck("Korean", "Cuisine")}/>
                                <label htmlFor="Korean">{prefTrans["korean"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                            <label htmlFor="Other">{translations["Other"]}: </label>
                                <input type="text" id="Other" name="Other" maxLength={25}
                                       onChange={(e) => handleSetOther(e, "cuisine")}/>
                            </div>
                        </fieldset>
                        {dietError ? <ErrorPopUp text={translations["diet-error"]}/> : null}
                        <fieldset className={"choose-cuisine-checkbox-container"}>
                            <legend>{translations["Choose Dietary Categories"]} <span className="asterisk">*</span></legend>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Vegan" name="Vegan"
                                       onChange={(e) => handleCheck("Vegan", "Diet")}/>
                                <label htmlFor="Vegan">{prefTrans["vegan"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Meat" name="Meat"
                                       onChange={(e) => handleCheck("Meat", "Diet")}/>
                                <label htmlFor="Meat">{prefTrans["meat"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="GlutenFree" name="GlutenFree"
                                       onChange={(e) => handleCheck("GlutenFree", "Diet")}/>
                                <label htmlFor="GlutenFree">{prefTrans["glutenfree"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="NoPork" name="NoPork"
                                       onChange={(e) => handleCheck("NoPork", "Diet")}/>
                                <label htmlFor="NoPork">{prefTrans["nopork"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Dairy" name="Dairy"
                                       onChange={(e) => handleCheck("Dairy", "Diet")}/>
                                <label htmlFor="Dairy">{prefTrans["dairy"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Eggs" name="Eggs"
                                       onChange={(e) => handleCheck("Eggs", "Diet")}/>
                                <label htmlFor="Eggs">{prefTrans["eggs"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="Seafood" name="Seafood"
                                       onChange={(e) => handleCheck("Seafood", "Diet")}/>
                                <label htmlFor="Seafood">{prefTrans["seafood"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="AllergenFree" name="AllergenFree"
                                       onChange={(e) => handleCheck("AllergenFree", "Diet")}/>
                                <label htmlFor="AllergenFree">{prefTrans["allergenfree"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="NutFree" name="NutFree"
                                       onChange={(e) => handleCheck("NutFree", "Diet")}/>
                                <label htmlFor="NutFree">{prefTrans["nutfree"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                            <label htmlFor="Other">{translations["Other"]}: </label>
                                <input type="text" id="Other" name="Other" maxLength={25}
                                       onChange={(e) => handleSetOther(e, "diet")}/>
                            </div>
                        </fieldset>
                        <br/>
                        <div className={"post-recipe-image-input-container"}>
                            <div className={"post-recipe-image-input-container-label"}>
                                {dimError ? <ErrorPopUp
                                    text={translations["small-image-error"] + minWidth + " x " + minHeight + translations["pixels"]}/> : null}
                                {showImageError ? <ErrorPopUp text={translations["image-error"]}/> : null}
                                {showSizeError ? <ErrorPopUp text={translations["image-size-error"]}/> : null}
                                {translations["Upload an Image"]}: <span className="asterisk">*</span><br/>
                                <span className="text_format_instruct">{translations["image-size-error"]}</span> <br/>
                                <div className="uploaded_image_container">
                                    <img id={"user_input_image"} alt={translations["Uploaded image preview"]} className="uploaded_image" src={file} draggable="false"/>
                                </div>
                                <br/>
                                <div className="input_container">
                                    <input value={newFilename} type="file" accept="image/*" onChange={handleChange}
                                           id="fileUpload"/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <button type="submit" className="create_recipe_button">{translations["Post Recipe"]}</button>
                    </div>
                </div>
            </form>
            <button onClick={toggleConversions} className="create_conversions_button">{translations["Unit Conversions"]}</button>
            {showPosted ? <RecipePosted/> : null}
        </div>
    );


    function RecipePosted() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p>{translations["Your recipe has been posted!"]}
                        <br/>
                        <br/>
                        {translations["You will be redirected to your"]} <br/> {translations["posted recipes page shortly."]}
                    </p>
                </div>
            </div>
        );
    }
};

export default AddRecipe;