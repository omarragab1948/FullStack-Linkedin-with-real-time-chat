import axios from "axios";

export const signIn = async (user) => {
  try {
    const res = await axios.post("/api/signin", user);
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const signUp = async (user) => {
  try {
    const res = await axios.post("/api/signup", user);
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const addPost = async (post) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.post("/api/posts/addpost", post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const getPosts = async () => {
  try {
    const res = await axios.get("/api/posts/getposts");

    return res.data;
  } catch (e) {
    throw e;
  }
};

export const updateUserImages = async (image) => {
  console.log(image);
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.post(`/api/users/updateuser`, image, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
