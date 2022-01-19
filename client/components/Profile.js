import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { storage } from "../firebase";
import userService from "../services/userService";
import Cookies from "js-cookie";

const Profile = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef();

  const addProfilePicture = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  //uploads image to firebase storage bucket, then uploads firebase image url to database
  useEffect(() => {
    const addProfilePicture = async () => {
      if (selectedFile) {
        if (loading) return;
        setLoading(true);

        const imageRef = ref(storage, `profile/${user?._id}/picture`);

        await uploadString(imageRef, selectedFile, "data_url").then(
          async () => {
            const downloadURL = await getDownloadURL(imageRef);
            const updatedUser = await userService
              .addProfilePicture(user, downloadURL)
              .then((response) => response.data)
              .catch((err) => console.error(err.message));

            if (updatedUser) {
              updatedUser = {
                ...updatedUser,
                token: user.token,
              };
              Cookies.set("user", JSON.stringify(updatedUser));
            }
          }
        );
        setLoading(false);
        setSelectedFile(null);
      }
    };
    addProfilePicture();
    // eslint-disable-next-line
  }, [selectedFile]);

  return (
    <>
      <div className="flex mx-4 mt-4 border-b-[1px] border-gray-300 pb-8 ">
        {user?.profilePicture ? (
          <Image
            className="rounded-full"
            src={`${user?.profilePicture}`}
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
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-sm italic font-semibold">{user.email}</p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="mb-auto ml-auto py-1 px-2 rounded bg-blue-500"
        >
          Edit
        </button>
      </div>
      <div className="flex mt-2 ml-4 space-x-4">
        {editMode && (
          <>
            <button
              onClick={() => filePickerRef.current.click()}
              className="py-1 px-2 rounded bg-blue-500"
            >
              Set Profile Picture
            </button>
            <input
              ref={filePickerRef}
              type="file"
              hidden
              onChange={addProfilePicture}
            />
            <button className="py-1 px-2 rounded bg-blue-500">Edit Bio</button>
          </>
        )}
      </div>
      <div className="w-full pt-8 space-y-2">
        <h3 className="ml-4 text-2xl font-bold">Bio</h3>
        <p className="mx-4">{user?.bio}</p>
      </div>
    </>
  );
};

export default Profile;
