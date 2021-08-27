import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import useInput from "../../hooks/useInput";
import Input, { Wrapper } from "../Input";
import Button from "../../styles/Button";
import Form from "../../styles/Form";
import { displayError } from "../../utils";
//import CoverPhoto from "../../styles/CoverPhoto";
import AvatarIdenticon from "../AvatarIdenticon";
//import { uploadImage } from "../../utils";
import useUser from "../../hooks/useUser";
import Avatar from "../../styles/Avatar";


const EditProfileForm = ({ history }) => {

  const { user } = useUser();

  const [avatarState, setAvatar] = useState("");
//  const [coverPhotoState, setCoverPhoto] = useState("");

  const profile = user.profile;

  const displayname = useInput(profile.displayname);
  //const location = useInput(profile && profile.location);
  const website = useInput(profile.website);
  //const dob = useInput(profile && profile.dob);
  const avatar = useInput(profile.avatar);
  const bio = useInput(profile.bio);
  const coverPhoto = useInput(profile.coverPhoto || '/tropical_paradise_204378.jpg');

  const handle = user.id;


  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      let formData ={
          displayname: displayname.value+'',
          bio: bio.value+'',
          website: website.value+'',
          avatar: avatarState ? avatarState : (avatar.value) ? avatar.value: '',
          //coverPhoto: coverPhotoState ? coverPhotoState : coverPhoto.value,
          coverPhoto: '',
          location: '',
          dob : ''
      };

      let updatedData = Object.assign(profile, formData);

      user.node.profile.put(updatedData);

      toast.success("Your profile has been updated 🥳");
    } catch (err) {
      return displayError(err);
    }

    [
      displayname,
      // dob,
      // location,
      website,
      avatar,
      coverPhoto,
    ].map((field) => field.setValue(""));

    history.push(`/${handle}`);
  };

  //const handleCoverPhoto = async (e) => {
    //setCoverPhoto(await uploadImage(e.target.files[0]));
  //};

  // const photoUpload = (e: any) => {
  //   e.preventDefault();
  //   const reader = new FileReader();
  //   const file = e.target.files[0];
  //   console.log("reader", reader)
  //   console.log("file", file)
  //   if (reader !== undefined && file !== undefined) {
  //     reader.onloadend = () => {
  //       //setFile(file)
  //       //setSize(file.size);
  //       //setName(file.name)
  //       //setImagePreview(reader.result)

  //     }
  //     reader.readAsDataURL(file);
  //   }
  // }

  function ResizeImage(file, cb) {
    // Read in file
      // Load the image
      var reader = new FileReader();
      reader.onload = function (readerEvent) {
          var image = new Image();
          image.onload = function (imageEvent) {

              // Resize the image
              var canvas = document.createElement('canvas'),
                  max_size = 120,// TODO : pull max size from a site config
                  width = image.width,
                  height = image.height;

              if (width > height) {
                  if (width > max_size) {
                      height *= max_size / width;
                      width = max_size;
                  }
              } else {
                  if (height > max_size) {
                      width *= max_size / height;
                      height = max_size;
                  }
              }
              canvas.width = width;
              canvas.height = height;
              canvas.getContext('2d').drawImage(image, 0, 0, width, height);

              var dataUrl = canvas.toDataURL('image/jpeg');
              cb(dataUrl);
          }
          image.src = readerEvent.target.result;
      }
      reader.readAsDataURL(file);
};


    const handleAvatar = async (e) => {
    console.log("file", e.target.files[0]);
    let file = e.target.files[0];
    if (file) {
      ResizeImage(file, (dataurl) => {
        setAvatar(dataurl);
      });
      // const reader = new FileReader();
      // reader.onload = (readerEvt) => {
      //   let binaryString = readerEvt.target.result;
      // }

      // reader.readAsDataURL(file)
    }

  };

  return (
    <Form lg onSubmit={handleEditProfile}>
      {/* <Wrapper>
        <label>Cover Photo</label>
        <label htmlFor="cover-photo-input">
          <CoverPhoto
            src={coverPhotoState ? coverPhotoState : coverPhoto.value}
            alt="cover"
          />
        </label>
        <input type="file" id="cover-photo-input" accept="image/*" onChange={handleCoverPhoto} />
      </Wrapper> */}

      <Wrapper>
        <label>Avatar Photo</label>
        <label htmlFor="avatar-input-file">
          
          { avatarState && avatarState.length > 0 ?
          <Avatar
            lg
            src={avatarState ? avatarState : avatar.value}
            alt="avatar"
          />
          : 
          <AvatarIdenticon id={handle} profile={profile} />
          }
        </label>
        <input type="file" accept="image/*" id="avatar-input-file" onChange={handleAvatar} />
      </Wrapper>

      <Input
        lg={true}
        text="Display Name"
        value={displayname.value}
        onChange={displayname.onChange}
      />
      <div className="bio-wrapper">
        <label className="bio" htmlFor="bio">
          Bio
        </label>
        <TextareaAutosize
          id="bio"
          placeholder="Write your bio here..."
          value={bio.value}
          onChange={bio.onChange}
        />
      </div>
      <Input
        lg={true}
        text="Website"
        value={website.value}
        onChange={website.onChange}
      />
      {/* <Input
        lg={true}
        text="Date of Birth"
        value={dob.value}
        onChange={dob.onChange}
      /> */}
      {/* <Input
        lg={true}
        text="Location"
        value={location.value}
        onChange={location.onChange}
      /> */}
      <Button outline type="submit">Save</Button>
    </Form>
  );
};

export default withRouter(EditProfileForm);
