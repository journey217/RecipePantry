import React, { useEffect, useState, useContext } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import EditProfile from "./EditProfile";
import ConfirmDelete from "./ConfirmDelete";
import { TranslationContext } from "../../Translations/Translation";

const Settings = () => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("token");
  const userID = sessionStorage.getItem("user");
  const location = useLocation();
    const [opacity, setOpacity] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const translations = useContext(TranslationContext).translations.ProfilePages.Settings;

    useEffect(() => {
        if (!userToken || !userID) {
            navigate("/");
        }


        // Scroll and resize event code courtesy of ChatGPT
        const handleScroll = () => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

            if (currentScrollTop > lastScrollTop) {
                setOpacity(.4); // Fade out
            } else {
                setOpacity(1); // Fade in
            }

            setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        };


        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [lastScrollTop, location]);

    // END ChatGPT code

    function handleHover() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        setOpacity(1);
    }

  const toggleConfirmDelete = (e) => {
    e.preventDefault();    
    // Take the current state of openModal, and update it to be the negated value of that
    // ex) if openModal == false, this will update openModal to true
    setOpenConfirmDelete((prev) => !prev);
  };

  function TabButton({tabId, activeTab, onClick, children}) {
        let isActive = tabId === activeTab;
        return (
            <button
                className={`tab-fyp-btn-${tabId} ${isActive ? 'active' : ''}`}
                onClick={() => onClick(tabId)}
            >
                {children}
            </button>
        );
    }

  return (
    <div className="settings">
        <div className={"sticky_tabs_nav"} onMouseEnter={handleHover}
                 style={{opacity, transition: 'opacity 0.3s ease', width: "100vw", position: "fixed", zIndex: 2}}>
      <div className="tabs_fyp">
                <TabButton
                    tabId="fyp"
                    activeTab={"fyp"}
                    onClick={e => navigate("/settings")}
                >
                    {translations["settings"]}
                </TabButton>
                <TabButton
                    tabId="all-recipes"
                    activeTab={"fyp"}
                    onClick={e => navigate("/hidden-posts")}
                >
                    {translations["hidden_posts"]}
                </TabButton>
            </div>
            </div>
            <div className={"spacer2"}></div>
      <div className={"center_div"}>
        <EditProfile setUserEmail={(e) => setUserEmail(e)} toggleConfirmDelete={(e) => toggleConfirmDelete(e)} userid={sessionStorage.getItem("user")} />
      </div>
      <ConfirmDelete email={userEmail} showConfirmDelete={openConfirmDelete} closeConfirmDelete={(e) => toggleConfirmDelete(e)}/>
    </div>
  );
};

export default Settings;
