import React, {useEffect, useState, useContext} from "react";
import "../../CSS Files/Journey.css";
import {useLocation} from "react-router-dom";
import { TranslationContext } from "../../Translations/Translation";

const AddToCookbook = ( { closeAddCookbook, showAddCookbook } ) => {
    const userID = sessionStorage.getItem("user");
    const [recipeAttributes, setRecipeAttributes] = useState({});
    const [cookbooks, setCookbooks] = useState([]);
    const [recipe, setRecipe] = useState({});
    const [addCookbook, setAddCookbook] = useState(0);
    const [showAdded, setShowAdded] = useState(false);
    const [showAlreadyAdded, setShowAlreadyAdded] = useState(false);
    const [showSelectACB, setShowSelectACB] = useState(false);
    const location = useLocation()
    const [noneError, setNoneError] = useState(false);
    const translations =
    useContext(TranslationContext).translations.CookbookPages.AddToCookbookJourney;

     useEffect(() => {
         setShowSelectACB(false);
         setShowAlreadyAdded(false);
         setRecipe({});
         setCookbooks([]);
         setAddCookbook(0);
         setNoneError(false);
         loadCookbooks();
     }, [location])

    const handleClose = (e) => {
        closeAddCookbook && closeAddCookbook(e);
    };

    const loadCookbooks = () => {
    if (sessionStorage.getItem("token") && sessionStorage.getItem('user')) {
        const splits = window.location.href.split('/');
        const recipe_id = splits[splits.length - 1];
        if (splits[splits.length-2] !== "post") {
            return
        }
        let url1 = process.env.REACT_APP_API_PATH + "/posts/" + recipe_id;

        fetch(url1, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
          })
              .then((res) => res.json())
              .then((result) => {
                  // console.log(result)
                  if (result) {
                      setRecipe(result);
                      setRecipeAttributes(result.attributes);
                  }
              })
              .catch((err) => {
                  console.log(err)
              });

        let query = escape('{"path": "cb_authorID", "equals":"'+userID+'"}');

        let url = process.env.REACT_APP_API_PATH + "/posts?attributes="+query;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                // console.log(result)
                if (result) {

                    if (result[0].length === 0) {
                        setNoneError(true);
                    }

                    setCookbooks(result[0]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }};

    function ErrorPopUp ( { text } ) {
        return (
            <div>
                <p className="errorText">{text}</p>
            </div>
        );
    }

    if (!showAddCookbook) {
        return null;
    }

    function checkForName(item) {
      if (item.attributes) {
          if (item.attributes.cbName) {
              return item.attributes.cbName;
          } else {
              return translations["default_name"]
          }
      } else {
          return translations["default_name"]
      }
  }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (noneError === true) {
            return;
        }

        if (addCookbook === 0) {
            setShowSelectACB(true);
            return;
        } else {
            setShowSelectACB(false);
        }

        let i = 0;
        while (i < cookbooks.length) {
            if (cookbooks[i].id === parseInt(addCookbook)) {
                let myCookbook = cookbooks[i];
                let recipeMembers = [];
                if (recipe.attributes.memberOf) {
                    recipeMembers = recipe.attributes.memberOf;
                }
                if (recipeMembers.includes(myCookbook.id)) {
                    setShowAlreadyAdded(true);
                    return
                } else {
                    setShowAlreadyAdded(false);
                }
                recipeMembers.push(myCookbook.id)

                let tagString = "";
                if (recipe.attributes.recipeTagString) {
                    tagString = recipe.attributes.recipeTagString;
                }

                const newAttributes = recipeAttributes;

                newAttributes["recipeTagString"] = tagString;

                newAttributes["memberOf"] = recipeMembers;

                newAttributes["recipe_authorID"] = recipe.authorID.toString();

                fetch(process.env.REACT_APP_API_PATH + "/posts/" + recipe.id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        authorID: recipe.authorID,
                        content: "Recipe",
                        attributes: newAttributes
                    }),
                })
                    .then((res) => res.json())
                    .then(
                        (result) => {
                            // console.log(result);
                            setShowAdded(true);
                            sleep(4000).then(r => window.location.reload());
                            },
                        (error) => {
                            console.log(error)
                        });
                i = cookbooks.length;
            }
            i++;
        }
    }

    function AddedToCookbook() {
        return (
            <div className="recipe_posted_pop">
                <div>
                    <p className={"a-t-c-recipe-removed-text"}>{translations["add_success"]}
                        <br/>
                        <br/>
                        {translations["disappear_shortly"]}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={"darkend_background"}>
        <div className="unit_conversions_pop">
                <button onClick={handleClose} className="x_button">X</button>
                <br/>
                <div className="conversion_inputs">
                    <form className="unit_conversion_form" onSubmit={handleSubmit}>
                        <br/>
                        <br/>
                        <label>
                            {translations["select_cookbook"]} <span className="asterisk">*</span><br/><br/>
                            <select className={"a-t-c-select"} defaultValue={0} onChange={(e) => setAddCookbook(e.target.value)}>
                                <option id={"cookbook_ph"} value={0} disabled hidden>{translations["choose_here"]}</option>
                                {cookbooks.map((item) => (
                                    <option value={item.id} key={item.id}>{checkForName(item)}</option>
                                ))}
                            </select>
                        </label>
                        <br/>
                        <br/>
                        <button className="convert_button" type="submit">{translations["add_to_cookbook"]}</button>
                    </form>
                </div>
            <center>
                {noneError ? <ErrorPopUp text={translations["no_cookbooks_error"]}/>:null }
            {showAlreadyAdded ? <ErrorPopUp text={translations["already_added_error"]}/> : null}
                {showSelectACB ? <ErrorPopUp text={translations["select_cookbook_error"]}/>: null}
                </center>
            <div id={"conversion_answer"}>
            </div>
            </div>
            {showAdded ? <AddedToCookbook /> : null }
            </div>
    );
};

export default AddToCookbook;