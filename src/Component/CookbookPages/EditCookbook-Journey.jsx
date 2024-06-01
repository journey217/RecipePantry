import React, { useEffect, useState, useContext } from "react";
import PostForm from "../RecipePostPages/PostForm";
import PostingList from "../RecipePostPages/PostingList";
import "../../CSS Files/Journey.css"
import {Link, useNavigate} from "react-router-dom";
import { TranslationContext } from "../../Translations/Translation";

const EditCookbook = ( { } ) => {
    const navigate = useNavigate();
    const [cbDesc, setCbDesc] = useState("");
    const [cbName, setCbName] = useState("");
    const [cbFile, setCbFile] = useState(null);
    const [cbFilename, setCbFilename] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [cbImageURL, setCbImageURL] = useState("");
    const [cbTags, setCbTags] = useState("");
    const userToken = sessionStorage.getItem("token");
    const userID = sessionStorage.getItem("user");
    const [nameError, setNameError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [taggedName, setTaggedName] = useState("");
    const [cookbook, setCookbook] = useState({});
    const translations = useContext(TranslationContext).translations.CookbookPages.EditCookbookJourney;
    const minWidth = 200;
    const minHeight = 200;
    const [dimError, setDimError] = useState(false);

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }
        fetchCookbookData();
    }, [navigate, userID, userToken]);

    function fetchCookbookData() {
        const splits = window.location.href.split('/');
        const cookbook_id = splits[splits.length - 1];
        let url = process.env.REACT_APP_API_PATH + "/posts/" + cookbook_id;

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
                    if (parseInt(userID) !== parseInt(result.authorID)) {
                        navigate("/post/" + cookbook_id);
                    }
                    setCookbook(result);
                    setCbDesc(result.attributes.cbDesc);
                    setCbName(result.attributes.cbName);
                    setCbFile(result.attributes.cbImageURL);
                    setCbImageURL(result.attributes.cbImageURL);
                    let taggedName1 = result.attributes.cbName.replace(/\s/g, "");
                    let tags1 = result.attributes.cbTags
                    if (tags1.includes(taggedName1)) {
                        let rmIdx = tags1.indexOf(taggedName1);
                        tags1.splice(rmIdx, 1);
                    }
                    setCbTags(tags1.filter(n => n));
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleChange(event) {
        event.preventDefault();
        // console.log(event.target.files);

        setFileSize(event.target.files[0].size);

        // console.log(event.target.files[0].size);
        // console.log(3e6);

        setCbFilename(event.target.value)
        setCbFile(URL.createObjectURL(event.target.files[0]));

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
                setCbImageURL(pictureURL);
            });
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

        if (cbName === "") {
            setNameError(true);
            errorCount++;
        } else {
            setNameError(false);
        }

        if (cbDesc === "") {
            setDescError(true);
            errorCount++;
        } else {
            setDescError(false);
        }

        if (cbImageURL === "") {
            setImageError(true)
            errorCount++;
        } else {
            setImageError(false);
        }

        if (fileSize > 3e6) {
            setSizeError(true);
            errorCount++
        } else {
            setSizeError(false);
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

        let tagArray = []

        if (cbTags !== "") {
            let split_tags = cbTags.toString().split(",");
            let split_tags_stripped = split_tags.map((s_tag) =>
                escapeHtml(s_tag.replace(/\s/g, ''))
            );
            tagArray = split_tags_stripped;
        }

        let taggedName2 = escapeHtml(taggedName.replace(/\s/g, ""))

        let atts = cookbook.attributes

        atts["cbName"] = escapeHtml(cbName);
        atts["cbDesc"] = escapeHtml(cbDesc);
        atts["cbTags"] = tagArray.concat([taggedName2]);
        atts["cookbookTagString"] = (tagArray.concat([taggedName2])).toString();
        atts["cbImageURL"] = cbImageURL

        fetch(process.env.REACT_APP_API_PATH + "/posts/" + cookbook.id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: "Cookbook",
                attributes: atts
            }),
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    navigate('/post/cookbook/' + cookbook.id);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    function ErrorPopUp({text}) {
        return (
            <div>
                <p className="errorText">{text}</p>
            </div>
        );
    }

    function CookbookCreated() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p className={"a-t-c-recipe-removed-text"}>{translations["cookbook_created"]}
                        <br/>
                        <br/>
                        {translations["redirect_notice1"]}<br/> {translations["redirect_notice2"]}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="page_title br-margin-bottom">{translations["edit_cookbook"]}</h2>
            <center>
                <form onSubmit={submitHandler} className={"create-a-cookbook-form"}>
                    <div className={"cookbook-form-container"}>
                        <div className={"cookbook-left-container"}>
                            {nameError ? <ErrorPopUp text={translations["cbn_error"]}/> : null}
                            <label>{translations["edit_cookbook_name"]} <span className="asterisk">*</span>
                                <input
                                    placeholder={translations["cbn_placeholder"]}
                                    type="text"
                                    value={cbName}
                                    className="recipe_name_box"
                                    onChange={(e) => (setCbName(e.target.value, setTaggedName(e.target.value.replace(/\s/g, ""))))}
                                    maxLength={30}
                                />
                            </label>
                            <br/>
                            <br/>
                            {descError ? <ErrorPopUp text={translations["cbdesc_error"]}/> : null}
                            <label>{translations["edit_cb_desc"]} <span className="asterisk">*</span> <br/>
                                <textarea
                                    className="text_box"
                                    placeholder={translations["cb_desc_placeholder"]}
                                    rows="5"
                                    cols="60"
                                    value={cbDesc}
                                    onChange={(e) => setCbDesc(e.target.value)}
                                    maxLength={250}
                                >
                </textarea>
                            </label>
                            <br/>
                            <br/>
                            <label>{translations["edit_tags"]}<br/>
                                <span className="text_format_instruct">{translations["seaprate_tags_by_commas"]}</span> <br/>
                                <textarea
                                    maxLength={100}
                                    placeholder={translations["tags_placeholder"]}
                                    className="text_box"
                                    rows="2"
                                    cols="35"
                                    value={cbTags}
                                    onChange={(e) => setCbTags(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className={"cookbook-right-container"}>
                            {dimError ? <ErrorPopUp
                                text={translations["dims_error1"] + minWidth + translations["dims_error2"] + minHeight + translations["dims_error3"]}/> : null}
                            {imageError ? <ErrorPopUp text={translations["image_upload_error"]}/> : null}
                            {sizeError ? <ErrorPopUp text={translations["image_size_error"]}/> : null}
                            <label>{translations["edit_cover_image"]}<span className="asterisk">*</span><br/>
                                <span className="text_format_instruct">{translations["image_size_instruct"]}</span> <br/>
                                <div className="uploaded_image_container">
                                    <img id={"user_input_image"} alt={"Uploaded Image Preview"} className="uploaded_image" src={cbFile} draggable="false"/>
                                </div>
                                <br/>
                                <div className="input_container">
                                    <input value={cbFilename} type="file" accept="image/*" onChange={handleChange}
                                           id="fileUpload"/>
                                </div>
                            </label>
                            <br/>
                            <br/>
                        </div>
                    </div>
                    <button type="submit" className="create_recipe_button">{translations["save_changes"]}</button>
                </form>
            </center>
        </div>
    );
};

export default EditCookbook;