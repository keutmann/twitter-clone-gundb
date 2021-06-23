import React from "react";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";
import { TrashIcon } from "../Icons";
import 'gun/lib/path';

const DeleteTweet = ({ item }) => {

  const { user:loggedInUser } = useUser(); 

  const handleDeleteTweet = async () => {

    // Remove from Feed
    // Delete text
    // Add deleted = true property to node.
 
    item.node.get("text").put("(Deleted)");
    item.node.get("deleted").put(true);

    toast.success("Your tweet has been deleted");
  };
    if(item.owner.id !== loggedInUser.id)
      return null; 

  return <TrashIcon loading={false} onClick={handleDeleteTweet} />;
};

export default DeleteTweet;
