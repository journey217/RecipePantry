import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import "../../CSS Files/Tiffany.css";
import defaultPfp from "../../assets/default_user.png";
import UserCard from "./UserCard";
import FollowToggle from "../../Component/FriendsPages/FollowToggle-Jessica";
import FollowButton from "../../Component/FriendsPages/FollowButton-Journey";

const ShowProfile2 = (props) => {

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [picture, setPicture] = useState(defaultPfp);
    const [cuisine, setCuisine] = useState([]);
    const [pref, setPref] = useState([]);
    const [followers, setFollowers] = useState("");
    const [following, setFollowing] = useState("");
    const [userID, setUserID] = useState(0);
    const [connectionID, setConnectionID] = useState(0);
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

        const splits = window.location.href.split('/');
        const user_id = splits[splits.length - 1];

        setUserID(user_id);

        fetch(
          `${process.env.REACT_APP_API_PATH}/users/` +user_id,
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
                if (result && result.attributes) {
                    const { username, displayName, bio, picture, CuisineCuisine, ChoosePreferences } = result.attributes;
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
        fetch( //followers
          `${process.env.REACT_APP_API_PATH}/connections?toUserID=`+user_id,
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
              setFollowers(result[1])
            })
            .catch((error) => {
                console.error("Error fetching following data:", error);
            });

            fetch( //following
          `${process.env.REACT_APP_API_PATH}/connections?fromUserID=`+user_id,
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
                    <h4 className={"pick-a-cuisine-title"}>{title}</h4>
                    {!showNoneCuisine ? <Tags input={input}/>: <p className={"pick-a-cuisine-none"}>No Cuisine preferences.</p>}
                </div>
            );
        } else {
            return (
                <div className={"pick-a-cuisine-box-profile br-margin-bottom"}>
                    <h4 className={"pick-a-cuisine-title"}>{title}</h4>
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
      <div>
      <h3 className="page_title margin-top">{displayName}'s Profile</h3>

      <div className="split-page">
          <div className='user-card'>
            <img className='profile-pic' src={picture} alt="profile pic" draggable="false"/>
            <p className='full-name'>{displayName|| "User"}</p>
            <p className='username'>{'@' + (username || "N/A")}</p>
            <p className='bio'>{bio || ""}</p>


          <div className="profile-followers">
            <Link to={"/followers/"+userID} className="profile-follow-button">{followers} Followers </Link>
            <Link to={"/following/"+userID} className="profile-follow-button">{following} Following </Link>

          </div>
        </div>

        <div className="profile-right">
            <PickACuisine title={"Cuisine Preferences"} input={cuisine} type={"cuisine"}/>
            <PickACuisine title={"Dietary Preferences"} input={pref} type={"dietary"}/>
            <FollowButton/>
          {/*<p className='cuisine-display'>Cuisine Preferences: {cuisine}</p>*/}
          {/*<p className='preference-display'>Diet Preferences: {pref}</p>*/}
        <div className="buttons-box">
          <Link to={"/cookbooks/"+userID}><button className="profile-buttons">View Cookbooks</button></Link>
          <Link to={"/recipes/"+userID}><button className="profile-buttons">View Recipes</button></Link>
        </div>

      </div>
      </div>
      </div>
    );
};

export default ShowProfile2;