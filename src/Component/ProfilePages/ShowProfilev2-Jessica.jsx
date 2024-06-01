import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../CSS Files/Jessica.css";
import defaultPfp from "../../assets/default_user.png";
import UserCard from "./UserCardv2-Jessica";
import { FaPencilAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import MyRecipes from "../RecipePostPages/MyRecipesProfile-Jessica";
import MyCookbooks from "../CookbookPages/MyCookbooksProfile-Jessica";
import { TranslationContext } from "../../Translations/Translation";

const ShowProfile = (props) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [picture, setPicture] = useState(defaultPfp);
  const [cuisine, setCuisine] = useState([]);
  const [pref, setPref] = useState([]);
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [showNoneCuisine, setShowNoneCuisine] = useState(false);
  const [showNonePref, setShowNonePref] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("recipes");
  const translations = useContext(TranslationContext).translations.ProfilePages.ShowProfileJessica;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  function escapeHtml(unsafe) {
    if (unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "");
    } else {
      return "";
    }
  }

  //fetching existing data
  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/");
    }

    fetch(
      `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem(
        "user"
      )}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        // console.log("Fetched user data:", result); // Log the entire fetched result

        if (result && result.attributes) {
          const {
            username,
            displayName,
            bio,
            picture,
            CuisineCuisine,
            ChoosePreferences,
          } = result.attributes;
          // console.log("Attributes:", result.attributes); // Log the attributes object

          // Update states
          setUsername(escapeHtml(username) || translations["na"]);
          setDisplayName(escapeHtml(displayName) || translations["user"]);
          setBio(escapeHtml(bio) || "");
          setPicture(picture || defaultPfp);
          let tags = CuisineCuisine;
          if (tags) {
            let split_tags = tags.split(",");
            let split_tags_stripped = split_tags.map((s_tag) =>
              escapeHtml(s_tag.replace(" ", ""))
            );
            setCuisine(split_tags_stripped);
          } else {
            setShowNoneCuisine(true);
          }
          let tags1 = ChoosePreferences;
          if (tags1) {
            let split_tags1 = tags1.split(",");
            let split_tags_stripped1 = split_tags1.map((s_tag1) =>
              escapeHtml(s_tag1.replace(" ", ""))
            );
            setPref(split_tags_stripped1);
          } else {
            setShowNonePref(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    fetch(
      //followers
      `${
        process.env.REACT_APP_API_PATH
      }/connections?toUserID=${sessionStorage.getItem("user")}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        // console.log("follower count"+ result[1])
        setFollowers(result[1]);
      })
      .catch((error) => {
        console.error("Error fetching following data:", error);
      });

    fetch(
      //following
      `${
        process.env.REACT_APP_API_PATH
      }/connections?fromUserID=${sessionStorage.getItem("user")}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        // console.log("following count"+ result[1])
        setFollowing(result[1]);
      })
      .catch((error) => {
        console.error("Error fetching following data:", error);
      });
  }, [location]);

  function PickACuisine({ title, input, type }) {
    if (type === "cuisine") {
      return (
        <div className="profile-element preferences-wrapper">
          <div className="preference-wrapper preference-type">
            <h4 className="preference-type-h3">
              {title}{" "}
              <FaPencil
                className="pencil-icon"
                onClick={() => navigate("/edit-cuisines")}
              />
            </h4>
          </div>
          <div className="preference-wrapper preference-tags">
            <div className="gradient-overlay"></div>
            {!showNoneCuisine ? (
              <Tags input={input} />
            ) : (

              <p className="nopref-tag">{translations["no_cuisine_pref"]}</p>

            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="profile-element preferences-wrapper">

          <div className="preference-wrapper preference-type">
            <h4 className="preference-type-h3">
              {title}{" "}
              <FaPencil
                className={"pencil-icon"}
                onClick={() => navigate("/edit-diet")}
              />
            </h4>
          </div>
          <div className="preference-wrapper preference-tags">
            {!showNonePref ? (
              <Tags input={input} />
            ) : (

              <p className={"nopref-tag"}>{translations["no_dietary_pref"]}</p>

            )}
          </div>
        </div>
      );
    }
  }

  function Tags({ input }) {
    for (let i = 0; i < input.length; i++) {
      input[i] = input[i].replace(" ", "");
    }
    return (
      <div className={"tags-wrapper"}>
        {input.map((item, index) => (
          <div
            key={index}
            className="tag-container"
            onClick={() => navigate("/cuisines?=" + item)}
          >
            <p className="tag-text">#{translations[item.toLowerCase()]}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id="profile-container">
      <div className="profile-element user-card-container">
        <UserCard
          username={username}
          displayName={displayName}
          bio={bio}
          picture={picture}
          followers={followers}
          following={following}
        />
      </div>
      <div id="preferences-container">
        <PickACuisine
          title={translations["cuisine_pref"]}
          input={cuisine}
          type={"cuisine"}
        />
        <PickACuisine
          title={translations["dietary_pref"]}
          input={pref}
          type={"dietary"}
        />
      </div>
      <div id="posts-container">
        <div className="tabs">
          <TabButton
            tabId="recipes"
            activeTab={activeTab}
            onClick={handleTabClick}
          >
            {translations["recipes"]}
          </TabButton>
          <TabButton
            tabId="cookbooks"
            activeTab={activeTab}
            onClick={handleTabClick}
          >
            {translations["cookbooks"]}
          </TabButton>
        </div>
        <div
          className="tab-content"
          style={{ display: activeTab === "recipes" ? "block" : "none" }}
        >
          <MyRecipes />
        </div>
        <div
          className="tab-content"
          style={{ display: activeTab === "cookbooks" ? "block" : "none" }}
        >
          <MyCookbooks />
        </div>
      </div>
    </div>
  );
};

function TabButton({ tabId, activeTab, onClick, children }) {
  let isActive = tabId === activeTab;
  return (
    <button
      className={`tab-btn-${tabId} ${isActive ? 'active' : ''}`}
      onClick={() => onClick(tabId)}
    >
      {children}
    </button>
  );
}

export default ShowProfile;
