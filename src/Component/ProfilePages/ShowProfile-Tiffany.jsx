import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import "../../CSS Files/Tiffany.css";
import defaultPfp from "../../assets/default_user.png";
import UserCard from "./UserCard";
import { FaPencilAlt } from "react-icons/fa";
import {FaPencil} from "react-icons/fa6";

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

    function escapeHtml(unsafe) {
        if (unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "");
        }
        else {
            return ""
        }
    }


    //fetching existing data
    useEffect(() => {
        if (!sessionStorage.getItem("user")) {
            navigate('/');
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
                    const { username, displayName, bio, picture, CuisineCuisine, ChoosePreferences } = result.attributes;
                    // console.log("Attributes:", result.attributes); // Log the attributes object

                    // Update states
                    setUsername(escapeHtml(username) || "N/A");
                    setDisplayName(escapeHtml(displayName) || "User");
                    setBio(escapeHtml(bio) || "");
                    setPicture(picture || defaultPfp);
                    let tags = CuisineCuisine;
                    if (tags) {
                        let split_tags = tags.split(",");
                        let split_tags_stripped = split_tags.map((s_tag) => escapeHtml(s_tag.replace(" ", "")));
                        setCuisine(split_tags_stripped);
                    } else {
                        setShowNoneCuisine(true);
                    }
                    let tags1 = ChoosePreferences;
                    if (tags1) {
                        let split_tags1 = tags1.split(",");
                        let split_tags_stripped1 = split_tags1.map((s_tag1) => escapeHtml(s_tag1.replace(" ", "")));
                        setPref(split_tags_stripped1);
                    } else {
                        setShowNonePref(true);
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });

                // if the attributes already exists and they are stored, set the states to those attributes
              // so that nothing gets overwritten
        //      setUsername(result.attributes?.username || ""); // if this is empty it could crsh so add ? after attributes to handle
        //        setDisplayName(`${result.attributes.firstName} ${result.attributes.lastName}`.trim() || "User");
        //      setBio(result.attributes?.bio || "");
        //      setPicture(result.attributes.picture || "");
        //      setCuisine(result.attributes.CuisineCuisine || "");
        //      setPref(result.attributes?.ChoosePreferences || "");
        //    }

        fetch( //followers
          `${process.env.REACT_APP_API_PATH}/connections?toUserID=${sessionStorage.getItem("user")}`,
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
              setFollowers(result[1])


            })
            .catch((error) => {
                console.error("Error fetching following data:", error);
            });

            fetch( //following
          `${process.env.REACT_APP_API_PATH}/connections?fromUserID=${sessionStorage.getItem("user")}`,
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
              setFollowing(result[1])


            })
            .catch((error) => {
                console.error("Error fetching following data:", error);
            });


          }, [location]);

    function PickACuisine ({ title, input, type }) {
        if (type === "cuisine") {
            return (
                <div className={"pick-a-cuisine-box-profile br-margin-bottom"}>
                    <h4 className={"pick-a-cuisine-title"}>{title} <FaPencil className={"pencil-icon"} onClick={() => navigate("/edit-cuisines")}/></h4>

                    {!showNoneCuisine ? <Tags input={input}/>: <p className={"pick-a-cuisine-none"}>No Cuisine preferences.</p>}
                </div>
            );
        } else {
            return (
                <div className={"pick-a-cuisine-box-profile br-margin-bottom"}>
                    <h4 className={"pick-a-cuisine-title"}>{title} <FaPencil className={"pencil-icon"} onClick={() => navigate("/edit-diet")}/></h4>
                    {!showNonePref ? <Tags input={input}/>: <p className={"pick-a-cuisine-none"}>No Dietary preferences.</p>}
                </div>
            );
        }
    }

    function Tags({input}) {
        for (let i = 0; i < input.length; i++) {
            input[i] = input[i].replace(" ", "");
        }
        return (
            <div className={"pick-a-cuisine-box-tags-profile"}>
                {input.map((item, index) => (
                    <div key={index} className="pick-a-cuisine-tag-container" onClick={() => navigate('/cuisines?=' + item)}>
                        <p className="display_recipe_tag_text">#{item}</p>
                    </div>
                ))}
            </div>
        );
    }



    return(
      <>
      <h3 className="page_title margin-top">My Profile</h3>

      <div className="split-page">

          <UserCard
              username={username}
              displayName={displayName}
              bio={bio}
              picture={picture}
              followers={followers}
              following={following}

          />

        <div className="profile-right">
           <PickACuisine title={"Cuisine Preferences"} input={cuisine} type={"cuisine"}/>
            <PickACuisine title={"Dietary Preferences"} input={pref} type={"dietary"}/>
          <div className="buttons-box"> 
            <Link to="/my-cookbooks"><button className="profile-buttons">View Cookbooks</button></Link>
            <Link to="/my-recipes"><button className="profile-buttons">View Recipes</button></Link>
          </div>
        </div>
      </div>
      </>
    );
};

export default ShowProfile;