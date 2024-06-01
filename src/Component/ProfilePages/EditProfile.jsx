import React, { useState, useEffect, useContext } from "react";
import "../../CSS Files/Tiffany.css";
import defaultPfp from "../../assets/default_user.png";
import cam from "../../assets/camera.png"
import { Link, redirect } from "react-router-dom";
import { TranslationContext } from "../../Translations/Translation";

// The Profile component shows data from the user table.  This is set up fairly generically to allow for you to customize
// user data by adding it to the attributes for each user, which is just a set of name value pairs that you can add things to
// in order to support your group specific functionality.  In this example, we store basic profile information for the user
const EditProfile = ({toggleConfirmDelete, setUserEmail}) => {
  // states which contain basic user information/attributes
  // Initially set them all as empty strings to post them to the backend
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [picture, setPicture] = useState("");
  const [user, setUser] = useState({});
  //errors
  const [showDisplayNameError, setShowDisplayNameError] = useState(false);
  const [showDisplayNameLengthError, setShowDisplayNameLengthError] = useState(false);
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showUsernameLengthError, setShowUsernameLengthError] = useState(false);
  const [showBioError, setShowBioError] = useState(false);
  const [showPfpError, setShowPfpError] = useState(false);
  const translations = useContext(TranslationContext).translations.ProfilePages.EditProfile;
  
  //journey error code
  function ErrorPopUp ( { text } ) {
    return (
        <div>
            <p className="errorText">{text}</p>
        </div>
    );
}

  // Replace componentDidMount for fetching data
  useEffect(() => {
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
        if (result && result.attributes) {
          setUser(result);
          // if the attributes already exists and they are stored, set the states to those attributes
          // so that nothing gets overwritten
          setUsername(result.attributes.username || "");
          setDisplayName(result.attributes.displayName || "");
          setBio(result.attributes.bio || "");
          setPicture(result.attributes.picture || defaultPfp);
          setUserEmail(result.email || "");
        }
      })
      .catch((error) => {
        console.log("error!");
      });
  }, []);

  // This is the function that will get called the first time that the component gets rendered.  This is where we load the current
  // values from the database via the API, and put them in the state so that they can be rendered to the screen.
  const submitHandler = (event) => {
    //keep the form from actually submitting, since we are handling the action ourselves via
    //the fetch calls to the API
    event.preventDefault();

    //error checks
    let errorCount = 0;
    if (displayName === '' || (/^\s+$/.test(displayName))) {
              setShowDisplayNameError(true);
              errorCount++;
    } else {
              setShowDisplayNameError(false);
    } 

    if (displayName.length > 18) {
      setShowDisplayNameLengthError(true);
      errorCount++;
    } else {
      setShowDisplayNameLengthError(false);
    } 


    if (username === '' || (/^\s+$/.test(username))) {
      setShowUsernameError(true);
        errorCount++;
    } else {
       setShowUsernameError(false);
    } 

    if (username.length > 18) {
      setShowUsernameLengthError(true);
      errorCount++;
    } else {
      setShowUsernameLengthError(false);
    } 

    if (bio.length > 250) {
      setShowBioError(true);
      errorCount++;
    } else {
      setShowBioError(false);
    }

    // no errors found
    if (errorCount !== 0) {
              return
    }

    const newAtts = user.attributes;

    newAtts["username"] = username;

    newAtts["displayName"] = displayName;

    newAtts["bio"] = bio;

    newAtts["picture"] = picture;

    //make the api call to the user controller, and update the user fields (username, firstname, lastname)
    fetch(
      `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem(
        "user"
      )}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          attributes: newAtts
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setResponseMessage(result.Status);
        window.location.reload();
      })
      .catch((error) => {
        console.log("error!");
      });
  };

  const uploadPicture = (event) => {
    event.preventDefault();

    // event.target.files[0] holds the file object that the user is uploading
    const file = event.target.files[0];
    // console.log (file.name);

     //error checks
     let errorCount = 0;
     if (file.name.includes(' ')) {
               setShowPfpError(true);
               errorCount++;
     } else {
               setShowPfpError(false);
     } 
     // no errors found
     if (errorCount !== 0) {
               return
     }

    // FormData objects are used to capture HTML form and submit it using fetch or another network method.
    // provides a way to construct a set of key/value pairs representing form fields and their values
    // we can use this formData to send the attributes for the file-uploads endpoint
    const formData = new FormData();

    formData.append("uploaderID", sessionStorage.getItem("user")); // the id of the user who is uploading the file
    formData.append("attributes", JSON.stringify({})); // attributes holds an empty object, can put whatever you want here
    formData.append("file", file); // the file itself

 /*    for (let element of formData){
      console.log(element)
    } */

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
        setPicture(pictureURL);
        
      });
  };

  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.
  return (
    <>
      <form onSubmit={submitHandler} className="profileform user-card center_div">
        <div className="errors">
          {showPfpError ? <ErrorPopUp text={translations["pfp_error"]}/>: null}
          {showDisplayNameError ? <ErrorPopUp text={translations["display_name_error"]}/>: null}
          {showDisplayNameLengthError ? <ErrorPopUp text={translations["display_name_length_error"]}/>: null}
          {showUsernameError ? <ErrorPopUp text={translations["username_error"]}/>: null}
          {showUsernameLengthError ? <ErrorPopUp text={translations["username_length_error"]}/>: null}
          {showBioError ? <ErrorPopUp text={translations["bio_error"]}/>: null}
        </div>


        <div className="change-profile-pic">
          <img src={picture} alt={translations["user"]} className="profile-pic" draggable="false"/>
          <div className="overlay">
            <img src={cam} className="icon" draggable="false"/>
          </div>
          <input id="choosepfp" type="file" accept="image/*" onChange={uploadPicture} />
        </div>


        <div className="input-and-label">
          <label className="edit-profile-label">{translations["display_name"]} <span className="asterisk">*</span></label>
          <input className="edit-profile-input"
              type="text"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
            />
        </div>

        <div className="input-and-label">
          <label className="edit-profile-label">{translations["username"]} <span className="asterisk">*</span></label>
          <input className="edit-profile-input"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
        </div>

        <div className="input-and-label">
          <label className="edit-profile-label">{translations["bio"]} </label>
          <textarea className="bio-input"
              type="text"
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
        </div>

        <input className="submit" type="submit" value={translations["save"]} />
        <Link className="delete-account" onClick={toggleConfirmDelete}>{translations["delete_account"]}</Link>

        {responseMessage}
      </form>
    </>
  );
};

export default EditProfile;
