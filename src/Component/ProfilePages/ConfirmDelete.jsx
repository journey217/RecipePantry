import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { TranslationContext } from "../../Translations/Translation";

const ConfirmDelete = ( { closeConfirmDelete, showConfirmDelete, email} ) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState("");
    const translations = useContext(TranslationContext).translations.ProfilePages.ConfirmDelete;
    const handleClose = (e) => {
        closeConfirmDelete && closeConfirmDelete(e);
        setError("");
    };

           //journey error code
           function ErrorPopUp ( { text } ) {
            return (
                <div>
                    <p className="errorText">{text}</p>
                </div>
            );
        }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const deleteAccount = () => { 
        fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user") + "?relatedObjectsAction=delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
          .then((result) => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
          })
          .catch((error) => {
            console.log("deletion error:" + error);

          });
      };

    function handleDelete(event) {

        event.preventDefault();
        setError("");
        console.log(email);
        if (password === '') {
            setError(translations["enter_password_error"]);
            return; // Stop the function execution if validation fails
        }

        fetch(process.env.REACT_APP_API_PATH + "/auth/login", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        .then((res) => res.json())
        .then((result) => {
            if (result.userID) {
                console.log(result);
                setConfirmDelete(true);
                // add popup and redirect to login page
                deleteAccount();

                sleep(3000).then(r => window.location.reload());

            }
        })
        .catch((error) => {
            setError(translations["wrong_password_error"])
        });

    }

      //redirect popup (thanks journey)
    function DeletedConfirmation() {
        return (
        <div className={"darkend_background"}>
        <div className="recipe_posted_pop">
            <div>
                <p>{translations["account_deleted"]} <br/>
                    <br/>
                    <br/>
            {translations["redirect1"]}<br/>{translations["redirect2"]}
                </p>
            </div>
        </div>
        </div>
        );
}
    if (!showConfirmDelete) {
        return null;   
    }

    return (
        <div className={"darkend_background"}>
        <div className="delete-account-modal">
            <button onClick={handleClose} className="x_button">X</button>
            <div className="conversion_inputs">
                    <h3>{translations["enter_password"]}</h3>
                    <p>{translations["delete_account_warning"]}</p>
                    <form className="deleteform" onSubmit={handleDelete}>
                        {error ? <ErrorPopUp text={error} /> : null}
                        <input type="password" className="delete-account-input" onChange={(event) => setPassword(event.target.value)} placeholder="password" required></input>
                        <button type="submit" className="delete-account-button">{translations["delete_account"]}</button>
                    </form>
                        <a onClick={handleClose} className="delete-account">{translations["cancel"]}</a>
                    {confirmDelete && <DeletedConfirmation />}
            </div>
        </div>
        </div>
    );
}

export default ConfirmDelete;