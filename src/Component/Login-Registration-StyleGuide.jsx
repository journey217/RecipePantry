import React from 'react';

const LoginRegistrationStyleGuide = () => {
    return (
        <div>
            <h2>Login and Registration</h2>
            <p>
                This component displays the styling guidelines for the login and registration pages.
            </p>
            <h3>Login Page</h3>
            <p>
                Here are the styling guidelines for the login page:
                <ul>
                    <li>
                        - The login page is the default landing page on Recipe Pantry. Basic website functionality is barred until a user
                        is logged in.
                        - Until then, they are unable to view recipes, user profiles, and the like.
                        - The sole header is a bolded /h2/ reading “Log in”, below an image of our website name and tagline.
                        - The input fields/attendant labels, button, and links are all encased within an orange backdrop container in similar
                        - fashion to the Registration pages.
                        - The text fields (email and password, respectively) are both light-orange colored and white-out when hovered/clicked.
                        - The sole button is for logging in; it is light-blue colored and highlights to a lighter blue when hovered.
                        - The two links are both blue-colored which turn purple upon visitation. The first (“Forgot password?”) brings the user
                          to the Login Recovery page, and the second (“... Create [an account] here”) brings them to the Registration page.
                        - Errors are caught if the user attempts to login with incorrect or insufficient credentials. </li>
                </ul>
            </p>
            <h3>Registration Page</h3>
            <p>
                Here are the styling guidelines for the registration page:
                <ul>
                    <li>
                        - When a user wants to create an account, they will click on the ‘Register’ button from the landing login page.
                        - All pages will have the name of the registration step in bold H1 text towards the top of the page.
                        - For the first 3 steps of the registration process, which is email, password, profile picture, display name,
                          and username entry, all text, text boxes and buttons will be encased in an orange backdrop box with the ‘RP’
                          icon at the top of the box.
                        - For the last 2 steps of the registration process, which are the cuisine and preferences quizzes, there will
                          be a layout of gray boxes of pictures and associated titles center-aligned to the page that are clickable to the user.
                        - When the user clicks the option box, it will indicate it is selected with the gray turning orange.
                        - All buttons are a light blue and lie towards the bottom of the page or box.</li>
                    <li>- If a user wants to edit their answers for the cuisine and diet preferences steps, they can view their profile once logged
                          in. When they go to edit, they will be taken to a page that appears exactly how it does when choosing the
                          cuisine and preferences originally.</li>
                </ul>
            </p>
        </div>
    );
};

export default LoginRegistrationStyleGuide;
