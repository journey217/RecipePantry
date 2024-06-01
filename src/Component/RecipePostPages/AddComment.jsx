import React, { useState, useEffect, useContext } from "react";
import { IconContext } from "react-icons";
import { FaArrowCircleUp } from "react-icons/fa";
import { TranslationContext } from "../../Translations/Translation";

// takes parent & loadComments as props
// adding edit + commentID as props for editing
const AddComment = (props) => {
  // useState to manage the post text
  const translations = useContext(TranslationContext).translations.Comments;
  const [comment, setComment] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editStatus, setEditStatus] = useState(false); // unused

  useEffect(() => {
    const isCommentEmpty = comment.trim().length === 0;
    const isCommentTooLong = comment.length > 500;

    if (isCommentTooLong) {
      setErrorMessage(translations["comment_exceed_500"]);
    } else {
      setErrorMessage("");
    }

    setIsSubmitDisabled(isCommentEmpty || isCommentTooLong);
  }, [comment]);

  // Function to handle form submission by making a POST request
  // to the server to add the comment to a post with a given parentID
  // which is passed in from props
  const submitHandler = (event) => {
    // Keep the form from actually submitting
    event.preventDefault();

    const currentComment = comment;
    setComment("");

    setComment((prevComment) => {
      return "";
    });

    console.log(props);

    if (props.edit === true) { // this is bad, child can't revaluate props. workaround - enter keystroke -> edit = false? but input field in this file
      console.log('caught');

      fetch(process.env.REACT_APP_API_PATH + "/posts/" + props.commentID, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          authorID: sessionStorage.getItem("user"),
          parentID: props.parent,
          content: currentComment,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          props.loadComments();
          props.handleShowEdit(props.commentID);
          props.setEdit(false);
          //setComment("");
          document.getElementById("commentField").value = ""; // replacement for above (slightly slower...)
          setErrorMessage("");
        },
        (error) => {
          console.log("error!");
        }
      );
      return; 
    }

    // submit the comment as a post, with the parentID being the parent that is passed
    // in through props in Post.jsx
    fetch(process.env.REACT_APP_API_PATH + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem("user"),
        parentID: props.parent, // the parent post/comment id
        content: currentComment,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          props.loadComments();
          //setComment("");
          document.getElementById("commentField").value = ""; // replacement for above
          setErrorMessage("");
        },
        (error) => {
          console.log("error!");
        }
      );
  };

  function keyPresser(e) { // this might not be feasible by Saturday...
    e = e || window.event;
    if (e.keyCode === 13 && props.edit === true) {
      //document.getElementById()
    }
  }

  return (
    <div className="comment-input-wrapper">
      <form onSubmit={submitHandler}>
        <input
          className="comment-input-box"
          id="commentField"
          type="text"
          placeholder={translations["Add a comment..."]}
          //value={comment} // precludes text display in edit mode
          //onKeyDown={(e) => } // new - so pressing enter exits edit mode
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          className="comment-submit-btn"
          type="submit"
          value="Post"
          disabled={isSubmitDisabled}
        />
        {errorMessage && <p className="errorText">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default AddComment;
