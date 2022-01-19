import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import userService from "../services/userService";
import { useRouter } from "next/router";
import Moment from "react-moment";
import Image from "next/image";

const ChatTile = ({ chat, setOpenSidebar }) => {
  const router = useRouter();
  const [friend, setFriend] = useState();
  const [lastSeen, setLastSeen] = useState();
  const [profile, setProfile] = useState();
  const [user] = useContext(UserContext);

  useEffect(() => {
    const result = chat.users.filter((u) => u.username !== user.username);
    setFriend(result[0]);

    const lastSeen = chat?.lastSeen?.filter(
      (obj) => obj.username === user.username
    );
    setLastSeen(lastSeen);
    // eslint-disable-next-line
  }, [chat]);

  useEffect(() => {
    if (friend) {
      const getFriend = async () => {
        await userService
          .getUser(friend.username, user)
          .then((res) => setProfile(res.data))
          .catch((err) => console.error(err.message));
      };

      getFriend();
    }
    // eslint-disable-next-line
  }, [friend]);

  const goToChat = () => {
    setOpenSidebar && setOpenSidebar(false);
    router.push(`/chat/${chat._id}`);
  };

  if (!profile) return null;

  return (
    <a
      className="hover:cursor-pointer justify-center mt-2 mx-2"
      onClick={goToChat}
    >
      <div className="inline-block md:block p-2 md:py-4 items-center justify-center hover:bg-gray-100 rounded dark:hover:bg-gray-600 dark:text-gray-300">
        <div className="flex px-2">
          {profile?.profilePicture ? (
            <div className="relative bottom-0 h-10 w-10 min-w-[40px] rounded-full">
              <Image
                layout="fill"
                className="rounded-full"
                src={profile?.profilePicture}
                alt="profile-pic"
                priority={true}
              />
            </div>
          ) : (
            <div className="relative h-10 w-10 min-w-[40px] rounded-full">
              <Image
                layout="fill"
                className="rounded-full"
                src="/default-avatar.png"
                alt="profile-pic"
                priority={true}
              />
            </div>
          )}
          <div className="flex flex-col justify-evenly ml-2">
            <span className="top-0">{profile?.username}</span>
            <span className="sm:text-[10px] md:text-xs font-semibold">
              Last seen:{" "}
              <Moment className="italic font-normal" fromNow>
                {profile?.timestamp}
              </Moment>
            </span>
          </div>
          {lastSeen &&
            lastSeen[0]?.timestamp <
              chat.messages[chat.messages.length - 1]?.newMessage?.timestamp &&
            chat.messages[chat.messages.length - 1].newMessage.username ===
              profile.username &&
            router.asPath.split("/")[2] !== chat._id && (
              <div className="ml-auto h-6 w-6 rounded-full bg-blue-900"></div>
            )}
        </div>
      </div>
    </a>
  );
};

export default ChatTile;
