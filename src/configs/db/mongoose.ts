import mongoose from "mongoose";

//Get the default connection

const path = process.env.DBURL || "";
const mainDb = () => {
  mongoose
    .connect(path)
    .then((res) => {
      console.log("is connected");
    })
    .catch((e) => {
      console.log(e);
    });
};

export default mainDb;
