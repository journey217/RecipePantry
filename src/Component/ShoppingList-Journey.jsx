import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS Files/Andrew.css";
import "../CSS Files/Journey.css"
import deleter from "../assets/delete.png";
import { TranslationContext } from "../Translations/Translation";
import {LuPrinter as Printer} from "react-icons/lu";

const ShoppingList = ( ) => {
  const [cart, setCart] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const userID = sessionStorage.getItem("user");
  const userToken = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const translations = useContext(TranslationContext).translations.ShoppingListJourney;
  var canAdd = false;

  useEffect(() => {
    if (!userToken || !userID) {
      navigate("/");
    }

    loadCart();
  }, [userToken, navigate, userID]);


  const loadCart = () => {
    if (sessionStorage.getItem("token") && sessionStorage.getItem('user')) {
      let query = escape('{"path": "authorID", "equals":"' + userID + '"}');
      let url = process.env.REACT_APP_API_PATH + "/posts?attributes=" + query;

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
              setCart(result[0]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }
  };

  const deleteIngredient = (input) => {
    setError(""); // new - workaround
    let postID = input.text;
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
        .then((result) => {
          loadCart();
        })
        .catch((error) => {
          console.log("error!" + error);
        })
  };

  const DeleteButton = (text) => {
    return (
        <img src={deleter} className="balete" alt={translations["delete_ingredient"]} onClick={() => deleteIngredient(text)} draggable="false"/>
    );
  }

  const adder = (input) => {
    let inList = false;
    let postID;
    let gredient;
    let thisCount;
    setError(""); // new - workaround
    if (!input.text) {
      postID = input.id;
      inList = true;
      gredient = input.attributes.ingredient;
      thisCount = input.attributes.count;
      let field = document.getElementById("txtbox");
      field.value = '';
    } else {
      postID = input.text.id;
      gredient = input.text.attributes.ingredient;
      thisCount = input.text.attributes.count;
    }
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        attributes: {"authorID": sessionStorage.getItem("user"), "ingredient": gredient, "count": thisCount + 1}
      }),
    })
        .then((res) => res.json())
        .then((result) => {
          setIngredient(''); // i think i wrote this as a kind of workaround? don't remember
          loadCart();
        })
  };

  const minuser = (input) => {
    let postID = input.text.id;
    if (input.text.attributes.count <= 1) {
      deleteIngredient({text: postID});
      // setError("'"+input.text.attributes.ingredient+"'" + " count must be >=1");
      return;
    }
    if (input.text.attributes.count > 1) {
      fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          attributes: {
            "authorID": sessionStorage.getItem("user"),
            "ingredient": input.text.attributes.ingredient,
            "count": input.text.attributes.count - 1
          }
        }),
      })
          .then((res) => res.json())
          .then((result) => {
            //console.log(result.Status);
            loadCart();
          })
    } else {
      fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          attributes: {
            "authorID": sessionStorage.getItem("user"),
            "ingredient": input.text.attributes.ingredient,
            "count": 0/*input.attributes.count++*/
          }
        }),
      })
          .then((res) => res.json())
          .then((result) => {
            //console.log(result.Status);
            loadCart();
          })
    }
  };

  const AddButton = (text) => {
    return (
        <button className="cntrBtnAdd" onClick={() => adder(text)}>+</button>
    )
  }

  const SubButton = (text) => {
    return (
        <button className="cntrBtnSub" onClick={() => minuser(text)}>-</button>
    )
  }

  const greatJob = (event) => {
    event.preventDefault();

    setError(""); // new - workaround

    if (canAdd !== true) return;
    canAdd = false;

    let field = document.getElementById("txtbox");
    let item = field.value;

    let inCart = false;
    let doubled;

    // if (item.length > 20) {
    //   setError("Please enter 20 or less characters.")
    //   // Journey mentioned setting max in input field - might be better idea
    //   // setIngredient(""); // commented out to allow user to self-correct
    //   return;
    // }

    if (item.trim().length === 0) {
      setError(translations["no_input_error"]);
      setIngredient("");
      return;
    }

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].attributes.ingredient.toLowerCase() === item.toLowerCase()) {
        // console.log("caught double");
        inCart = true;
        doubled = cart[i];
      }
    }

    if (inCart === false) {
      setCart(cart => [...cart, item]);

      fetch(process.env.REACT_APP_API_PATH + "/posts", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          authorID: sessionStorage.getItem("user"),
          content: "List Item",
          attributes: {"authorID": sessionStorage.getItem("user"), "ingredient": ingredient, "count": 1}
        }),
      })
          .then((res) => res.json())
          .then((result) => {
                // console.log(result);
                setIngredient("");
                loadCart();
              },
              (error) => {
                console.log(error);
              })
    } else {
      // console.log(doubled);
      adder(doubled);
    }
  };

  function getIngredient(item) {
    if (item.attributes) {
      if (item.attributes.ingredient) {
        return ' ' + item.attributes.ingredient;
      }
    }
  }

  function getCount(item) {
    if (item.attributes) {
      if (item.attributes.count || item.attributes.count === 0) {
        return item.attributes.count;
      }
    }
  }

  function ErrorPopUp({text}) {
    // i want this to be going away after some time - still displays when incrementing, etc.
    return (
        <div>
          <p className="errorText">{text}</p>
        </div>
    );
  }

  function enterHandler(e) {
    if (e.keyCode === 13) {
      canAdd = true;
      greatJob(e);
    }
  }

  function addBtnFix(e) {
    canAdd = true;
    greatJob(e);
  }

  const PrintRecipe = () => {
        return (
            <div>
                <div className="print-header">
                    <h2>{translations["shopping_list"]}</h2>
                </div>
              <br/>
                <div className="print-ingredients">
                    {cart.map((ingredient, index) => (
                        <div key={index} className={"print_shopping_list"}>
                          <div className={"inline_items"}>
                            <input className={"shopping_list_box"} type={"checkbox"} />
                            <div className={"item_count2"}>{getCount(ingredient)}</div>
                            <div onClick={e => navigate()} className={"groceryItem"}>{" " + getIngredient(ingredient)}</div>
                          </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handlePrint = (e) => {
        window.print();
    }

  return (
      <div>
        <div className="print-area2"><PrintRecipe/></div>
        <br/> <br/>
        <center>
          <div className="listRectangle">
            <h1 style={{textAlign: "center", marginTop: "-5px", fontSize: "40px"}}>{translations["shopping_list"]}<Printer onClick={handlePrint} className="print-button"/></h1>
            <br/>
            {error ? <ErrorPopUp text={error}/> : null}
            <div className={"shopping_list_input_button_container"}>
              <input maxLength={40} id="txtbox" className="bio-input ingredientInput" value={ingredient}
                     placeholder={translations["ingredient_input_placeholder"]}
                     onChange={(e) => setIngredient(e.target.value)}
                     onKeyDown={(e) => enterHandler(e)}>
              </input>
              <br/>
              <button className="otherBtn" onClick={(e) => addBtnFix(e)}>{translations["add"]}</button>
            </div>
            <center>
              <div className={"grocery_list_container"}>
                <br/>
                {cart.length === 0 ? <p style={{textAlign: 'center'}}>{translations["no_ingredients"]}</p> : null}
                <div className="groceryList">
                  {cart.map((item, index) => (
                      <div key={index} className={"grocery_item_container"}>
                        <div className={"count_name_buttons_container"}>
                          <div className={"thirds_container"}>
                            <div className={"count_ing_container"}>
                              <div className={"item_count"}>{getCount(item)}</div>
                              <div onClick={e => navigate()} className={"groceryItem"}>{" " + getIngredient(item)}</div>
                            </div>
                          </div>
                          <div className={"thirds_container"}>
                          </div>
                          <div className={"thirds_container"}>
                            <div className={"add_sub_buttons"}>
                              <div className={"a_s_button_itm"}>
                                <AddButton text={item}/>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <SubButton text={item}/>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <DeleteButton text={item.id}/>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={"count_name_buttons_container_mobile"}>
                          <div className={"center_div"}>
                            <div className={"count_ing_container"}>
                            <div className={"item_count"}>{getCount(item)}</div>
                            <div onClick={e => navigate()} className={"groceryItem"}>{" " + getIngredient(item)}</div>
                          </div>
                          </div>
                          <div className={"add_sub_buttons"}>
                            <div className={"a_s_button_itm"}>
                              <AddButton text={item}/>
                            </div>
                            <div className={"a_s_button_itm"}>
                              <SubButton text={item}/>
                            </div>
                            <div className={"a_s_button_itm"}>
                              <DeleteButton text={item.id}/>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </center>
          </div>
        </center>
      </div>
  );
};

export default ShoppingList;