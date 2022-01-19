import Link from "next/link";

const FriendChatCard = ({ friend }) => {
  return (
    <Link href={`/user/${friend.username}`}>
      <div className="flex w-full items-center bg-black py-2 px-4 md:h-20 hover:cursor-pointer">
        {friend?.profilePicture ? (
          <img
            className="h-10 w-10 md:h-14 md:w-14 rounded-full"
            src={friend.profilePicture}
            alt="profile-pic"
          />
        ) : (
          <img
            className="h-10 w-10 md:h-14 md:w-14 rounded-full"
            src="/default-avatar.png"
            alt="profile-pic"
          />
        )}
        <span className="text-xl md:text-2xl text-white ml-2">
          {friend?.username}
        </span>
      </div>
    </Link>
  );
};

export default FriendChatCard;
