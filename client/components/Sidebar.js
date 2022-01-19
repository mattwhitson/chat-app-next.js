import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { UserContext } from "../contexts/UserContext";
import chatService from "../services/chatService";
import userService from "../services/userService";
import ChatTile from "./ChatTile";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const Sidebar = () => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [user] = useContext(UserContext);
  const socket = useContext(SocketContext);
  const router = useRouter();

  //socket listening for newly added chat, if new chat refetch all chats
  useEffect(() => {
    socket.on("getChat", (data) => {
      console.log(data);
      chatService
        .getChats(user)
        .then((response) => {
          setChats(response.data);
        })
        .catch((err) => console.log(err.response.data.message));
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      socket.on("updateChats", (data) => {
        chatService
          .getChats(user)
          .then((response) => {
            setChats(response.data);
          })
          .catch((err) => console.log(err));
      });
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user) {
      chatService
        .getChats(user)
        .then((response) => {
          setChats(response.data);
        })
        .catch((err) => console.log(err.response.data.message));
    }
    // eslint-disable-next-line
  }, [user, router]);

  const createChat = async (event) => {
    event.preventDefault();
    if (search === "") return;
    const newChat = {
      username: user.username,
      friend: search,
      token: user.token,
    };

    await chatService
      .createChat(newChat)
      .then((response) => {
        setReceiverId(response._id);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setError(err.response.data.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
      });

    await chatService
      .getChats(user)
      .then((response) => {
        setChats(response.data);
      })
      .catch((err) => console.log(err.response.data.message));

    await userService
      .getUser(newChat.username, user)
      .then((response) => setReceiverId(response.data._id))
      .catch((err) => console.log(err.response.data.message));

    socket.emit("createChat", {
      username: user?.username,
      receiverId,
    });

    setReceiverId(null);
    setSearch("");
  };

  return (
    <div className="hidden h-full sm:w-1/3 lg:w-1/4 bg-gray-200 sm:block relative dark:bg-gray-700">
      <div className="flex flex-col space-y-4">
        {error && (
          <div className="absolute flex w-full justify-center top-0 left-0">
            <div className="relative text-red-500 text-xs mt-1">{error}</div>
          </div>
        )}
        <form className="md:flex md:relative" onSubmit={createChat}>
          <input
            className="mt-3 w-3/4 focus:outline-none  rounded-sm mx-2 mb-2 md:w-full sm:pl-6 dark:bg-gray-600"
            placeholder="Search"
            onChange={({ target }) => setSearch(target.value)}
          />
          <SearchIcon className="h-4 absolute top-4 left-3" />
          <button type="submit" hidden></button>
        </form>
        {chats && chats.map((chat) => <ChatTile key={chat._id} chat={chat} />)}
      </div>
    </div>
  );
};

export default Sidebar;
