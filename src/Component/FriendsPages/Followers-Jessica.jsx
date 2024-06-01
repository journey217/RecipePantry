import { useState, useEffect, useContext } from "react"
import {Link, useNavigate} from "react-router-dom";
import "../../CSS Files/Jessica.css";
import { TranslationContext } from "../../Translations/Translation";

const Followers = () => {
  const [connections, setConnections] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const translations = useContext(TranslationContext).translations.FriendsPages.FollowersJessica;
  
  // variable for userToken to check authorization
  const userToken = sessionStorage.getItem("token");

  useEffect(() => {
    if (!userToken) {
      navigate("/");
    }
  }, [userToken, navigate])

  useEffect(() => {
    loadFriends();
  }, [])

  function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "");
}

function checkForUsername(connection) {
  if (connection.fromUser.attributes) {
      if (connection.fromUser.attributes.username) {
          return escapeHtml(connection.fromUser.attributes.username);
      } else {
          return "DefaultUsername";
      }
  } else {
      return "DefaultUsername";
  }
}

  const loadFriends = () => {
    fetch( // toUserID = UserID's followers, fromUserID = UserID's following
    process.env.REACT_APP_API_PATH + "/connections?toUserID=" + sessionStorage.getItem("user"),
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    }
  )
    .then((res) => res.json())
    .then(
      (result) => {
        setIsLoaded(true);
        setConnections(result[0]);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }


  if (error){
    return <div> {translations["error"]}{error.message} </div>
  } else if (!isLoaded) {
    return <div> {translations["loading"]} </div>
  } else if (connections.length == 0){
    return (
      <div className="friends-list">
        <ul>
          <h1 className="friendsh1">{translations["followers"]}</h1>
          <div className="friends-none">{translations["no_followers"]}</div>
        </ul>
      </div>
    )
  } else {
    return (
      <div className="post">
        <div className="friends-list">
          <ul>
          <h1 className="friendsh1">{translations["followers"]}</h1>
            {connections.reverse().map((connection) => (
              <div key={connection.id} className="connection">
                {/* <div className="connection-left"> */}
                  <Link className="user-profile-link" to={"/profile/" + connection.fromUserID}>@{checkForUsername(connection)}</Link>
                {/* </div> */}
              </div>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  } 

export default Followers;