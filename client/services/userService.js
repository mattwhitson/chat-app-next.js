import axios from "axios";

const register = async (user) => {
  const response = await axios.post(`/api/users/register`, user);

  return response;
};

const login = async (user) => {
  const response = await axios.post(`/api/users/authenticate`, user, {
    withCredentials: true,
  });

  return response;
};

const logout = async (user) => {
  const response = await axios.post(`/api/users/logout`, user, {
    withCredentials: true,
  });

  return response;
};

const getUser = async (username, user) => {
  const response = await axios.get(`/api/users/getuser/${username}`, {
    withCredentials: true,
  });

  return response;
};

const getUserServerSide = async (username, cookie) => {
  const response = await axios.get(
    `https://mattdwhitson.com/api/users/getuser/${username}`,
    {
      headers: {
        cookie,
      },
    },
    { withCredentials: true }
  );
  return response;
};

const addProfilePicture = async (user, downloadURL) => {
  const id = user._id;
  const data = { downloadURL, id };
  const response = await axios.post(`/api/users/addprofilepic`, data, {
    withCredentials: true,
  });

  return response;
};

const functions = {
  register,
  login,
  getUser,
  getUserServerSide,
  addProfilePicture,
  logout,
};

export default functions;
