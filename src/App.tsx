import React from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import {
    ForgotPasswordPage,
    ChatPage,
    SignUpPage,
    SignInPage,
    ContactPage,
    AccountPage,
    NotFoundPage,
    LogoutPage,
    ConfirmResetPassword, ActivateAccountPage
} from './features';
import {AppLayout, MainLayout} from "./layout";
import { Grommet } from "grommet";
import { useAppSelector } from "./store";
import Screens from "./common/screens";
import ChangePasswordPage from "./features/account/change-password";
import UserInformationPage from "./features/account/user-information";
import AccountSettingPage from "./features/account/account-setting";
import ContactFriendPage from "./features/contact/contact-friend";
import ContactGroupPage from "./features/contact/contact-group";
import ContactInvitationPage from "./features/contact/invitations";
import ContactSearchPage from "./features/contact/contact-search";

function App() {
    const auth = useAppSelector(state => state.auth);

    const router = createBrowserRouter([{
        path: Screens.HOME,
        element: auth.user ? <MainLayout /> : <Navigate to={Screens.SIGNIN} />,
        children: [{
            path: Screens.HOME,
            element: <ChatPage/>,
        }, {
            path: Screens.CONTACT,
            element: <ContactPage />,
            children: [{
                path: Screens.CONTACT_INVITATIONS,
                element: <ContactInvitationPage />
            }, {
                path: Screens.CONTACT_GROUP,
                element: <ContactGroupPage />
            }, {
                path: Screens.CONTACT,
                element: <ContactFriendPage />
            }, {
                path: Screens.CONTACT_SEARCH,
                element: <ContactSearchPage />
            }, ]
        }, {
            path: Screens.ACCOUNT,
            element: <AccountPage />,
            children: [{
                path: Screens.CHANGE_PASSWORD,
                element: <ChangePasswordPage/>
            }, {
                path: Screens.ACCOUNT,
                element: <UserInformationPage/>
            }, {
                path: Screens.ACCOUNT_SETTING,
                element: <AccountSettingPage/>,
            },],
        }, {
            path: Screens.LOGOUT,
            element: <LogoutPage/>,
        }],
    }, {
        path: Screens.ROOT,
        element: auth.user ? <Navigate to={Screens.HOME} /> : <AppLayout />,
        children: [{
            path: Screens.ROOT,
            element: <Navigate to={Screens.SIGNIN}/>
        }, {
            path: Screens.SIGNUP,
            element: <SignUpPage/>
        }, {
            path: Screens.SIGNIN,
            element: <SignInPage/>
        }, {
            path: Screens.FORGOT_PASSWORD,
            element: <ForgotPasswordPage/>,
        }, {
            path: Screens.CONFIRM_RESET_PASSWORD,
            element: <ConfirmResetPassword />,
        }, {
            path: Screens.ACTIVATE_ACCOUNT,
            element: <ActivateAccountPage />,
        }]
    }, {
        path: Screens.FALL_OUT,
        element: <NotFoundPage/>,
    }]);

  return (
      <Grommet className="App" theme={{
          formField: {
              label: {
                  requiredIndicator: true
              }
          }
      }}>
          <RouterProvider router={router} />
      </Grommet>
  )
}

export default App
