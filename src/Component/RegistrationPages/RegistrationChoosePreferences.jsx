import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./ChoosePreferences.css";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { TranslationContext } from "../../Translations/Translation";

import Veggies from "../../assets/Veggies.jpeg";
import Meat from "../../assets/Meat.jpeg";
import GlutenFree from "../../assets/Gluten-Free.jpeg";
import NoPork from "../../assets/No-Pork.jpeg";
import Dairy from "../../assets/Dairy.jpeg";
import Eggs from "../../assets/Eggs.jpeg";
import Seafood from "../../assets/Seafood.jpeg";
import AllergenFree from "../../assets/Allergen-Free.jpeg";
import Nuts from "../../assets/Nuts.jpeg";

const RegistrationChoosePreferences = () => {
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const navigate = useNavigate();
    const translations = useContext(TranslationContext).translations["RegistrationPages"]["RegistrationChoosePreferences"];

    const preferencesData = [
        { id: 1, name: "vegan", image: Veggies },
        { id: 2, name: "meat", image: Meat },
        { id: 3, name: "glutenfree", image: GlutenFree },
        { id: 4, name: "nopork", image: NoPork },
        { id: 5, name: "dairy", image: Dairy },
        { id: 6, name: "eggs", image: Eggs },
        { id: 7, name: "seafood", image: Seafood },
        { id: 8, name: "allergenfree", image: AllergenFree },
        { id: 9, name: "nutfree", image: Nuts },
    ];

    const toggleSelection = (id) => {
        if (selectedPreferences.includes(id)) {
            setSelectedPreferences(selectedPreferences.filter((preferenceId) => preferenceId !== id));
        } else {
            setSelectedPreferences([...selectedPreferences, id]);
        }
    };

    const handleContinue = () => {
        // Example API call to update user preferences
        const selectedPreferencesNames = selectedPreferences.map(id => preferencesData.find(cuisine => cuisine.id === id).name).join(', ');

        const userId = sessionStorage.getItem("user");
        let pictureURL = sessionStorage.getItem("pictureURL");
        // console.log(pictureURL);
        if (pictureURL === null) {
            pictureURL = "https://webdev.cse.buffalo.edu/hci/api/uploads/files/Tc7yHHxMmVXgmYNKIItW99w4gu9653ByS3VnWhRDY_Q.png"
        }
        const displayName = sessionStorage.getItem('displayName');
        const username = sessionStorage.getItem('username');
        const selectedCuisineNames = sessionStorage.getItem('ChooseCuisine');

        fetch(`${process.env.REACT_APP_API_PATH}/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                attributes: {
                    ChoosePreferences: selectedPreferencesNames,
                    CuisineCuisine: selectedCuisineNames,
                    picture: pictureURL,
                    displayName: displayName,
                    username: username,
                    hiddenPosts: []
                },
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update preferences');
                }
                return response.json();
            })
            .then(data => {
                sessionStorage.setItem('ChoosePreferences', selectedPreferencesNames)

                // console.log("Preferences updated successfully", data);
                navigate("/"); // Navigate to home or next step
            })
            .catch(error => {
                console.error("Failed to update preferences", error);
            });

        // Scroll down a little after the button is clicked
        window.scrollBy({ top: 100, behavior: 'smooth' });
    };

    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const images = preferencesData.map((preference) => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = preference.image;
            img.onload = resolve;
            img.onerror = reject;
        }));

        Promise.all(images)
            .then(() => {
                setImagesLoaded(true);
            })
            .catch((error) => {
                console.error("Error loading images:", error);
            });
    }, []);

    if (!imagesLoaded) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}><p>Loading...</p></div>;
    }else{

    return (
        <div className="container_choose_cuisine">
            <button
                className="go_back_button"
                onClick={() => window.history.back()}
                style={{
                    position: 'absolute',
                    top: '20vh',
                    left: '20vh',
                }}
                >
                <IoArrowBackCircleSharp/> {translations["back"]}
                </button>
            <h2 className="cuisine-heading_choose create-heading">{translations["choose_pref_title"]}</h2>
            <p className="cuisine-text_choose">{translations["choose_pref_text"]}</p>
            <div className="cuisine-grid_choose">
                {preferencesData.map((preference) => (
                    <div key={preference.id} className={`cuisine-item_choose ${selectedPreferences.includes(preference.id) ? "selected_choose_pref" : ""}`} onClick={() => toggleSelection(preference.id)}>
                        <img
                            src={preference.image}
                            alt={preference.name}
                            className="cuisine-image_choose"
                            draggable="false" // Add this attribute to make the image not draggable
                        />
                        <p className="cuisine-name_choose">{translations[preference.name]}</p>
                    </div>
                ))}
            </div>
            <input type="submit" className="submit" value={translations["continue"]} onClick={handleContinue} />
        </div>
    );
}
};

export default RegistrationChoosePreferences;




