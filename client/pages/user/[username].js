import userService from "../../services/userService";
import Image from "next/image";

export const getServerSideProps = async (context) => {
  const friend = await userService
    .getUserServerSide(context.params.username, context.req.headers.cookie)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return {
    props: {
      friend: friend || "",
    },
  };
};

const FriendProfile = ({ friend }) => {
  console.log(friend);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] w-full bg-[#f7f7f7]">
      <div className="flex mx-4 mt-4 border-b-[1px] border-gray-300 pb-8">
        {friend?.profilePicture ? (
          <Image
            className="rounded-full"
            src={friend?.profilePicture}
            height={80}
            width={80}
            priority={true}
          />
        ) : (
          <Image
            src={"/default-avatar.png"}
            height={80}
            width={80}
            priority={true}
          />
        )}
        <div className="flex flex-col justify-center ml-4">
          <p className="text-lg font-semibold">{friend.username}</p>
          <p className="text-sm italic font-semibold">{friend.email}</p>
        </div>
      </div>
      <div className="flex mt-2 ml-4 space-x-4"></div>
      <div className="w-full pt-8 space-y-2">
        <h3 className="ml-4 text-2xl font-bold">Bio</h3>
        <p className="mx-4">{friend?.bio}</p>
      </div>
    </div>
  );
};

export default FriendProfile;
