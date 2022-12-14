import { Box, Button, Form, Spinner } from 'grommet';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from "../../components";
import ContactFriendItem from "./components/contact-friend-item";
import ReceivedInvitationItem from "./components/received-invitation-item";
import SentInvitationItem from "./components/sent-invitation-item";
import ContactUserItem from "./components/contact-user-item";
import {IFriend, IReceivedInvitation, ISentInvitation, IUser} from "../../common/interface";
import {apiService} from "../../services";
import Helpers from "../../common/helpers";
import { useSearchParams, useNavigate } from "react-router-dom";
import {socket} from "../../components/socket";

let isSearched = false;
function ContactSearchPage() {
    const [searchParams, ] = useSearchParams();
    const [loading ,setLoading] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [friends, setFriends] = useState<IFriend[]>([]);
    const [invitationSent, setInvitationSent] = useState<ISentInvitation[]>([]);
    const [invitationReceived, setInvitationReceived] = useState<IReceivedInvitation[]>([]);
    let length = users.length + friends.length + invitationSent.length + invitationReceived.length;

    useEffect(() => {
        socket.on("invitation/cancel", ({emitterId, senderId }) => {
            setInvitationSent(i => i.filter((a: any) => a.id === senderId));
        });
        try {
            init();
        } catch (e) {
            console.error("Use effect/contact-search", e);
        }
        return () => {
            isSearched = false;
        }
    }, [searchParams])

    async function init(searchText?: string) {
        if (!Helpers.isNullOrEmpty(searchText)) {
            isSearched = true;
            setLoading(true);
            const [_f, _u, _s, _r]: any[] = [[], [], [], []];
            const result = await apiService.Get({
                path: "users/search",
                query: {
                    searchText,
                }
            });
            if (result.data.success) {
                result.data.data.forEach((d: any) => {
                    if (d.isFriend) {
                        _f.push(d);
                    } else if(d.isInvitationSender) {
                        _s.push(d);
                    } else if (d.isInvitationReceiver) {
                        _r.push(d);
                    } else {
                        _u.push(d);
                    }
                });
                setUsers(_u);
                setFriends(_f);
                setInvitationSent(_s);
                setInvitationReceived(_r);
            }

            setLoading(false);
        }
    }

    const _onSubmit = async (e: any) => {
        await init(e.value.text?.toLowerCase().trim());
    }

    const renderFriends = () => {
        if (friends.length === 0) {
            return <></>;
        }
        return <Box style={{
            maxHeight: 400,
        }} className="overflow-auto">
            <div>Bạn bè</div>
            {friends.map((f: any) => <ContactFriendItem {...f} key={f.id}/>)}
        </Box>
    }
    const renderInvitations = () => {
        if (invitationReceived.length === 0 && invitationSent.length === 0) {
            return <></>;
        }
        return <Box style={{
            maxHeight: 400,
        }} className="overflow-auto">
            <div>Lời mời kết bạn</div>
            {invitationReceived.map((f: any) => <SentInvitationItem {...f} receiverId={f.id} key={f.id}/>)}
            {invitationSent.map((f: any) => <ReceivedInvitationItem {...f} senderId={f.id} key={f.id}/>)}
        </Box>
    }
    const renderElse = () => {
        if (users.length === 0) {
           return <></>;
        }
        return (<Box style={{
            maxHeight: 400,
        }} className="overflow-auto">
            <div>Khác</div>
            {users.map((f: any) => <ContactUserItem {...f} key={f.id}/>)}
        </Box>);
    }
    return (
        <Box>
            <div>
                <Form onSubmit={_onSubmit} className="d-flex gap-3">
                    <TextInput name={"text"} label={""} placeholder={"Nhập email hoặc họ tên để tìm kiếm"} formFieldProps={{
                        className: "flex-grow-1 mb-0"
                    }} />
                   <Button primary className="p-1 rounded" type="submit">Tìm kiếm</Button>
               </Form>
               {loading ? <div className="d-flex mt-3 w-100 align-items-center justify-content-center"><Spinner /></div> :
                   (isSearched && <Box className="mt-3 gap-3">
                       {
                           length > 0
                               ?  (<>
                                   {renderFriends()}
                                   {renderInvitations()}
                                   {renderElse()}
                               </>)
                        : <span>Không tìm thấy</span>}
                   </Box>)}
           </div>
        </Box>
    );
}

export default ContactSearchPage;