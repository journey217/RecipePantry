import React from 'react';
import "../../CSS Files/Andrew.css";
import error_img from "../../assets/no_ing_error.png"
import {LuPrinter as Printer} from "react-icons/lu";
import deleter from "../../assets/delete.png";

/*const list = ["Apples", "Bananas", "Pork Chops"];

function exampleList () {
    return (
        <div className=""></div>
    );
}*/

const ShoppingListStyleguide = () => {
    return (
        <div>
            <h2>Shopping List:</h2>
            <h3>Example shopping list:</h3>
            <div className="listRectangle">
            <h1 style={{textAlign: "center", marginTop: "-5px", fontSize: "40px"}}>Shopping List<Printer className="print-button"/></h1>
            <br/>
            <div className={"shopping_list_input_button_container"}>
              <input maxLength={40} id="txtbox" className="bio-input ingredientInput" placeholder={'Ex: Green onion'}>
              </input>
              <br/>
              <button className="otherBtn">Add</button>
            </div>
            <center>
              <div className={"grocery_list_container"}>
                <br/>
                <div className="groceryList">
                  {[{ing: "Hotdog", "count": 2}, {ing: "Ketchup", count: 3} ].map((item, index) => (
                      <div key={index} className={"grocery_item_container"}>
                        <div className={"count_name_buttons_container"}>
                          <div className={"thirds_container"}>
                            <div className={"count_ing_container"}>
                              <div className={"item_count"}>{item.count}</div>
                              <div className={"groceryItem"}>{" " + item.ing}</div>
                            </div>
                          </div>
                          <div className={"thirds_container"}>
                          </div>
                          <div className={"thirds_container"}>
                            <div className={"add_sub_buttons"}>
                              <div className={"a_s_button_itm"}>
                                <button className="cntrBtnAdd">+</button>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <button className="cntrBtnSub">-</button>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <img src={deleter} className="balete" alt="Delete Ingred." draggable="false"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </center>
          </div>
            <h3>Result of clicking "+" on first item:</h3>
                        <div className="listRectangle">
            <h1 style={{textAlign: "center", marginTop: "-5px", fontSize: "40px"}}>Shopping List<Printer className="print-button"/></h1>
            <br/>
            <div className={"shopping_list_input_button_container"}>
              <input maxLength={40} id="txtbox" className="bio-input ingredientInput" placeholder={'Ex: Green onion'}>
              </input>
              <br/>
              <button className="otherBtn">Add</button>
            </div>
            <center>
              <div className={"grocery_list_container"}>
                <br/>
                <div className="groceryList">
                  {[{ing: "Hotdog", "count": 3}, {ing: "Ketchup", count: 3} ].map((item, index) => (
                      <div key={index} className={"grocery_item_container"}>
                        <div className={"count_name_buttons_container"}>
                          <div className={"thirds_container"}>
                            <div className={"count_ing_container"}>
                              <div className={"item_count"}>{item.count}</div>
                              <div className={"groceryItem"}>{" " + item.ing}</div>
                            </div>
                          </div>
                          <div className={"thirds_container"}>
                          </div>
                          <div className={"thirds_container"}>
                            <div className={"add_sub_buttons"}>
                              <div className={"a_s_button_itm"}>
                                <button className="cntrBtnAdd">+</button>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <button className="cntrBtnSub">-</button>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <img src={deleter} className="balete" alt="Delete Ingred." draggable="false"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </center>
          </div>
            <h3>Result of clicking "-" on second item:</h3>
                        <div className="listRectangle">
            <h1 style={{textAlign: "center", marginTop: "-5px", fontSize: "40px"}}>Shopping List<Printer className="print-button"/></h1>
            <br/>
            <div className={"shopping_list_input_button_container"}>
              <input maxLength={40} id="txtbox" className="bio-input ingredientInput" placeholder={'Ex: Green onion'}>
              </input>
              <br/>
              <button className="otherBtn">Add</button>
            </div>
            <center>
              <div className={"grocery_list_container"}>
                <br/>
                <div className="groceryList">
                  {[{ing: "Hotdog", "count": 3}, {ing: "Ketchup", count: 2} ].map((item, index) => (
                      <div key={index} className={"grocery_item_container"}>
                        <div className={"count_name_buttons_container"}>
                          <div className={"thirds_container"}>
                            <div className={"count_ing_container"}>
                              <div className={"item_count"}>{item.count}</div>
                              <div className={"groceryItem"}>{" " + item.ing}</div>
                            </div>
                          </div>
                          <div className={"thirds_container"}>
                          </div>
                          <div className={"thirds_container"}>
                            <div className={"add_sub_buttons"}>
                              <div className={"a_s_button_itm"}>
                                <button className="cntrBtnAdd">+</button>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <button className="cntrBtnSub">-</button>
                              </div>
                              <div className={"a_s_button_itm"}>
                                <img src={deleter} className="balete" alt="Delete Ingred." draggable="false"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </center>
          </div>
            <h3>Example error - Trying to add an empty string to the list:</h3>
            <img src={error_img} alt={"Empty string error image"}/>
            <h3>CSS snippet - how the list is styled:</h3>
            <div className={"code_box_container"}>
                <pre>
                    <code className={"css_code_box"}>
                        {
                            ".grocery_item_container {\n" +
                            "  border-radius: 20px;\n" +
                            "  background-color: papayawhip;\n" +
                            "  border: 1px solid black;  font-size: 20px;\n" +
                            "  margin-bottom: 30px;\n" +
                            "}\n" +
                            "\n" +
                            ".count_ing_container {\n" +
                            "  display: flex;\n" +
                            "  flex-direction: row;\n" +
                            "}\n" +
                            "\n" +
                            ".item_count {\n" +
                            "  margin-left: 15px;\n" +
                            "  margin-top: 15px;\n" +
                            "  font-size: 25px;\n" +
                            "  font-weight: bold;\n" +
                            "  margin-right: 20px;\n" +
                            "}\n" +
                            "\n" +
                            ".add_sub_buttons {\n" +
                            "  margin-top: 10px;\n" +
                            "  margin-inline: auto;\n" +
                            "  display: flex;\n" +
                            "  flex-direction: row;\n" +
                            "  justify-content: space-evenly;\n" +
                            "  width: 200px;\n" +
                            "}\n" +
                            "\n" +
                            ".a_s_button_itm {\n" +
                            "  margin-top: 5px;\n" +
                            "}\n" +
                            "\n" +
                            ".print_shopping_list {\n" +
                            "  width: 100vw;\n" +
                            "}\n" +
                            "\n" +
                            ".shopping_list_box {\n" +
                            "  margin-top: 15px;\n" +
                            "  width: 30px;\n" +
                            "  height: 30px;\n" +
                            "}\n" +
                            "\n" +
                            ".inline_items {\n" +
                            "  display: flex;\n" +
                            "  flex-direction: row;\n" +
                            "}\n\n" +
                            ".groceryItem {\n" +
                            "    margin-top: 20px;\n" +
                            "    height: fit-content;\n" +
                            "    max-width: 250px;\n" +
                            "    width: fit-content;\n" +
                            "    overflow-wrap: break-word;\n" +
                            "    margin-bottom: 20px;\n" +
                            "    margin-right: 20px;\n" +
                            "  }\n" +
                            "\n" +
                            "  .shopping_list_input_button_container {\n" +
                            "    width: 80%;\n" +
                            "    display: flex;\n" +
                            "    flex-direction: row;\n" +
                            "  }\n" +
                            "\n" +
                            "  .ingredientInput {\n" +
                            "    border: 1px solid black;\n" +
                            "    border-radius: 20px;\n" +
                            "    margin-left: 20px;\n" +
                            "    height: 35px;\n" +
                            "    width: 50vw;\n" +
                            "    font-size: 16px;\n" +
                            "  }\n" +
                            "\n" +
                            "  .otherBtn {\n" +
                            "    margin-left: 20px;\n" +
                            "    height: auto;\n" +
                            "    width: 75px;\n" +
                            "    padding: .5rem;\n" +
                            "    text-align: center;\n" +
                            "    font-size: 1.5rem;\n" +
                            "    cursor: pointer;\n" +
                            "    background-color: #87cefa;\n" +
                            "    border: 1px solid black;\n" +
                            "    border-radius: 20px;\n" +
                            "  }\n" +
                            "\n" +
                            "  .count_name_buttons_container_mobile {\n" +
                            "    display: none;\n" +
                            "  }\n" +
                            "\n" +
                            "  .count_name_buttons_container {\n" +
                            "    width: 95%;\n" +
                            "    display: flex;\n" +
                            "    flex-direction: row;\n" +
                            "  }\n" +
                            "\n" +
                            "  .grocery_item_container {\n" +
                            "    margin-inline: auto;\n" +
                            "    display: flex;\n" +
                            "    flex-direction: row;\n" +
                            "    flex-wrap: wrap;\n" +
                            "  }\n" +
                            "\n" +
                            "  .shopping_list_input_button_container {\n" +
                            "    width: 80%;\n" +
                            "    display: flex;\n" +
                            "    flex-direction: row;\n" +
                            "  }\n" +
                            "\n" +
                            "  .center_vertically_container {\n" +
                            "    margin-inline: auto;\n" +
                            "    width: fit-content;\n" +
                            "    position: relative;\n" +
                            "  }\n" +
                            "\n" +
                            "  .shopping_list_button_container {\n" +
                            "    margin-top: 0;\n" +
                            "    display: flex;\n" +
                            "    flex-direction: row;\n" +
                            "  }\n" +
                            "\n" +
                            "  .count_name_buttons_container {\n" +
                            "    margin-inline: auto;\n" +
                            "    padding: 10px;\n" +
                            "  }\n" +
                            "\n" +
                            "  .thirds_container {\n" +
                            "    position: relative;\n" +
                            "    width: 33%;\n" +
                            "  }"
                        }
                    </code>
                </pre>
            </div>
        </div>
    )
};

export default ShoppingListStyleguide;