import React, { useState, useEffect, useContext  } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ChooseCuisines.css";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { TranslationContext } from "../../Translations/Translation";

import Italian from "../../assets/Italian.jpeg";
import Japanese from "../../assets/Japanese.jpeg";
import Chinese from "../../assets/Chinese.jpeg";
import Greek from "../../assets/Greek.jpeg";
import Brazilian from "../../assets/Brazillian.jpeg";
import Indonesian from "../../assets/Indonesian.jpeg";
import American from "../../assets/American.jpeg";
import Mexican from "../../assets/Mexican.jpeg";
import Spanish from "../../assets/Spanish.jpeg";
import French from "../../assets/French.jpeg";
import Indian from "../../assets/Indian.jpeg";
import Korean from "../../assets/Korean.jpeg";

const RegistrationChooseCuisines = () => {
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const translations = useContext(TranslationContext).translations["RegistrationPages"]["RegistrationChooseCuisines"];
    
    const cuisinesData = [
        { id: 1, name: "italian", image: Italian },
        { id: 2, name: "japanese", image: Japanese },
        { id: 3, name: "chinese", image: Chinese },
        { id: 4, name: "greek", image: Greek },
        { id: 5, name: "brazilian", image: Brazilian },
        { id: 6, name: "indonesian", image: Indonesian },
        { id: 7, name: "american", image: American },
        { id: 8, name: "mexican", image: Mexican },
        { id: 9, name: "spanish", image: Spanish },
        { id: 10, name: "french", image: French },
        { id: 11, name: "indian", image: Indian },
        { id: 12, name: "korean", image: Korean },
    ];

    //journey error code
    function ErrorPopUp({text}) {
        return (
            <div>
                <p className="errorText">{text}</p>
            </div>
        );
    }

    const toggleSelection = (id) => {
        if (selectedCuisines.includes(id)) {
            setSelectedCuisines(selectedCuisines.filter((cuisineId) => cuisineId !== id));
        } else {
            setSelectedCuisines([...selectedCuisines, id]);
        }
    };

    const handleContinue = () => {
        if (selectedCuisines.length >= 1) {
            // Assuming you need to send a comma-separated string of cuisine names
            const selectedCuisineNames = selectedCuisines.map(id => cuisinesData.find(cuisine => cuisine.id === id).name).join(', ');

            const userId = sessionStorage.getItem("user");
            const pictureURL = sessionStorage.getItem("pictureURL");
            const displayName = sessionStorage.getItem('displayName');
            const username = sessionStorage.getItem('username');

            fetch(`${process.env.REACT_APP_API_PATH}/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`, // Use the auth token from session storage
                },
                body: JSON.stringify({
                    attributes: {
                        CuisineCuisine: selectedCuisineNames, // Update the cuisine preferences attribute
                        picture: pictureURL,
                        displayName: displayName,
                        username: username,
                    },
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update profile with cuisine preferences.');
                    }
                    return response.json();
                })
                .then(data => {
                    sessionStorage.setItem('ChooseCuisine', selectedCuisineNames)

                    // console.log("Profile updated successfully with cuisine preferences.", data);
                    navigate("/registration-choose-preferences"); // Proceed to the next step
                })
                .catch(error => {
                    console.error("Error updating profile with cuisine preferences:", error);
                });
        } else {
            setShowError(true);
            window.self.scroll(0,0);
        }
    };

    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const images = cuisinesData.map((cuisine) => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = cuisine.image;
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
            <h2 className="cuisine-heading_choose create-heading">{translations["choose_cuisines_title"]}</h2>
            {showError ? <ErrorPopUp text={translations["choose_cuisines_num_error"]}/> : null}
            <p className="cuisine-text_choose">{translations["choose_cuisines_text"]}</p>
            <div className="cuisine-grid_choose">
                {cuisinesData.map((cuisine) => (
                    <div key={cuisine.id}
                         className={`cuisine-item_choose ${selectedCuisines.includes(cuisine.id) ? "selected_choose_cuisine" : ""}`}
                         onClick={() => toggleSelection(cuisine.id)}>
                        <img
                            src={cuisine.image}
                            alt={cuisine.name}
                            className="cuisine-image_choose"
                            draggable="false" // Add this attribute to make the image not draggable
                        />
                        <p className="cuisine-name_choose">{translations[cuisine.name]}</p>
                    </div>
                ))}
            </div>
            <input className="submit" type="submit" value={translations["continue"]} onClick={handleContinue}/>
        </div>
    );
}
};

export default RegistrationChooseCuisines;




