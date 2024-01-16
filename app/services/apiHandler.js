import axios from "axios";

export const signIn = async (user) => {
  try {
    const res = await axios.post("/api/signin", user);
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const signOut = async () => {
  try {
    const res = await axios.post("/api/signout");
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
    const token = JSON.parse(localStorage.getItem("user"))?.token;
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
export const getAllPosts = async () => {
  try {
    const res = await axios.get("/api/posts/getallposts");

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const getAllUsers = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const res = await axios.get("/api/users/getusers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const getUser = async () => {
  try {
    const res = await axios.get("/api/users/getuser");

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const updateUserImages = async (image) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.post(`/api/users/updateuserImages`, image, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const deleteProfileImage = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.delete(`/api/users/deleteprofileimage`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const deleteBackgroundImage = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.delete(`/api/users/deletebackgroundimage`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const addEducation = async (formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.post(`/api/users/education/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

export const UpdateEducation = async (formData, id) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.put(`/api/users/education/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteEducation = async (id) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.delete(`/api/users/education/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const addAbout = async (formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.post(`/api/users/about/update`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteAbout = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.delete(`/api/users/about/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const addSkill = async (formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.post(`/api/users/skills/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const deleteSkill = async (id) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.delete(`/api/users/skills/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const addLanguage = async (formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.post(`/api/users/languages/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const deleteLanguage = async (id) => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const res = await axios.delete(`/api/users/languages/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};
export const test = async () => {
  try {
    const res = await axios.post("/api/test");
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const connect = async (id) => {
  const userId = {
    userIdToConnect: id,
  };

  try {
    const token = JSON.parse(localStorage.getItem("user")).token;

    const res = await axios.post("/api/users/connection/connect", userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const acceptConnect = async (id) => {
  const userId = {
    userIdToConnect: id,
  };

  try {
    const token = JSON.parse(localStorage.getItem("user")).token;

    const res = await axios.post(
      "/api/users/connection/acceptconnect",
      userId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const rejectConnect = async (id) => {
  const userId = {
    userIdToConnect: id,
  };

  try {
    const token = JSON.parse(localStorage.getItem("user")).token;

    const res = await axios.post(
      "/api/users/connection/rejectconnect",
      userId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const sendMessageToBE = async (id, messageContent) => {
  const userId = {
    userIdToConnect: id,
    messageContent,
  };
  try {
    const token = JSON.parse(localStorage.getItem("user")).token;

    const res = await axios.post("/api/users/chat/sendmessage", userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
