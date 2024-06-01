import React, { useState, useEffect, useContext } from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import "../../CSS Files/Journey.css"
import transparent from "../../assets/image_preview.png";
import { TranslationContext } from "../../Translations/Translation";


const cuisineList = [
    "italian",
    "japanese",
    "chinese",
    "greek",
    "brazilian",
    "indonesian",
    "american",
    "mexican",
    "spanish",
    "french",
    "indian",
    "korean"
];

const dietList = [
    "vegan",
    "meat",
    "glutenfree",
    "nopork",
    "dairy",
    "eggs",
    "seafood",
    "allergenfree",
    "nutfree"
];


const EditRecipe = ( { } ) => {
    const translations = useContext(TranslationContext).translations.RecipeForm;
    const prefTrans = useContext(TranslationContext).translations.ProfilePages.ShowProfileJessica;
    const {id} = useParams();
    const navigate = useNavigate();

    // State for recipe details
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState("");
    const [showNameError, setShowNameError] = useState(false);
    const [showIngredientError, setShowIngredientError] = useState(false);
    const [showStepsError, setShowStepsError] = useState(false);
    const [showImageError, setShowImageError] = useState(false);
    const [showSizeError, setShowSizeError] = useState(false);
    const [showDescriptionError, setShowDescriptionError] = useState(false);
    const [fileSize, setFileSize] = useState(0);
    const [newFilename, setNewFilename] = useState('');
    const [recipe, setRecipe] = useState({})
    const [cuisines, setCuisines] = useState([]);
    const [diet, setDiet] = useState([]);
    const [otherCuisine, setOtherCuisine] = useState("");
    const [otherDiet, setOtherDiet] = useState("");
    const [cuisineError, setCuisineError] = useState(false);
    const [dietError, setDietError] = useState(false);
    const [taggedName, setTaggedName] = useState("");
    const location = useLocation();
    const userID = sessionStorage.getItem("user");
    const userToken = sessionStorage.getItem("token");
    const [postType, setPostType] = useState("Public");
    const minWidth = 200;
    const minHeight = 200;
    const [dimError, setDimError] = useState(false);

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "");
    }

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        fetchRecipeDetails();
    }, [location]);

    const fetchRecipeDetails = () => {

        fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                if (result) {

                    if (parseInt(userID) !== parseInt(result.authorID)) {
                        navigate("/post/" + id);
                    }

                    setRecipe(result)
                    setName(result.attributes.recipeName);
                    setTaggedName(result.attributes.recipeName.replace(/\s/g, ""))
                    setDescription(result.attributes.recipeDescription);
                    setIngredients(result.attributes.recipeIngredients);
                    setSteps(result.attributes.recipeSteps);
                    setImage(result.attributes.pictureURL);
                    setPostType(result.attributes.postType || "Public");
                    let taggedName1 = result.attributes.recipeName.replace(/\s/g, "");
                    let i = 0;
                    let tags1 = result.attributes.recipeTags
                    let getCuisinesList = []
                    let removeIdx = []
                    while (i < tags1.length) {
                        console.log(cuisineList)
                        if (cuisineList.includes(tags1[i])) {
                            removeIdx.push(i);
                            getCuisinesList.push(tags1[i])
                            let div = document.getElementById(tags1[i])
                            div.checked = true;
                        }
                        i++;
                    }
                    setCuisines(getCuisinesList)
                    i = 0;
                    let getDietList = []
                    while (i < tags1.length) {
                        if (dietList.includes(tags1[i])) {
                            removeIdx.push(i);
                            getDietList.push(tags1[i])
                            let div = document.getElementById(tags1[i])
                            div.checked = true;
                        }
                        i++;
                    }
                    if (tags1.includes(taggedName1)) {
                        let rmIdx = tags1.indexOf(taggedName1);
                        removeIdx.push(rmIdx);
                    }
                    setDiet(getDietList);
                    let j = 0;
                    while (j < removeIdx.length) {
                        tags1.splice(removeIdx[j] - j, 1);
                        j++;
                    }
                    setTags(tags1.filter(n => n));
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    function ErrorPopUp({text}) {
        return (
            <div>
                <p className="errorText">{text}</p>
            </div>
        );
    }

    const handleImageChange = (event) => {
        event.preventDefault();

        // event.target.files[0] holds the file object that the user is uploading
        const file = event.target.files[0];

        setFileSize(event.target.files[0].size);

        setNewFilename(event.target.value)

        //error checks
        let errorCount = 0;
        if (file.name.includes(' ')) {
            setShowImageError(true);
            errorCount++;
        } else {
            setShowImageError(false);
        }


        const formData = new FormData();

        formData.append("uploaderID", sessionStorage.getItem("user")); // the id of the user who is uploading the file
        formData.append("attributes", JSON.stringify({})); // attributes holds an empty object, can put whatever you want here
        formData.append("file", file); // the file itself


        // console.log(process.env.REACT_APP_API_PATH + "/file-uploads");
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
                setImage(pictureURL);

            });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        let errorCount = 0;

        if (name === '') {
            setShowNameError(true);
            errorCount++;
        } else {
            setShowNameError(false);
        }

        if (description === '') {
            setShowDescriptionError(true);
            errorCount++;
        } else {
            setShowDescriptionError(false);
        }

        if (ingredients === '') {
            setShowIngredientError(true);
            errorCount++;
        } else {
            setShowIngredientError(false);
        }

        if (steps === '') {
            setShowStepsError(true);
            errorCount++;
        } else {
            setShowStepsError(false);
        }

        if (newFilename === '' && image === '') {
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


        if (tags !== "") {
            let split_tags = tags.toString().split(",");
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

        const newAtts = recipe.attributes;

        newAtts["recipeName"] = escapeHtml(name);
        newAtts["recipeDescription"] = escapeHtml(description);
        newAtts["recipeIngredients"] = escapeHtml(ingredients);
        newAtts["recipeSteps"] = escapeHtml(steps);
        newAtts["recipeTags"] = tagArray.concat([taggedName2]);
        newAtts["pictureURL"] = image;
        newAtts["recipeTagString"] = (tagArray.concat([taggedName2])).toString();
        newAtts["postType"] = postType;

        const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: "Recipe",
                attributes: newAtts
            }),
        });

        if (response.ok) {
            navigate(`/post/${id}`);
        } else {
            console.error("Failed to save changes.");
        }
    };

    function handleCheck(id, type) {
        let check_box = document.getElementById(id)
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

    return (
        <div>
            <form onSubmit={handleSaveChanges}>
                <h2 className="page_title br-margin-bottom">{translations["Edit Recipe"]}</h2>
                <div className="recipe_container_row">
                    <div className="recipe_info_container">
                        {showNameError ? <ErrorPopUp text={translations["name-error"]} />: null}
                        <label>{translations["Edit Recipe Name"]}: <span className="asterisk">*</span>
                            <input
                                maxLength={25}
                                placeholder={translations["name-placeholder"]}
                                type="text" value={name} className="recipe_name_box"
                                onChange={(e) => (setName(e.target.value), setTaggedName(e.target.value.replace(/\s/g, "")))}/>
                        </label>
                        <br/>
                        <br/>
                        {showDescriptionError ? <ErrorPopUp text={translations["description-error"]}/>: null}
                        <label>{translations["Edit Description"]}: <span className="asterisk">*</span><br/>
                            <textarea
                                maxLength={312}
                                className="text_box"
                                placeholder={translations["description-placeholder"]}
                                rows="5"
                                cols="70"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} // e.target.value gets the value that the user inputs
                            >
          </textarea>
                        </label>
                        <br/>
                        <br/>
                        {showIngredientError ? <ErrorPopUp text={translations["ingredients-error"]}/>: null}
                        <label>{translations["Edit Ingredients"]}: <span className="asterisk">*</span><br/>
                            <span className="text_format_instruct">{translations["ingredients-commas"]}</span> 
                            <br/>
                            <textarea className="text_box"
                                      maxLength={500}
                                      placeholder={translations["ingredients-placeholder"]}
                                      rows="5"
                                      cols="70"
                                      value={ingredients}
                                      onChange={(e) => setIngredients(e.target.value)} // e.target.value gets the value that the user inputs
                            >
          </textarea>
                            <br/>
                        </label>
                        <br/>
                        {showStepsError ? <ErrorPopUp text={translations["steps-error"]}/>: null}
                        <label>{translations["Edit Preparation Steps"]}: <span className="asterisk">*</span><br/>
                            <span className="text_format_instruct">{translations["steps-commas"]}</span> <br/>
                            <textarea
                                maxLength={500}
                                className="text_box"
                                placeholder={translations["steps-placeholder"]}
                                rows="5"
                                cols="70"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)} // e.target.value gets the value that the user inputs
                            >
          </textarea>
                            <br/>
                        </label>
                        <br/>
                        <label>{translations["Edit Tags"]}:<br/>
                            <span className="text_format_instruct">{translations["tags-commas"]}</span> <br/>
                            <textarea
                                maxLength={100}
                                placeholder={translations["tags-placeholder"] }
                                className="text_box"
                                rows="2"
                                cols="35"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                            <br/>
                            <br/>
                            <label>{translations["Edit Post Privacy"]}: <span className="asterisk">*</span>
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
                        <br/>
                    </div>
                    <div className="recipe_info_container_2">
                        {cuisineError ? <ErrorPopUp text={translations["cuisine-error"]}/> : null}
                        <fieldset className={"choose-cuisine-checkbox-container br-margin-bottom"}>
                            <legend>{translations["edit-cuisine"]} <span className="asterisk">*</span></legend>

                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="italian" name="italian"
                                       onChange={(e) => handleCheck("italian", "Cuisine")}/>
                                <label htmlFor="italian">{prefTrans["italian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="japanese" name="japanese"
                                       onChange={(e) => handleCheck("japanese", "Cuisine")}/>
                                <label htmlFor="japanese">{prefTrans["japanese"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="chinese" name="chinese"
                                       onChange={(e) => handleCheck("chinese", "Cuisine")}/>
                                <label htmlFor="chinese">{prefTrans["chinese"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="greek" name="greek"
                                       onChange={(e) => handleCheck("Greek", "Cuisine")}/>
                                <label htmlFor="Greek">{prefTrans["greek"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="brazilian" name="brazilian"
                                       onChange={(e) => handleCheck("brazilian", "Cuisine")}/>
                                <label htmlFor="brazilian">{prefTrans["brazilian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="indonesian" name="indonesian"
                                       onChange={(e) => handleCheck("indonesian", "Cuisine")}/>
                                <label htmlFor="indonesian">{prefTrans["indonesian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="american" name="american"
                                       onChange={(e) => handleCheck("american", "Cuisine")}/>
                                <label htmlFor="american">{prefTrans["american"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="mexican" name="mexican"
                                       onChange={(e) => handleCheck("mexican", "Cuisine")}/>
                                <label htmlFor="mexican">{prefTrans["mexican"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="spanish" name="spanish"
                                       onChange={(e) => handleCheck("spanish", "Cuisine")}/>
                                <label htmlFor="spanish">{prefTrans["spanish"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="french" name="french"
                                       onChange={(e) => handleCheck("french", "Cuisine")}/>
                                <label htmlFor="french">{prefTrans["french"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="indian" name="indian"
                                       onChange={(e) => handleCheck("indian", "Cuisine")}/>
                                <label htmlFor="indian">{prefTrans["indian"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="korean" name="korean"
                                       onChange={(e) => handleCheck("korean", "Cuisine")}/>
                                <label htmlFor="korean">{prefTrans["korean"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <label htmlFor="Other">{translations["Other"]}: </label>
                                <input type="text" id="Other" name="Other" maxLength={25}
                                       onChange={(e) => handleSetOther(e, "cuisine")}/>
                            </div>
                        </fieldset>
                        {dietError ? <ErrorPopUp text={translations["diet-error"]}/> : null}
                        <fieldset className={"choose-cuisine-checkbox-container"}>
                            <legend>{translations["edit-diet"]} <span className="asterisk">*</span></legend>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="vegan" name="vegan"
                                       onChange={(e) => handleCheck("vegan", "Diet")}/>
                                <label htmlFor="vegan">{prefTrans["vegan"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="meat" name="meat"
                                       onChange={(e) => handleCheck("meat", "Diet")}/>
                                <label htmlFor="meat">{prefTrans["meat"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="glutenfree" name="glutenfree"
                                       onChange={(e) => handleCheck("glutenfree", "Diet")}/>
                                <label htmlFor="glutenfree">{prefTrans["glutenfree"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="nopork" name="nopork"
                                       onChange={(e) => handleCheck("nopork", "Diet")}/>
                                <label htmlFor="nopork">{prefTrans["nopork"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="dairy" name="dairy"
                                       onChange={(e) => handleCheck("dairy", "Diet")}/>
                                <label htmlFor="dairy">{prefTrans["dairy"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="eggs" name="eggs"
                                       onChange={(e) => handleCheck("eggs", "Diet")}/>
                                <label htmlFor="eggs">{prefTrans["eggs"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="seafood" name="seafood"
                                       onChange={(e) => handleCheck("seafood", "Diet")}/>
                                <label htmlFor="seafood">{prefTrans["seafood"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="allergenfree" name="allergenfree"
                                       onChange={(e) => handleCheck("allergenfree", "Diet")}/>
                                <label htmlFor="allergenfree">{prefTrans["allergenfree"]}</label>
                            </div>
                            <div className={"choose-cuisine-checkbox-item"}>
                                <input type="checkbox" id="nutfree" name="nutfree"
                                       onChange={(e) => handleCheck("nutfree", "Diet")}/>
                                <label htmlFor="nutfree">{prefTrans["nutfree"]}</label>
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
                                {translations["Edit Image"]}: <span className="asterisk">*</span><br/>
                                <span className="text_format_instruct">{translations["image-size-error"]}</span> <br/>
                                <div className="uploaded_image_container">
                                    <img id={"user_input_image"} className="uploaded_image"
                                         alt={"Edit Recipe Image Preview Box"} src={image} draggable="false"/>
                                </div>
                                <br/>
                                <div className="input_container">
                                    <input value={newFilename} type="file" accept="image/*" onChange={handleImageChange}
                                           id="fileUpload"/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <button type="submit" className="create_recipe_button">{translations["Save Changes"]}</button>
                    </div>
                </div>
            </form>
            <br/>
            <br/>
        </div>
    );
};

export default EditRecipe;


