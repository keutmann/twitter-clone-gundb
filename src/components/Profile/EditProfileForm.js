import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import useInput from "../../hooks/useInput";
import Input from "../Input";
import Button from "../../styles/Button";
import Form from "../../styles/Form";
import { displayError } from "../../utils";
import CoverPhoto from "../../styles/CoverPhoto";
import Avatar from "../../styles/Avatar";
import { uploadImage } from "../../utils";
import useUser from "../../hooks/useUser";


const EditProfileForm = ({ history }) => {

  const { user, setProfile } = useUser();

  const [avatarState, setAvatar] = useState("");
  const [coverPhotoState, setCoverPhoto] = useState("");

  const profile = user.profile;
  const loading = !profile; // The profile object has not been loaded yet.


  const displayname = useInput(profile && profile.displayname);
  const location = useInput(profile && profile.location);
  const website = useInput(profile && profile.website);
  const dob = useInput(profile && profile.dob);
  const avatar = useInput(profile && profile.avatar);
  const bio = useInput(profile && profile.bio);
  const coverPhoto = useInput(profile && profile.coverPhoto);

  const handle = user.id;


  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      let formData ={
          displayname: displayname.value,
          dob: dob.value,
          bio: bio.value,
          location: location.value,
          website: website.value,
          avatar: avatarState ? avatarState : avatar.value,
          coverPhoto: coverPhotoState ? coverPhotoState : coverPhoto.value
      };

      let updatedData = Object.assign(profile, formData);

      setProfile(updatedData);

      toast.success("Your profile has been updated 🥳");
    } catch (err) {
      return displayError(err);
    }

    [
      displayname,
      dob,
      location,
      website,
      avatar,
      coverPhoto,
    ].map((field) => field.setValue(""));

    history.push(`/${handle}`);
  };

  const handleCoverPhoto = async (e) => {
    setCoverPhoto(await uploadImage(e.target.files[0]));
  };

  const handleAvatar = async (e) => {
    setAvatar(await uploadImage(e.target.files[0]));
  };

  return (
    <Form lg onSubmit={handleEditProfile}>
      <div className="cover-photo">
        <label htmlFor="cover-photo-input">
          <CoverPhoto
            src={coverPhotoState ? coverPhotoState : coverPhoto.value}
            alt="cover"
          />
        </label>
        <input type="file" id="cover-photo-input" accept="image/*" onChange={handleCoverPhoto} />
      </div>

      <div className="avatar-input">
        <label htmlFor="avatar-input-file">
          <Avatar
            lg
            src={avatarState ? avatarState : avatar.value}
            alt="avatar"
          />
        </label>
        <input type="file" accept="image/*" id="avatar-input-file" onChange={handleAvatar} />
      </div>

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
          placeholder="Bio"
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
      <Input
        lg={true}
        text="Date of Birth"
        value={dob.value}
        onChange={dob.onChange}
      />
      <Input
        lg={true}
        text="Location"
        value={location.value}
        onChange={location.onChange}
      />
      <Button outline disabled={loading} type="submit">
        {loading ? "Saving" : "Save"}
      </Button>
    </Form>
  );
};

export default withRouter(EditProfileForm);
