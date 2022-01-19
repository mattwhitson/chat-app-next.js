import { useContext, useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { SocketContext } from "../contexts/SocketContext";
import chatService from "../services/chatService";
import { scrollToBottom, isURL } from "../utils/helperFunctions";

const ChatScreen = ({ messages, username, setMessages, id, friend }) => {
  const endOfMessagesRef = useRef();
  const [arrivingMessage, setArrivingMessage] = useState(null);
  const socket = useContext(SocketContext);

  //socket listening for new message, return the socket when component unmounts to avoid memory leak
  // also updates the last seen property in db, and then tells socket on server to notify other user
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivingMessage({
        id: data.senderId,
        msg: data.msg,
      });

      chatService
        .updateLastSeen(username, id)
        .then((res) => res)
        .catch((error) => console.log(error));
    });

    socket.emit("updatedChat", {
      receiverId: friend._id,
      username: username,
    });

    return () => socket.off("getMessage");
    // eslint-disable-next-line
  }, []);

  //when new message has been received, concat it to existing messages
  useEffect(() => {
    if (arrivingMessage && arrivingMessage.id === friend._id) {
      setMessages(messages.concat(arrivingMessage.msg));
    }
    // eslint-disable-next-line
  }, [arrivingMessage]);

  useEffect(() => {
    scrollToBottom(endOfMessagesRef);
  }, [messages]);

  

  return (
    <div className="h-full w-full overflow-y-scroll scrollbar-hide">
      {messages.length > 0 &&
        messages.map((message) =>
          message.username === username ? (
            <div key={message.timestamp} className="flex w-full my-1">
              <div className="flex flex-col bg-blue-400 ml-auto mr-1 p-2 rounded-lg max-w-[60%] dark:bg-blue-500 dark:text-gray-300">
                {isURL(message.message) ? (
                  <>
                    <img className="rounded-lg" src={message.image} />
                    <h4 className="font-semibold">{message.title}</h4>
                    <p className="text-sm">{message.description}</p>
                    <a
                      target="_blank"
                      className="underline break-words "
                      href={message.message}
                    >
                      {message.message}
                    </a>
                    <Moment className="text-[10px] ml-auto" fromNow>
                      {message.timestamp}
                    </Moment>
                  </>
                ) : (
                  <>
                    <p>{message.message}</p>
                    <Moment className="text-[10px] ml-auto" fromNow>
                      {message.timestamp}
                    </Moment>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div key={message.timestamp} className="flex w-full my-1">
              <div className="flex flex-col bg-gray-300 mr-auto ml-1 rounded-lg p-2 max-w-[60%] dark:bg-gray-500 dark:text-gray-300">
                {isURL(message.message) ? (
                  <div className="flex flex-col w-full">
                    <img className="rounded-lg" src={message.image} />
                    <h4 className="font-semibold">{message.title}</h4>
                    <p className="text-sm">{message.description}</p>
                    <a
                      target="_blank"
                      className="underline break-words"
                      href={message.message}
                    >
                      {message.message}
                    </a>
                    <Moment className="text-[10px] mr-auto" fromNow>
                      {message.timestamp}
                    </Moment>
                  </div>
                ) : (
                  <>
                    <p className="">{message.message}</p>
                    <Moment className="text-[10px] mr-auto" fromNow>
                      {message.timestamp}
                    </Moment>
                  </>
                )}
              </div>
            </div>
          )
        )}
      <div ref={endOfMessagesRef}></div>
    </div>
  );
};

export default ChatScreen;
