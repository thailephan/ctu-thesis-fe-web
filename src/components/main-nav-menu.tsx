import { useNavigate } from "react-router-dom";
import Screens from "../common/screens";
import {Tip} from "./index";
import { Chat, ContactInfo, UserManager } from "grommet-icons";
import { Button } from "grommet";

function MainNavMenu() {
    const navigate = useNavigate();
    const menus: any[] = [{
        title: "Tin nhắn",
        path: Screens.HOME,
        icon: <Chat/>,
        regexp: new RegExp(`^${Screens.HOME}$`, "i"),
    }, {
        title: "Danh sách liên hệ",
        path: Screens.CONTACT,
        icon: <ContactInfo/>,
        regexp: new RegExp(`^${Screens.CONTACT}(\/.*)?$`, "i"),
    }, {
        title: "Tài khoản",
        path: Screens.ACCOUNT,
        icon: <UserManager/>,
        regexp: new RegExp(`^${Screens.ACCOUNT}(\/.*)?$`, "i"),
    },];

    return <>{menus.map(menu => {
            return <Tip title={menu.title} key={menu.path}>
                <Button primary={menu.regexp?.test(location.pathname) || false} icon={menu.icon} onClick={() => navigate(menu.path)}/>
            </Tip>
        })
    }</>;
}

export default MainNavMenu;