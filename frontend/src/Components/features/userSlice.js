import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("userDetails"));

const initialState = {
  isLoggedIn: !!savedUser,
  userDetails: savedUser || {
    fullName: "",
    token: "",
    socket: null,
    email: " ",
  },
  allUsers: [],
  roomId: "",
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
      console.log("userDetails are ", state.userDetails);
    },
    logoutUser: (state) => {
      state.userDetails = {
        fullName: "",
        token: "",
        socket: null,
        email: "",
      };
      state.isLoggedIn = false;
      state.roomId = "";
      localStorage.removeItem("userDetails");
    },
    getAllUser: (state) => {
      state.allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
  },
});
export const { logoutUser, setUserDetails, getAllUser, setRoomId } =
  UserSlice.actions;

export default UserSlice.reducer;
