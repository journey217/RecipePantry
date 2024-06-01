import React from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import siteTitleTagline from "../assets/RP_Header_with_tagline.png";
import siteTitle from "../assets/RP_Header.png";
import siteIcon from "../assets/RP_Logo.png";
import convertModal from "../assets/convert-modal.png";
import created from "../assets/created.png";
import deletemodal from "../assets/delete-modal.png";
import addtomodal from "../assets/add-to-modal.png";
import deskNav from "../assets/deskNav.png";
import mobNav from "../assets/mobNav.png";
import dropdown from "../assets/dropdown.png";
import tabsContainer from "../assets/tabs_container.png";

const TiffanyStyleguide = () => {
  //journey error code
  function ErrorPopUp({ text }) {
    return (
      <div>
        <p className="errorText">{text}</p>
      </div>
    );
  }
  return (
    <div style={{ margin: "2rem" }}>
      <h2>General Site Colors</h2>
      <div
        style={{
          display: "flex",
          padding: "1rem",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "papayawhip",
              width: "100px",
              height: "100px",
              border: "1px solid black",
            }}
          ></div>
          <p>#FFEFD5</p>
          <p className="small">Background color</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "#CF6E4F",
              width: "100px",
              height: "100px",
              border: "1px solid black",
            }}
          ></div>
          <p>#CF6E4F</p>
          <p className="small">Navbar, buttons</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "#eaa861",
              width: "100px",
              height: "100px",
              border: "1px solid black",
            }}
          ></div>
          <p>#EAA861</p>
          <p className="small">User forms</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "#87cefa",
              width: "100px",
              height: "100px",
              border: "1px solid black",
            }}
          ></div>
          <p>#87CEFA</p>
          <p className="small">User form buttons</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "#4f9bff",
              width: "100px",
              height: "100px",
              border: "1px solid black",
            }}
          ></div>
          <p>#4F9BFF</p>
          <p className="small">Tags</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "green",
              width: "100px",
              height: "100px",
              border: "1px solid black",
            }}
          ></div>
          <p>#00FF00</p>
          <p className="small">Edit buttons</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              backgroundColor: "red",
              width: "100px",
              height: "100px",
              border: "1px solid black",
            }}
          ></div>
          <p>#FF0000</p>
          <p className="small">Delete buttons</p>
        </div>
      </div>
      <br />
      <h2>Fonts</h2>
      <p> Font family: Arial, sans-serif</p>
      <br />
      <h2>Errors</h2>
      <ErrorPopUp text={"Error message example."} />
      <br />
      <h2>Buttons</h2>
      <h3>Login and Registration</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        <input className="submit" type="submit" value="Log in" />
        <input className="submit" type="submit" value="Register" />
        <input className="submit" type="submit" value="Continue" />
        <input className="submit" type="submit" value="Submit" />
        <input className="submit" type="submit" value="Reset Password" />
      </div>
      <h3>Cookbooks and Recipes</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        <button className="sg-recipe-button">Post a Recipe</button>
        <button className="sg-recipe-button">Create a Cookbook</button>
        <button className="sg-recipe-button">Load More</button>
        <button className="sg-recipe-button">Bookmark</button>
        <button className="go_back_button">
          <IoArrowBackCircleSharp /> Back
        </button>
        <button
          className="edit-recipe-button"
          style={{
            backgroundColor: "green",
            color: "white",
            margin: "10px 10px 10px 5px",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#045D05")
          }
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "green")}
        >
          Edit Recipe
        </button>
        <button
          className="edit-recipe-button"
          style={{
            backgroundColor: "green",
            color: "white",
            margin: "10px 10px 10px 5px",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#045D05")
          }
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "green")}
        >
          Edit Cookbook
        </button>
        <button className={"create_conversions_button_2"}>
          Unit Conversions
        </button>
      </div>
      <br />
      <h2>Logos</h2>
      <h3>Logo with Tagline</h3>
      <p>Used in the landing page (login)</p>
      <img
        src={siteTitleTagline}
        alt="Recipe Pantry"
        style={{ height: "5rem" }}
      />
      <h3>Logo</h3>
      <p>Used in the nav bar</p>
      <img src={siteTitle} alt="Recipe Pantry" style={{ height: "5rem" }} />
      <h3>Mini Logo</h3>
      <p>Used in the mobile nav bar and while creating a profile</p>
      <img src={siteIcon} alt="Recipe Pantry" style={{ height: "5rem" }} />
      <br />
      <h2>Nav Bar</h2>
      <h3>Desktop Nav Bar</h3>
      <p>Nav bar that appears on desktop</p>
      <img src={deskNav} alt="Desktop nav bar" style={{ height: "5rem" }} />
      <h3>Mobile Nav Bar</h3>
      <p>Nav bar that appears on mobile</p>
      <img src={mobNav} alt="Mobile nav bar" style={{ height: "5rem" }} />
      <h3>Dropdown Menu</h3>
      <p>Menu items when hovering over hamburger button</p>
      <img src={dropdown} alt="Dropdown menu" style={{ height: "200px" }} />
      <br />
      <h2>Modals</h2>
      <h3>Unit Conversions Modal</h3>
      <p>Modal that appears when a user wants to convert units</p>
      <img
        src={convertModal}
        alt="Unit Conversions Modal"
        style={{ height: "20rem", border: "2px solid black" }}
      />
      <h3>Created Recipe/Cookbook Modal</h3>
      <p>Modal that appears after creating a recipe or cookbook</p>
      <img
        src={created}
        alt="Created Recipe/Cookbook Modal"
        style={{ height: "20rem", border: "2px solid black" }}
      />
      <h3>Delete Account Modal</h3>
      <p>Modal that appears when a user tries to delete their account</p>
      <img
        src={deletemodal}
        alt="Delete Account Modal"
        style={{ height: "20rem", border: "2px solid black" }}
      />
      <h3>Add to Cookbook Modal</h3>
      <p>Modal that appears when a user wants to add a recipe to a cookbook</p>
      <img
        src={addtomodal}
        alt="Add to Cookbook Modal"
        style={{ height: "20rem", border: "2px solid black" }}
      />
      <h2>Tabs Container</h2>
      <h3>Tabs Container Example</h3>
      <img src={tabsContainer} alt="recipes and cookbooks tabs container from profile" draggable="false" style={{width:'80vw'}}></img>
      <h3>JSX Code for Tabs Container</h3>
      <div className={"code_box_container"}>
        <pre>
          <code
            className={"css_code_box"}
          >{`const [activeTab, setActiveTab] = useState("recipes");

const handleTabClick = (tabId) => {
            setActiveTab(tabId);
};

function TabButton({ tabId, activeTab, onClick, children }) {
            let isActive = tabId === activeTab;
            return (
                <button className={\`tab-btn-\${tabId} \${
            isActive ? "active" : ""
          }\`} onClick={() => onClick(tabId)}>
                {children}
                </button>
            );
}

<div id="posts-container">
<div className="tabs">
                <TabButton
                tabId="recipes"
                activeTab={activeTab}
                onClick={handleTabClick}
                >
                Recipes
                </TabButton>
                <TabButton
                tabId="cookbooks"
                activeTab={activeTab}
                onClick={handleTabClick}
                >
                Cookbooks
                </TabButton>
</div>
<div className="tab-content" style={{ display: activeTab === "recipes" ? "block" : "none" }}>
                <MyRecipes />
</div>
<div className="tab-content" style={{ display: activeTab === "cookbooks" ? "block" : "none" }}>
                <MyCookbooks />
</div>
</div>`}</code>
        </pre>
      </div>
      <h3>CSS Code for Tabs Container</h3>
      <div className={"code_box_container"}>
        <pre>
          <code className={"css_code_box"}>
            {`.tabs button{
            width: 50%;
            font-size: 1.2rem;
            background-color: white;
            padding: 1rem;
            border: none;
            border-bottom: 0.5rem solid rgb(208, 208, 208);
}
          
.tab-btn-recipes {
            border-top-left-radius: 3rem;
}
          
.tab-btn-cookbooks {
            border-top-right-radius: 3rem;
}
          
.tabs button:hover{
            filter: brightness(90%);
            cursor: pointer;
}
          
.tabs button.active {
            border-color: #CF6E4F;
}`}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default TiffanyStyleguide;
