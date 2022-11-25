export {};
// function ChatPage({userId}: IChatPageProps) {
//     const [channels, setChannels] = useState<IChannel[]>([]);
//     const [msg, setMsg] = useState<string>('');
//     const [messages, setMessages] = useState<any>([]);
//     const [selectedChannelId, setSelectedChannelId] = useState<any>(null);
//
//     useEffect(() => {
//         const accessToken = accessTokens[userId].value;
//         const currentUser = Helpers.parseJwt(accessToken);
//
//         socket = io("http://127.0.0.1:4002", {
//             auth: {
//                 accessToken,
//             },
//         });
//         // socket.emit("leave", "I'l leave dont call me");
//         // socket.emit("init", {userId: 1});
//
//         socket.on("chat/message/send", (args) => {
//             const {message, channelId} = args;
//             setMessages((messages: any) => {
//                 const m = [...messages];
//                 const channelMessage = m[parseInt(channelId) - 1];
//                 if (channelMessage.findIndex((m: any) => m.id === message.id) === - 1) {
//                     channelMessage.push(message);
//                     channelMessage.sort((a, b) => a.id - b.id);
//                     console.log(m);
//                 }
//                 return m;
//             });
//         });
//         socket.on("chat/channel/sync", ({channels}) => {
//             console.log(channels);
//             setChannels(channels);
//         });
//
//         socket.on("chat/message/received", () => {
//             console.log('message received');
//         });
//         socket.on("chat/message/seen", () => {
//             console.log('message received');
//         });
//         socket.on("chat/message/sync", ({messages}) => {
//             console.log("sync", messages);
//             setMessages(messages);
//         });
//         return () => {
//             socket.off("chat/message/send");
//             socket.off("chat/channel/sync");
//             socket.off("chat/message/sync");
//             socket.off("chat/message/received");
//             socket.off("chat/message/seen");
//             socket.disconnect();
//         }
//     }, [])
//
//     useEffect(() => {
//         if (selectedChannelId) {
//             socket?.emit("chat/message/sync", { channelId: `${selectedChannelId}` });
//         }
//     }, [selectedChannelId])
//
//     return (
//         <div className="d-flex flex-wrap p-4">
//             <div className="d-flex flex-column gap-2 bg-white col-4">
//                 {channels?.map((channel: IChannel) => {
//                     return <button key={channel.id} style={{
//                         display: "flex",
//                         gap: ".5rem",
//                         alignItems: "center",
//                         border: "none",
//                         backgroundColor: selectedChannelId === channel.id ? "#008C4E" : "white",
//                         color: selectedChannelId === channel.id ? "white" : "#000d",
//                     }} onClick={() => {setSelectedChannelId(channel.id);}} className="shadow-sm m-2 rounded px-3 py-2">
//                         {channel.avatarUrl ? <img src={channel.avatarUrl} alt={"al"} /> : (
//                             <div style={{
//                                 width: 40,
//                                 height: 40,
//                                 backgroundColor: "#444",
//                                 borderRadius: "50%",
//                             }}></div>
//                         )}
//                         <div style={{
//                             marginLeft: "1rem"
//                         }}>
//                             <div>{channel.name || "channel-" + channel.id}</div>
//                             <div style={{
//                                 marginTop: ".25rem",
//                             }}>
//                                 {channel.latestMessage ? <div>{channel.latestMessage.message}</div> : <div>Không có tin nhắn</div>}
//                             </div>
//                         </div>
//                     </button>
//                 })}
//             </div>
//             {selectedChannelId ? (
//                 <div className="col-8 mh-100 d-flex flex-column">
//                     <div className="d-flex flex-column gap-3 w-100 rounded p-2" style={{
//                         border: "1px solid #777",
//                         backgroundColor: "#ddd",
//                         overflow: "auto",
//                         height: 600
//                     }}>
//                         {messages?.find((m: any) => `${m?.[0].channelId}` === selectedChannelId?.toString())?.map((msg: any) => {
//                             return (
//                                 <div key={msg.channelId + msg.id} className="d-flex gap-2">
//                                     <div>
//                                         {/* Avatar */}
//                                         {msg.senderAvatarUrl ? <img src={msg.senderAvatarUrl} alt={"al"} /> : (
//                                             <div style={{
//                                                 width: 40,
//                                                 height: 40,
//                                                 backgroundColor: "#444",
//                                                 borderRadius: "50%",
//                                             }}></div>
//                                         )}
//                                     </div>
//                                     <div className="bg-white rounded p-2" style={{
//                                         minWidth: 100,
//                                         maxWidth: 600,
//                                     }}>
//                                         <div>
//                                             {msg.senderFullName}
//                                         </div>
//                                         <div className="pt-1 pb-2">
//                                             {msg.message}
//                                         </div>
//                                         <div>
//                                             <span>{format(msg.createdAt, "HH:mm")}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         })}
//                     </div>
//                     <div className="d-flex gap-1 align-items-center mt-2">
//                         <input type="text" name="a" id="a" value={msg} onChange={(e) => setMsg(e.target.value)} className="rounded p-2 w-100" />
//                         <button className="btn btn-primary px-4 py-2" onClick={() => {
//                             socket.emit('chat/message/send', {message: msg, channelId: selectedChannelId, messageTypeId: 1, replyForId: null});
//                             setMsg("");
//                         }}>Gửi</button>
//                     </div>
//                 </div>
//             ): <div className="col-8 d-flex align-items-center justify-content-center">
//                 <h5>Chọn kênh để chat</h5>
//             </div>}
//         </div>
//     );
// }

