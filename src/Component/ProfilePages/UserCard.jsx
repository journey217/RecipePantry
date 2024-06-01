import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../CSS Files/Tiffany.css";
import defaultPfp from "../../assets/default_user.png";
import ShowProfile from "./ShowProfile-Tiffany";

const UserCard = (props) => {


    return(
        <div className='user-card'>
            <img className='profile-pic' src={props.picture || defaultPfp} alt="profile pic" draggable="false"/>
            <p className='full-name'>{props.displayName || "User"}</p>
            <p className='username'>{'@' + (props.username || "N/A")}</p>
            <p className='bio'>{props.bio || "No bio set"}</p>



          <div className="profile-followers">
            <Link to="/followers" className="profile-follow-button">{props.followers} Followers </Link>
            <Link to="/following" className="profile-follow-button">{props.following} Following </Link>

          </div>
        </div>

    );
};

export default UserCard;