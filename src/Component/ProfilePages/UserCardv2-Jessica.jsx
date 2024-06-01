import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../../CSS Files/Jessica.css";
import defaultUser from "../../assets/default_user.png"

import FollowButton from "../FriendsPages/FollowButton-Journey";
import { TranslationContext } from "../../Translations/Translation";

const UserCard = (props) => {
  const translations = useContext(TranslationContext).translations.ProfilePages.UserCardJessica;
  if (!props.followbutton) {
    // if we're just viewing our own profile
    return (
      <div id="user-card-wrapper">
        <div id="profile-pic-wrapper">
          <div id="profile-pic">
            <img src={props.picture} alt={translations["profile_pic"]} draggable="false"/>
          </div>
        </div>
        <div id="user-card-text-wrapper">
          <div id="display-name-wrapper">
            <h1>{props.displayName || translations["user"]}</h1>
          </div>
          <div id="profile-username-wrapper">
            <h2>{"@" + (props.username || translations["na"])}</h2>
          </div>
          <div id="profile-bio-wrapper">
            <p>{props.bio || translations["no_bio_set"]}</p>
          </div>
          <div id="friends-wrapper">
            <div className="friends-count">
              <Link to="/followers" className="friend-count">
                <b>{props.followers}</b> {translations["followers"]}{" "}
              </Link>
            </div>
            <div className="friends-count">
              <Link to="/following" className="friend-count">
                <b>{props.following}</b> {translations["following"]}{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // if we're viewing another user's profile
    return (
      <div id="user-card-wrapper">
        <div id="profile-pic-wrapper">
          <div id="profile-pic">
            <img src={props.picture || defaultUser} alt={translations["profile_pic"]} draggable="false"/>
          </div>
        </div>
        <div id="user-card-text-wrapper">
          <div id="user-card-heading">
            <div id="display-name-wrapper">
              <h1>{props.displayName || translations["user"]}</h1>
            </div>
            <div id="follow-button-wrapper" className={"center_div"}>
              <FollowButton/>
            </div>
          </div>
          <div id="profile-username-wrapper">
            <h2>{"@" + (props.username || translations["na"])}</h2>
          </div>
          <div id="profile-bio-wrapper">
            <p>{props.bio || translations["no_bio_set"]}</p>
          </div>
          <div id="friends-wrapper">
            <div className="friends-count">
              <Link to={"/followers/"+props.id} className="friend-count">
                <b>{props.followers}</b> {translations["followers"]}{" "}
              </Link>
            </div>
            <div className="friends-count">
              <Link to={"/following/"+props.id} className="friend-count">
                <b>{props.following}</b> {translations["following"]}{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default UserCard;
