import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import siteIcon from "../../assets/RP_Logo.png"
import "../../CSS Files/Sheba.css"
import { TranslationContext } from "../../Translations/Translation";

const RegistrationUploadPicture = () => {
    const [profilePicture, setProfilePicture] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const translations = useContext(TranslationContext).translations["RegistrationPages"]["RegistrationUploadPicture"];

    const handleFileChange = (event) => {
        event.preventDefault();

        const file = event.target.files[0];
        if (file) {
            // Use createObjectURL for previewing the selected file
            const objectURL = URL.createObjectURL(file);
            setProfilePicture(objectURL);
            const formData = new FormData();

            formData.append("uploaderID", sessionStorage.getItem("user")); // the id of the user who is uploading the file
            formData.append("attributes", JSON.stringify({})); // attributes holds an empty object, can put whatever you want here
            formData.append("file", file); // the file itself

            const userID = sessionStorage.getItem("user"); // Retrieve the user ID from session storage
            // console.log(`Uploading picture for user ID: ${userID}`); // Log the user ID


            // console.log(process.env.REACT_APP_API_PATH + "/file-uploads");
            // make api call to file-uploads endpoint to post the profile picture
            fetch(process.env.REACT_APP_API_PATH + "/file-uploads", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
                body: formData // send the formdata to the backend
            })
                .then(response => response.json())
                .then((result) => {
                    // Assuming result contains the path or URL of the uploaded picture
                    let pictureURL = "https://webdev.cse.buffalo.edu" + result.path;
                    sessionStorage.setItem('pictureURL', pictureURL);
                    // console.log("File uploaded successfully. File URL:", pictureURL);

                    // Now, update the user's profile with this picture URL
                    return fetch(`${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem("user")}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            attributes: {
                                picture: pictureURL, // Ensure this matches your backend model
                            },
                        }),
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update user profile with picture.');
                    }
                    return response.json();
                })
                .then(updatedUser => {
                    // console.log("User profile updated with new picture.", updatedUser);
                    // Optionally update local state or navigate as needed
                })
                .catch(error => {
                    console.error("Error updating user profile:", error);
                });
        };
        };

    const handleContinue = () => {
        navigate("/registration-create-profile");
    };

    return (
        <div className="registration-container">
            <div className="user-card">
                <img src={siteIcon} alt="Site Logo" style={{ maxWidth: '100px', margin: '0 auto 20px' }} draggable="false"/>
                <h2 className="create-heading" >{translations["upload_pfp_title"]}</h2>
                <p>{translations["upload_pfp_text1"]}</p>
                <p>{translations["upload_pfp_text2"]}</p>
                <div style={{ textAlign: "center" }}>
                    <label htmlFor="profile-picture" style={{ cursor: "pointer" }}>
                        {profilePicture && (
                            <img
                                src={profilePicture}
                                alt={translations["profile_alt"]}
                                style={{ width: 200, height: 200, borderRadius: "50%", border: "1px solid #ccc" }}
                                draggable="false"
                            />
                            )}
                            <span style={{ fontSize: 64 }}>+</span>
                    </label>
                    <input
                        type="file"
                        id="profile-picture"
                        accept="image/jpeg"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>
                <input type="submit" className="submit registration" value={translations["continue"]} onClick={handleContinue} />
            </div>
        </div>
    );
};

export default RegistrationUploadPicture;