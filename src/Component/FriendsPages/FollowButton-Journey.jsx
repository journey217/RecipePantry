import {useEffect, useState, useContext} from "react";
import {connect} from "socket.io-client";
import { TranslationContext } from "../../Translations/Translation";

const FollowButton = () => {
    const [isToggled, setIsToggled] = useState(true);
    const [buttonText, setButtonText] = useState("Follow");
    const [connectionID, setConnectionID] = useState(0);
    const [toID, setToID] = useState(0);
    const [fromID, setFromID] = useState(0);
    const [following, setFollowing] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const translations = useContext(TranslationContext).translations.FriendsPages.FollowButtonJourney;

    function RetFollowButton() {
        return (
            <button onClick={handleChange} className={`toggle-button ${isToggled ? 'on':'off'}`}>
                { buttonText }
            </button>
        );
    }


    useEffect( () => {

        const splits = window.location.href.split('/');
        const userID = splits[splits.length - 1];

        setToID(userID);

        setFromID(sessionStorage.getItem("user"));

        if (userID === sessionStorage.getItem('user')) {
            setShowButton(false);
        }

        fetch( // toUserID = UserID's followers, fromUserID = UserID's following
            process.env.REACT_APP_API_PATH + "/connections?fromUserID=" + sessionStorage.getItem("user"),
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
                    // console.log(result);
                    let i = 0;
                    const connections = result[0];
                    while (i < connections.length) {
                        if (parseInt(connections[i].toUser.id) === parseInt(userID)) {
                            setConnectionID(connections[i].id);
                            setFollowing(true);
                            setIsToggled(false);
                            setButtonText(translations["following"]);
                            i = result[0].length;
                        }
                        i++;
                    }
                    },
                (error) => {
                    console.log(error)
                });
    });

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleChange = () => {
        if (fromID === toID) {
            return
        }
        setIsToggled(!isToggled);
        if (!isToggled){
            unfollow(connectionID);
            setFollowing(false);
            setButtonText(translations["follow"]);
        } else if (isToggled){
            follow(fromID, toID);
            setFollowing(true);
            setButtonText(translations["following"])
            // change connectionID variable
            updateConnectionID(fromID, toID);
        }
        sleep(100).then(r => window.location.reload());

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
                setConnectionID(parseInt(result[0][0].id));
            }
        )
    }

    const follow = (userid, connection) => {
        if (following) {
            return
        }
        if (userid === connection) {
            return
        }
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
        if (!following) {
            return
        }
        // console.log("connectionID: "+connectionID)
        fetch(process.env.REACT_APP_API_PATH + "/connections/" + connectionid, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            }
        })
        .then((res) => res.json())
        .then((result) => {
            // console.log("unfollowed: "+result.id);
            },
            (error) => {
            console.log(error)
        });
    }

    return (
        <>
            {showButton ? <RetFollowButton/>: null}
        </>
    )
}

export default FollowButton;