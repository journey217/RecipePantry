import React, { useEffect, useState } from "react";
import LoginForm from "./LoginPages/LoginForm";
import Posts from "./RecipePostPages/Posts";
import LandingPage from "./LandingPage-Journey";

const HomePage = ({ isLoggedIn, setLoggedIn, doRefreshPosts, appRefresh }) => {
  // state variable for userToken, intiially set to an empty string
  const [userToken, setUserToken] = useState("");

  // useEffect hook, this will run everything inside the callback
  // function once when the component loads
  useEffect(() => {
    setUserToken(sessionStorage.getItem("token"));
  }, []);

  // if the user is not logged in, show the login form.  Otherwise, show the post form
  return (
    <div>
      {!userToken ? (
        <>
          <LoginForm setLoggedIn={setLoggedIn} />
        </>
      ) : (
        <LandingPage/>
      )}
    </div>
  );
};

export default HomePage;
