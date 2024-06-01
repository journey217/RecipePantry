import React, {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../RegistrationPages/ChoosePreferences.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Veggies from "../../assets/Veggies.jpeg";
import Meat from "../../assets/Meat.jpeg";
import GlutenFree from "../../assets/Gluten-Free.jpeg";
import NoPork from "../../assets/No-Pork.jpeg";
import Dairy from "../../assets/Dairy.jpeg";
import Eggs from "../../assets/Eggs.jpeg";
import Seafood from "../../assets/Seafood.jpeg";
import AllergenFree from "../../assets/Allergen-Free.jpeg";
import Nuts from "../../assets/Nuts.jpeg";
import { TranslationContext } from "../../Translations/Translation";

const EditDietary = () => {
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const location = useLocation();
    const userID = sessionStorage.getItem("user");
    const translations = useContext(TranslationContext).translations.ProfilePages.EditDietaryJourney;
    
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

    useEffect(() => {
        let url = process.env.REACT_APP_API_PATH + "/users/"+userID;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then(res => res.json())
            .then(result => {
                if (result) {
                    setUser(result);
                }
            })
            .catch(error => {
                console.log("ERROR loading user", error);
            });
    }, [location]);

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

        const newAtts = user.attributes;

        newAtts["ChoosePreferences"] = selectedPreferencesNames;

        fetch(`${process.env.REACT_APP_API_PATH}/users/${userID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                attributes: newAtts
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

                console.log("Preferences updated successfully", data);
                navigate("/profile"); // Navigate to home or next step
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
          }}><p>{translations["loading"]}</p></div>;
    }else{

    return (
        <div className="container_choose_cuisine">
            <div className={"spacer2"}></div>
            <h2 className="cuisine-heading_choose create-heading">{translations["edit_dietary_preferences"]}</h2>
            <p className="cuisine-text_choose">{translations["click_preferences"]}</p>
            <div className="cuisine-grid_choose">
                {preferencesData.map((preference) => (
                    <div key={preference.id} className={`cuisine-item_choose ${selectedPreferences.includes(preference.id) ? "selected_choose_pref" : ""}`} onClick={() => toggleSelection(preference.id)}>
                        <img
                            src={preference.image}
                            alt={translations[preference.name]}
                            className="cuisine-image_choose"
                            draggable="false" // Add this attribute to make the image not draggable
                        />
                        <p className="cuisine-name_choose">{translations[preference.name]}</p>
                    </div>
                ))}
            </div>
            <input type="submit" className="submit" value={translations["save"]} onClick={handleContinue} />
        </div>
    );
}
};

export default EditDietary;