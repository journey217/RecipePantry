import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Settings from "./Component/ProfilePages/Settings";
import HomePage from "./Component/HomePage";
import Navbar from "./Component/Navbar";
import Following from "./Component/FriendsPages/Following-Jessica";
import Followers from "./Component/FriendsPages/Followers-Jessica";
import Modal from "./Component/Modal";
import LoginForm from "./Component/LoginPages/LoginForm";
import RegisterForm from "./Component/RegistrationPages/RegisterForm";
import RegistrationUploadPicture from "./Component/RegistrationPages/RegistrationUploadPicture";
import RegistrationCreateProfile from "./Component/RegistrationPages/RegistrationCreateProfile";
import RegistrationChooseCuisines from "./Component/RegistrationPages/RegistrationChooseCuisines";
import RegistrationChoosePreferences from "./Component/RegistrationPages/RegistrationChoosePreferences";
import ResetPassword from "./Component/AccountRecovery/ResetPassword";
import Messaging from "./Component/Messaging";
import { io } from "socket.io-client";
import RecipeImport from "./Component/RecipePostPages/RecipePost-Journey";
import MyRecipes from "./Component/RecipePostPages/MyRecipes-Journey";
import ShoppingList from "./Component/ShoppingList-Journey";
import MyCookbooks from "./Component/CookbookPages/MyCookbooks-Journey";
import UnitConversions from "./Component/RecipePostPages/UnitConversions-Journey";
import LoginRecovery from "./Component/AccountRecovery/LoginRecovery"
import ShowProfilev2 from "./Component/ProfilePages/ShowProfilev2-Jessica";
import ShowProfile2v2 from "./Component/ProfilePages/ShowProfile2v2-Jessica";
import FollowingJourney from "./Component/FriendsPages/Following-Journey";
import FollowersJourney from "./Component/FriendsPages/Followers-Journey";
import UserCookbooks from "./Component/CookbookPages/UserCookbooks-Journey";
import UserRecipes from "./Component/RecipePostPages/UserRecipes-Journey";
import StyleGuide from "./Component/StyleGuide-Journey";
import UserBios from "./Component/UserBios-Journey";
import CreateCookbook from "./Component/CookbookPages/CreateCookbook-Journey";
import DisplayCookbook from "./Component/CookbookPages/DisplayCookbook-Journey";
import Cuisines from "./Component/Cuisines/cuisines";
import EditRecipe from "./Component/RecipePostPages/EditRecipe";
import AddToCookbook from "./Component/CookbookPages/AddToCookbook-Journey";
import Cookbooks from "./Component/CookbookPages/Cookbooks-Journey";
import SavedCookbooks from "./Component/CookbookPages/SavedCookbooks-Journey";
import EditCuisines from "./Component/ProfilePages/EditCuisines-Journey";
import EditDietary from "./Component/ProfilePages/EditDietary-Journey";
import SearchCookbooks from "./Component/CookbookPages/SearchCookbooks-Journey";
import ForYouPage from "./Component/RecipePostPages/ForYouPage-Journey";
import Footer from "./Component/Footer-Journey";
import SearchByIngredients from "./Component/Cuisines/SearchByIngredients-Journey";
import { TranslationProvider } from "./Translations/Translation";
import HiddenRecipes from "./Component/RecipePostPages/HiddenRecipes-Journey";
import LikedPosts from "./Component/RecipePostPages/LikedPosts-Journey";
import DisplayRecipeV2 from "./Component/RecipePostPages/DisplayRecipeV2-Journey";
import EditCookbook from "./Component/CookbookPages/EditCookbook-Journey";
import FollowingRecipes from "./Component/RecipePostPages/FollowingRecipes-Journey";
import FollowingCookbooks from "./Component/CookbookPages/FollowingCookbooks-Journey";

// App.jsx is the starting point for the application.  This is the component called by index, which will be rendered when
// a user goes to your app URL.  This component will handle routing to other parts of your app, and any initial setup.

// Initalize the socket with the respective path and tenantID
// NEED this in App.jsx to use the socket throughout the application for real-time connections
const socket = io(process.env.REACT_APP_API_PATH_SOCKET, {
  path: "/hci/api/realtime-socket/socket.io",
  query: {
    tenantID: "example",
  },
});
export { socket };

function App() {
  // logged in state, which tracks the state if the user is currently logged in or not
  // initially set to false
  const [loggedIn, setLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConversions, setOpenConversions] = useState(false);
  const [openAddCookbook, setOpenAddCookbook] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);

  // basic logout function, removes token and user id from session storage
  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setLoggedIn(false);
    // reloads the window, so we get back to the login form
    window.location.reload();
  };

  //const login = (e) => {
  //  e.preventDefault();
  //  setRefreshPosts(true);
  //  setLoggedIn(true);
  //};

  const login = (e) => {
    e.preventDefault();
    setRefreshPosts(true);
    setLoggedIn(true);
  };

  const doRefreshPosts = () => {
    console.log("CALLING DOREFRESHPOSTS IN APP.JSX");
    setRefreshPosts(true);
  };

  const ScrollReset = () => {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);
    return null; // This component doesn't render anything visible
  };

  const toggleModal = (e) => {
    e.preventDefault();
    // Take the current state of openModal, and update it to be the negated value of that
    // ex) if openModal == false, this will update openModal to true
    setOpenModal((prev) => !prev);
  };

  const toggleConversions = (e) => {
    e.preventDefault();
    // Take the current state of openModal, and update it to be the negated value of that
    // ex) if openModal == false, this will update openModal to true
    setOpenConversions((prev) => !prev);
  };

  const toggleAddCookbook = (e) => {
    e.preventDefault();
    // Take the current state of openModal, and update it to be the negated value of that
    // ex) if openModal == false, this will update openModal to true
    setOpenAddCookbook((prev) => !prev);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to HCI socket server");
    });
  }, []);

  return (
    // the app is wrapped in a router component, that will render the
    // appropriate content based on the URL path.  Since this is a
    // single page app, it allows some degree of direct linking via the URL
    // rather than by parameters.  Note that the "empty" route "/", uses the HomePage
    // component, if you look in the HomePage component you will see a ternary operation:
    // if the user is logged in, show the "home page", otherwise show the login form.
    <Router basename={process.env.PUBLIC_URL}>
      <TranslationProvider>
        <div className="App">
          <header className="App-header">
            <Navbar
              toggleModal={(e) => toggleModal(e)}
              logout={(e) => logout(e)}
            />
            <div className="maincontent" id="mainContent">
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      setLoggedIn={setLoggedIn}
                      doRefreshPosts={doRefreshPosts}
                      appRefresh={refreshPosts}
                      login={(e) => login(e)} // new
                    />
                  }
                />
                <Route
                  path="/register"
                  element={<RegisterForm setLoggedIn={setLoggedIn} />}
                />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/registration-upload-picture"
                  element={<RegistrationUploadPicture />}
                />
                <Route
                  path="/registration-create-profile"
                  element={<RegistrationCreateProfile />}
                />
                <Route
                  path="/registration-choose-cuisines"
                  element={<RegistrationChooseCuisines />}
                />
                <Route
                  path="/registration-choose-preferences"
                  element={<RegistrationChoosePreferences />}
                />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/followers" element={<Followers />} />
                <Route path="/following" element={<Following />} />
                {/* Declaring a route with a URL parameter "roomID" so that React router dynamically
              captures the corresponding values in the URL when there is a match. 
              It is useful when dynamically rendering the same component for multiple paths.
              You can see how this is used in the Messaging component 
              as well as how this path is being set up in the FriendList component */}
                <Route path="/messages/:roomID" element={<Messaging />} />
                <Route
                  path="/post-recipe"
                  element={
                    <RecipeImport
                      toggleConversions={(e) => toggleConversions(e)}
                    />
                  }
                />
                <Route path="/my-recipes" element={<MyRecipes />} />
                <Route path="/recipes/:id" element={<UserRecipes />} />
                <Route path="/shopping-list" element={<ShoppingList />} />
                <Route
                  path="/my-cookbooks"
                  element={
                    <MyCookbooks
                      toggleConversions={(e) => toggleConversions(e)}
                    />
                  }
                />
                <Route path="/cookbooks/:id" element={<UserCookbooks />} />
                <Route path="/profile" element={<ShowProfilev2 />} />
                <Route path={"/profile/:id"} element={<ShowProfile2v2 />} />
                <Route path="/login-recovery" element={<LoginRecovery />} />
                <Route
                  path="/post/:id"
                  element={
                    <DisplayRecipeV2
                      toggleAddCookbook={(e) => toggleAddCookbook(e)}
                      toggleConversions={(e) => toggleConversions(e)}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={<LoginForm login={(e) => login(e)} />}
                />
                <Route path="/followers/:id" element={<FollowersJourney />} />
                <Route path="/following/:id" element={<FollowingJourney />} />
                <Route path={"/dev-profiles"} element={<UserBios />} />
                <Route path={"/styleguide"} element={<StyleGuide />} />
                <Route
                  path={"/create-a-cookbook"}
                  element={<CreateCookbook />}
                />
                <Route
                  path={"/post/cookbook/:id"}
                  element={<DisplayCookbook />}
                />
                <Route path={"/cuisines"} element={<Cuisines />} />
                <Route path="/edit-recipe/:id" element={<EditRecipe />} />
                <Route path={"/cookbooks"} element={<Cookbooks />} />
                <Route path={"/bookmarks"} element={<SavedCookbooks />} />
                <Route path={"/edit-cuisines"} element={<EditCuisines />} />
                <Route path={"/edit-diet"} element={<EditDietary />} />
                <Route
                  path={"/search-cookbooks"}
                  element={<SearchCookbooks />}
                />
                <Route path={"/fyp"} element={<ForYouPage />} />
                <Route
                  path={"/ingredient-search"}
                  element={<SearchByIngredients />}
                />
                <Route path={"/hidden-posts"} element={<HiddenRecipes />} />
                <Route path={"/likes"} element={<LikedPosts />} />
                <Route path={"/edit-cookbook/:id"} element={<EditCookbook />} />
                <Route
                  path={"/following/recipes"}
                  element={<FollowingRecipes />}
                />
                <Route
                  path={"/following/cookbooks"}
                  element={<FollowingCookbooks />}
                />
              </Routes>
            </div>
          </header>

          <Modal show={openModal} onClose={(e) => toggleModal(e)}>
            This is a modal dialog!
          </Modal>

          <UnitConversions
            showConversions={openConversions}
            closeConversions={(e) => toggleConversions(e)}
          />

          <AddToCookbook
            showAddCookbook={openAddCookbook}
            closeAddCookbook={(e) => toggleAddCookbook(e)}
          />

          <ScrollReset />
        </div>
        <Footer />
      </TranslationProvider>
    </Router>
  );
}
export default App;
