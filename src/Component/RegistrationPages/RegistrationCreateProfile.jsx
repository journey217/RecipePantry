import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TranslationContext } from "../../Translations/Translation";

const CreateProfile = () => {
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const translations = useContext(TranslationContext).translations["RegistrationPages"]["RegistrationCreateProfile"];

       //journey error code
  function ErrorPopUp ( { text } ) {
    return (
        <div>
            <p className="errorText">{text}</p>
        </div>
    );
  }

  const isValidInput = input => /^[a-zA-Z0-9_-]+$/.test(input);

    const fetchAllUsernames = async () => {
        try {
            const url = `${process.env.REACT_APP_API_PATH}/users`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            });

            const data = await response.json();
            if (!data[0]) {
                console.error("Invalid response structure:", data);
                setError("Unexpected response structure from server.");
                return [];
            }

            const usernames = data[0].map(user => user.attributes ? user.attributes.username : null)
                .filter(username => username != null); //filter out null or undefined usernames

            return usernames;
        } catch (error) {
            console.error("Error fetching usernames", error);
            setError("Failed to fetch usernames.");
            return [];
        }
    }



    const updateProfile = () => {
        const userId = sessionStorage.getItem("user"); // User ID from session storage
        const pictureURL = sessionStorage.getItem("pictureURL");

        fetch(`${process.env.REACT_APP_API_PATH}/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`, // Auth token from session storage
            },
            body: JSON.stringify({
                attributes: {
                    displayName: displayName,
                    username: username,
                    picture: pictureURL
                },
            }),
        })
            .then(response => response.json())
            .then(data => {
                sessionStorage.setItem('displayName', displayName);
                sessionStorage.setItem('username', username);

                // console.log("Profile updated successfully", data);
                navigate("/registration-choose-cuisines")
            })
            .catch(error => {
                console.error("Failed to update profile", error);
                setError(translations["update_fail"]);
            });
    };

    const handleContinue = async (event) => {
        event.preventDefault(); //prevent default form submission behavior

        if (!displayName || !username) {
            setError(translations["fill_in_error"]);
            return;
        }

        // Fetch all usernames and check for availability
        const usernames = await fetchAllUsernames();
        const isAvailable = !usernames.some(existingUsername =>
            existingUsername.toLowerCase() === username.toLowerCase()
        );

        if (!isAvailable) {
            setError(translations["username_taken"]);
            return;
        }

        if (!isValidInput(displayName) || !isValidInput(username)) {
            setError(translations["special_char_error"]);
            return;
        }

        // Reset error state if pass
        setError("");
        updateProfile();
    };

    return (
        <div className="registration-container">
            <form className="user-card profileform" onSubmit={handleContinue}>
                <h2 className="create-heading" >{translations["create_profile_title"]}</h2>
                {error? <ErrorPopUp text={error} /> : null}
                <div className="input-and-label">
                    <label className="edit-profile-label">{translations["display_name"]} <span className="asterisk">*</span></label>
                    <input
                        type="text"
                        className="edit-profile-input"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                    />
                </div>
                <div className="input-and-label">
                    <label className="edit-profile-label">{translations["username"]} <span className="asterisk">*</span></label>
                    <input
                        type="text"
                        className="edit-profile-input"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <input className="submit registration" type="submit" value={translations["continue"]} />
            </form>
        </div>
    );
};

export default CreateProfile;


