//import Gun from 'gun/gun';
import axios from "axios";
import { toast } from "react-toastify";
//import moment from 'moment'

export const displayError = (err) => {
toast.error(err.message);
console.log(err.stack);
}
  //toast.error(err.message.split(":")[1].trim().replace(".", ""));

export const sortFn = (a, b) => {
  var dateA = new Date(a.createdAt).getTime();
  var dateB = new Date(b.createdAt).getTime();
  return dateA < dateB ? 1 : -1;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "twitter-build");

  let toastId = null;
  const { data } = await axios.request({
    method: "POST",
    url: process.env.REACT_APP_CLOUDINARY_URL,
    data: formData,
    onUploadProgress: (p) => {
      const progress = p.loaded / p.total;

      if (toastId === null) {
        toastId = toast("Upload in progress", {
          progress,
          bodyClassName: "upload-progress-bar",
        });
      } else {
        toast.update(toastId, {
          progress,
        });
      }
    },
  });

  toast.dismiss(toastId);

  return data.secure_url;
};

export const instantiateNewGun = (Gun, opts) => () => {
  return Gun(opts);
};




// export const createMessageContainer = (tweet, userContainer) => {
//   const soul = Gun.node.soul(tweet);
//   const id = soul.split('/').pop();
//   const date = moment(tweet.createdAt);


//   const item = {
//       soul: soul,
//       id: id,
//       tweet: tweet,
//       user: userContainer,
//       createdAt: date,

//       getNode : function() {
//         return userContainer.tweets.get(this.id);
//       }
//   }
//   return item;
// };
