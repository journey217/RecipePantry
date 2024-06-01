import React from "react";
import "../../CSS Files/Jessica.css";
import defaultUser from "../../assets/default_user.png";
import profilePreferences from "../../assets/profile_preferences.png";
import settingsCard from "../../assets/settings_card.png";
import FollowButton from "../FriendsPages/FollowButton-Journey";
import StyleGuide from "../StyleGuide-Journey";

const ProfileSettingsStyleGuide = () => {
  return (
    <div>
      <h2>Profile</h2>
      <h3>User Card</h3>
      <h4>User Card Example</h4>
      <div id="user-card-wrapper">
        <div id="profile-pic-wrapper">
          <div id="profile-pic">
            <img
              src={defaultUser}
              alt="profile pic"
              draggable="false"
              style={{ maxWidth: "80vw" }}
            />
          </div>
        </div>
        <div id="user-card-text-wrapper">
          <div id="user-card-heading">
            <div id="display-name-wrapper">
              <h1>{"Display Name"}</h1>
            </div>
          </div>
          <div id="profile-username-wrapper">
            <h2>{"@username"}</h2>
          </div>
          <div id="profile-bio-wrapper">
            <p>{"This is an example bio."}</p>
          </div>
          <div id="friends-wrapper">
            <div className="friends-count">
              <div className="friend-count">
                <b>12</b> Followers{" "}
              </div>
            </div>
            <div className="friends-count">
              <div className="friend-count">
                <b>2</b> Following{" "}
              </div>
            </div>
          </div>
        </div>
        <div id="follow-button-wrapper" className={"center_div"}>
          <FollowButton />
        </div>
      </div>
      <h4>CSS Code for User Card</h4>
      <div className={"code_box_container"}>
        <pre>
          <code className={"css_code_box"}>
            {"#user-card-wrapper {\n" +
              "   margin: 2rem;\n" +
              "   display: inline-flex;\n" +
              "}\n\n" +
              "#profile-pic-wrapper {\n" +
              "   display: flex;\n" +
              "   justify-content: center;\n" +
              "   margin-right: 2rem;\n" +
              "}\n\n" +
              "#profile-pic img {\n" +
              "   border-radius: 50%;\n" +
              "   width: 10rem;\n" +
              "   height: 10rem;\n" +
              "}\n\n" +
              "#user-card-text-wrapper {\n" +
              "   display: flex;\n" +
              "   flex-direction: column;\n" +
              "   align-items: left;\n" +
              "   justify-content: space-between;\n" +
              "}\n\n" +
              "#user-card-heading {\n" +
              "   display: flex;\n" +
              "   flex-direction: row;\n" +
              "   justify-content: space-between;\n" +
              "   width: inherit;\n" +
              "}\n\n" +
              "#user-card-text-wrapper h1, h2, p{\n" +
              "   margin: 0;\n" +
              "}\n\n" +
              "#display-name-wrapper h1 {\n" +
              "   font-size: 2rem;\n" +
              "   font-weight: normal;\n" +
              "   margin-bottom: 0.1rem;\n" +
              "}\n\n" +
              "#follow-button-wrapper {\n" +
              "   margin-left: auto;\n" +
              "}\n\n" +
              "#profile-username-wrapper h2 {\n" +
              "   font-size: 1.4rem;\n" +
              "   font-weight: normal;\n" +
              "   color: grey;\n" +
              "   margin-bottom: 0.8rem;\n" +
              "}\n\n" +
              "#profile-bio-wrapper p {\n" +
              "   font-size: 1.3rem;\n" +
              "}\n\n" +
              "#friends-wrapper {\n" +
              "   margin-top: 0.6rem;\n" +
              "   display: flex;\n" +
              "   flex-direction: row;\n" +
              "}\n\n" +
              ".friend-count {\n" +
              "   color: grey;\n" +
              "   text-decoration: none;\n" +
              "   margin-right: 1rem;\n" +
              "}\n\n" +
              ".friend-count:hover {\n" +
              "   text-decoration: underline;\n" +
              "   color: #CF6E4F;\n" +
              "}\n\n"}
          </code>
        </pre>
      </div>
      <h3>Preference Cards</h3>
      <h4>Preference Cards Example</h4>
      <img
        src={profilePreferences}
        alt="cuisine and dietary preferences components from profile page"
        draggable="false"
        style={{ maxWidth: "80vw" }}
      ></img>
      <h4>CSS Code for Preference Cards</h4>
      <div className={"code_box_container"}>
        <pre>
          <code className={"css_code_box"}>{`#preferences-container {
                margin-bottom: 2rem;
              }
              
              .preferences-wrapper {
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                border: 1px solid #333333;
              }
              
              .preferences-wrapper {
                display: flex;
              
                background-color: white;
                border-radius: 3rem;
              }
              
              .preference-type {
                padding: 1rem 0.5rem 1rem 1.5rem;
                background-color: #EAA861;
                max-width: 30vw;
                /*min-width: fit-content;*/
                line-height: 2.2rem;
                border-top-left-radius: inherit;
                border-bottom-left-radius: inherit;
              }
              
              
              .preference-type-2 {
                max-width: 30vw;
                /*min-width: fit-content;*/
              }
              
              
              .preferences-wrapper h4 {
                margin: 0;
                font-weight: normal;
              }
              
              .pencil-icon {
                cursor: pointer;
              }
              
              .preference-tags {
                max-width: 100%;
                overflow-x: auto;
                white-space: nowrap;
                scrollbar-width: none;
                border-top-right-radius: inherit;
                border-bottom-right-radius: inherit;
              }
              
              /* for webkit browsers: chrome, safari */
              .preference-tags::-webkit-scrollbar {
                width: 0;
              }
              
              /*all the tags*/
              .tags-wrapper {
                display: inline-flex;
                flex-direction: row;
                padding: 1rem;
                font-size: 1rem;
              }
              
              /*each individual tag*/
              .tag-container {
                padding: 0.5rem 0.8rem 0.5rem 0.8rem;
                margin-right: 0.7rem;
                border-radius: 1rem;
                background-color: #4F9BFF;
                color: white;
                cursor: pointer;
              }
              
              
              .nopref-tag {
                line-height: 2.2rem;
                padding: 1rem;
                font-size: 1.2rem;
              }`}</code>
        </pre>
      </div>
      <h2>Settings</h2>
      <h3>Edit Account Information Card Example</h3>
      <img
        src={settingsCard}
        alt="settings card"
        style={{ maxWidth: "80vw" }}
      ></img>
      <h3>CSS for Edit Account Information Card</h3>
      <div className={"code_box_container"}>
        <pre>
          <code className={"css_code_box"}>{`.input-and-label{
                display: block;
                margin-bottom: .5rem;
                
            }
.profileform .edit-profile-label{
                display: block;
                font-size: 1rem;
                margin: 0 .25rem;
}
.profileform .edit-profile-input, .bio-input{
                padding-left: .5rem;
                font: inherit;
                height: 2rem;
                width: 15rem;
                border: 1px solid black;
                border-radius: 20px;
                background-color: hsla(0, 0%, 0%, 0);
                margin: .25rem 0;
                background-color: papayawhip;
}
            
.profileform .bio-input{
                padding: .5rem;
                height: 10rem;
                font-size: 1rem;
}
            
.profileform .edit-profile-input:hover, .bio-input:hover{
                background-color: white;
}
            
.profileform .edit-profile-input:focus, .bio-input:focus{
                background-color: white;
                outline: 1px solid black;
}`}</code>
        </pre>
      </div>
    </div>
  );
};

export default ProfileSettingsStyleGuide;
