import { useState, useContext } from "react";
import { TranslationContext } from "../../Translations/Translation";

export default function FollowToggle(props) {
    // props: 
    // userid [int]
    // connectionid = connection's id [int]
    // connection = the other user's id [int]
    const [isToggled, setIsToggled] = useState(false);
    const [connectionID, setConnectionID] = useState(props.connectionid);
    const translations = useContext(TranslationContext).translations.FriendsPages.FollowToggleJessica;
    const [buttonText, setButtonText] = useState(translations["following"]);

    const handleChange = () => {
        setIsToggled(!isToggled);
        if (!isToggled){
            unfollow(connectionID);
            setButtonText(translations["follow"])
        } else if (isToggled){
            follow(props.userid, props.connection);
            setButtonText(translations["following"])
            // change connectionID variable
            updateConnectionID(props.userid, props.connection);
        }
    }

    const updateConnectionID = (userid, connection) => {
        fetch(process.env.REACT_APP_API_PATH + "/connections?fromUserID=" + userid + "&toUserID=" + connection, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
        .then((res) => res.json())
        .then(
            (result) => {
                // console.log(result[0]);
                // console.log(result[0][0]);
                // console.log(result[0][0].id);
                setConnectionID(result[0][0].id);
            }
        )
    }

    const follow = (userid, connection) => {
        fetch(process.env.REACT_APP_API_PATH + "/connections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({ 
                toUserID: connection,
                fromUserID: userid,
                attributes: { type: "following" },
            })
        })
        .then((res) => res.json())
    }

    const unfollow = (connectionid) => {
        fetch(process.env.REACT_APP_API_PATH + "/connections/" + connectionid, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            }
        })
        .then((res) => res.json())
    }

    return (
        <button onClick={handleChange} className={`toggle-button ${isToggled ? 'on':'off'}`}>
            { buttonText }
        </button>
    )
}