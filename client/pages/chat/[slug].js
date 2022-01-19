import chatService from "../../services/chatService";
import userService from "../../services/userService";
import { useContext, useEffect, useState } from "react";
import FriendChatCard from "../../components/FriendChatCard";
import ChatScreen from "../../components/ChatScreen";
import MessageBox from "../../components/MessageBox";
import { UserContext } from "../../contexts/UserContext";
import { SocketContext } from "../../contexts/SocketContext";

export const getServerSideProps = async (context) => {
  let getFriend;
  let messages;
  const user = JSON.parse(context.req.cookies.user);
  const path = context.req.headers.referer;

  const chat = await chatService
    .getChatServerSide(context.params.slug, context.req.headers.cookie, user)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  if (chat) {
    getFriend = chat.users.filter((u) => u.username !== user.username);
    messages = chat.messages.map((message) => message.newMessage);
  }

  const friend = await userService
    .getUserServerSide(getFriend[0].username, context.req.headers.cookie)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return {
    props: {
      key: context.params.slug,
      slug: context.params.slug,
      friend: friend || "",
      messagesInitial: messages || "",
      chat: chat || "",
      user: user || "",
      prevPath: path || "",
    },
  };
};

const Chat = ({ slug, friend, messagesInitial, user, prevPath }) => {
  const [messages, setMessages] = useState(messagesInitial);
  const socket = useContext(SocketContext);

  // useEffect(() => {
  //   if (prevPath.split("/")[4])
  //     chatService
  //       .updateLastSeen(user.username, prevPath.split("/")[4])
  //       .then((res) => console.log(res))
  //       .catch((error) => console.log(error));

  //   socket.emit("updatedChat", {
  //     receiverId: friend._id,
  //     username: username,
  //   });
  //   // eslint-disable-next-line
  // }, [friend]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] bg-[#f7f7f7] border-r-[1px] border-gray-200 relative dark:bg-gray-800 dark:border-black">
      <FriendChatCard friend={friend} />
      <ChatScreen
        messages={messages}
        username={user.username}
        setMessages={setMessages}
        id={slug}
        friend={friend}
      />
      <MessageBox
        messages={messages}
        id={slug}
        friend={friend}
        setMessages={setMessages}
        user={user}
      />
    </div>
  );
};

export default Chat;
