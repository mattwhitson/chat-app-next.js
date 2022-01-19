import { useContext, useEffect, useState } from "react";
import chatService from "../services/chatService";
import { SocketContext } from "../contexts/SocketContext";
import { UserContext } from "../contexts/UserContext";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import dynamic from "next/dynamic";

//this package doesn't work with SSR so I had to dynamically import it after the page had been loaded on the server
const EmojiPicker = dynamic(() => import("./EmojiPicker"), {
  ssr: false,
});

const MessageBox = ({ messages, id, friend, setMessages, user }) => {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const socket = useContext(SocketContext);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("hello");
    if (message === "") return;

    const messageToSend = message;
    setMessage("");

    const msg = await chatService
      .sendMessage(messageToSend, id, user)
      .then((response) => response.data)
      .catch((err) => console.error(err));

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: friend._id,
      msg,
    });

    socket.emit("updatedChat", {
      username: user.username,
      receiverId: friend._id,
    });

    setMessages(messages.concat(msg));
  };

  //grows text area courtesty of stack overflow :)
  useEffect(() => {
    var textarea = document.getElementById("text-input");
    var limit = 400; //height limit

    textarea.oninput = () => {
      textarea.style.height = "";
      textarea.style.height = Math.min(textarea.scrollHeight, limit) + "px";
    };
  }, []);

  return (
    <form
      className="flex mt-auto p-2 bg-gray-800 items-center"
      onSubmit={sendMessage}
    >
      <textarea
        id="text-input"
        onChange={({ target }) => setMessage(target.value)}
        value={message}
        className="flex flex-grow focus:outline-none h-10 dark:bg-gray-600 resize-none scrollbar-hide"
      />
      {showEmojis && <EmojiPicker message={message} setMessage={setMessage} />}

      <EmojiHappyIcon
        className="h-6 mx-1 text-white dark:text-gray-500 mt-auto mb-2"
        onClick={() => {
          setShowEmojis(!showEmojis);
        }}
      />
      <button
        type="submit"
        className="px-3 py-1 rounded-md bg-blue-500 mt-auto mb-1"
      >
        Send
      </button>
    </form>
  );
};

export default MessageBox;
