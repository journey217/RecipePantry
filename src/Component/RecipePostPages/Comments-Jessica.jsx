import { useState, useEffect, useContext } from "react";
import {Link} from "react-router-dom";
import AddComment from "./AddComment";
import "../../CSS Files/Jessica.css";
import deleter from "../../assets/delete.png";
import { TranslationContext } from "../../Translations/Translation";

const Comments = (props) => {
  const translations = useContext(TranslationContext).translations.Comments;
  const [comments, setComments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const userID = sessionStorage.getItem("user");
  const userToken = sessionStorage.getItem("token")
  const [commentID, setCommentID] = useState("");
  const [edit, setEdit] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [editedComment, setEditedComment] = useState(null);
  const [buttonText, setButtonText] = useState(translations["Edit Comment"]);
  const [editMode, setEditMode] = useState(false);
  const [posterID, setPosterID] = useState(0);
  //var edit = false;

  useEffect(() => {
      loadComments();
  }, []);

  function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "");
  }

  //console.log("PROPS:", props); // test

  function checkForUsername(post) {
    if (post.author.attributes) {
      if (post.author.attributes.username) {
        return escapeHtml(post.author.attributes.username);
      } else {
        return "DefaultUsername";
      }
    } else {
      return "DefaultUsername";
    }
  }

  function checkForUsernameMatch(post) { // for editing/deleting functionality
    if (post.author.id.toString() === userID) {
      //document.getElementById("editBtn").disabled = false;
      if (editedComment && post.id === editedComment.id) {
        //return "Save Changes"
        setButtonText(translations["Finish"]);
        return 1;
      } else {
        //return "Edit?"
        setButtonText(translations["Edit Comment"]);
        return 1;
      }
      /*if (edit === false) { // very cool nested conditional
        return "Edit?";
      } else {
        console.log(editedComment);
        return "Editing " + editedComment.id.toString();
      }*/
      //return "Edit?";
    } else {
      return 0;
      //document.getElementById('editBtn').style.visibility = 'hidden';
      //document.getElementById('editBtn').style.display = 'none';
    }
  }

  function editFunc(post) { // this is not a proper event handler
    // console.log("HELLO")
    // console.log(post)
    if (edit === false) {
      // console.log(document.getElementById("commentField").value)
      document.getElementById("commentField").value = post.content; // not working :'(
      document.getElementById("commentField").select();
      // console.log(post.content);
      // console.log(document.getElementById("commentField").value)
    } else {
      document.getElementById("commentField").value = "";
    }
    /*if (edit === false) {
      document.getElementById("editBtn").style.color = "pink";
    } else {
      document.getElementById("editBtn").style.color = "black";
    }*/
    //console.log(post);
    //let postID = post.id;
    setCommentID(post.id);
    //setEditedComment(post);
    //console.log(editedComment); // test
    if (edit === false) {
      setEditedComment(post);
    } else {
      setEditedComment(null);
    }
    setEdit(!edit); // enabling back and forth
    setShowSaveBtn(!showSaveBtn);
    /*if (edit === false) {
      setEdit(true);
    } else if (edit === true) {
      setEdit(false); 
    }*/
    //setEdit(true);
    //edit = true; // this isn't working the way i need it to
  }

  const EditorButton = (text) => {
    //   } else {
    //     return(
    //       <button className="newEditorSaving" onClick={() => editFunc(text.text)}>{buttonText}</button>
    //     )
    //   }
    // }
  }

//function otherEditFunc() { // now this is programming
/*const otherEditHandler = (cmt) => { // this doesn't work right, has to do with way i modified other file's submitHandler() 
  // probably no need to mess with setCommentID
  document.getElementById("commentField").value = "";
  setEditedComment(null);
  setEdit(!edit);
  setShowSaveBtn(!showSaveBtn);
}

document.addEventListener("keypress", function onEvent(event) {
  if (event.key === "Enter" && edit === true) {
    otherEditHandler(document.getElementById("commentField").value); // ug
      //console.log("success");
  }
});*/ // this is getting me PO'd lol

  const loadComments = async () => {
      const splits = window.location.href.split("/");
        const recipe_id = splits[splits.length - 1];
        let url = process.env.REACT_APP_API_PATH + "/posts/" + recipe_id;
        const userResponse = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        });

        const userData = await userResponse.json();

        setPosterID(userData.author.id);

    fetch(
        process.env.REACT_APP_API_PATH +
        "/posts?parentID=" +
        props.parent +
        "&sort=newest",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
    )
        .then((res) => res.json())
        .then(
            (result) => {
                console.log(result)
              setIsLoaded(true);
              setComments(result[0]);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
        );
  };

  const deleteComment = (input) => {
    let postID = input.text.id;
    //console.log(postID);
    //console.log(edit);
    if (postID === commentID) {
      //console.log(postID, commentID);
      setEdit(false);
    }
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
        .then((result) => {
          loadComments();
        })
        .catch((error) => {
          console.log("error!" + error);
        })
  };

  const DeleteButton = (text) => {
      return (
          <img src={deleter} className="delet" alt="Delete Ingred." onClick={() => deleteComment(text)}/>
      );
  }

  function SaveButton({bool}) { // unused
    if (bool === true) {
      // console.log(editedComment); // test
      return (
          <button className="saveBtn" onClick={() => editFunc(editedComment)}>Save changes</button>
      );
    }
  }

  const handleShowEdit = ( id ) => {
      let but = document.getElementById(id);
        setEditMode(!editMode);
        if (editMode === false) {
            but.innerText = translations["Finish"];
        } else {
            but.innerText = translations["Edit"];
        }
    }

  if (comments.length === 0) {
    return (
        <div className="comments-container">
          <div className="comments-wrapper">
            <div className="no-comments-msg">{translations["No comments yet!"]}</div>
          </div>
          <div className="new-comment">
            {/*<AddComment parent={props.parent} loadComments={loadComments} />*/}
            <AddComment parent={props.parent} loadComments={loadComments} handleShowEdit={handleShowEdit} setEdit={setEdit} commentID={commentID} edit={edit}/>
          </div>
        </div>
    );
  } else {
    return (
        <div className="comments-container">
          <div className="comments-wrapper">
            <ul>
              {comments.map((comment) => (
                  <div key={comment.id} className="comment-wrapper">
                    <div className="comment-text-wrapper">
                      <div className={"comment_header_line"}>
                        <div className={"comment-pfp-name"}>
                          <div className="comment-user-pfp">
                            <img
                                src={comment.author.attributes.picture}
                                alt="commenter's profile picture"
                                className="user-pfp"
                            />
                          </div>
                          <div className="comment-username">
                            <Link className="user-profile-link"
                                  to={"/profile/" + comment.author.id}>@{checkForUsername(comment)}</Link>
                          </div>
                        </div>
                        {/* <div className={"del_edit_com_spacer"}></div>
                          <div className={"delete_edit_comment_container"}> newly commented out */}
                            <div className="editDeleteContainer"> {/* new */}
                              { parseInt(posterID) === parseInt(userID) || parseInt(comment.author.id) === parseInt(userID) ? <DeleteButton text={comment}/>:null} {/* this has to go before edit if both floated to right and i want it on right */}
                            { parseInt(comment.author.id) === parseInt(userID) ? <button id={comment.id} className="newEditor" onClick={() => {editFunc(comment); handleShowEdit(comment.id);}}>{"Edit"}</button>:null}
                            {/*<p id="editBtn" className="editor" onClick={() => editFunc(comment)}>{checkForUsernameMatch(comment)}</p> {/* wanted to make this button but trouble hiding... */}
                            {/*<button id="editBtn" className="editor" onClick={() => editFunc(comment)}>{checkForUsernameMatch(comment)}</button>*/}
                            </div>
                        {/*</div> newly commented out */}
                      </div>
                      <div className="comment-text">
                        <div className="comment-content">{comment.content}</div>
                      </div>
                    </div>
                  </div>
              ))}
            </ul>
          </div>
          <div className="new-comment">
            {/*<AddComment parent={props.parent} loadComments={loadComments} /> */}
            <AddComment parent={props.parent} loadComments={loadComments} handleShowEdit={handleShowEdit} setEdit={setEdit} commentID={commentID} edit={edit}/>
            <script>
              
            </script>
          </div>
        </div>
    );
  }
};

export default Comments;
