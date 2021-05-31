import React from "react";
//import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
// import { FEED } from "../../queries/others";
// import { DELETE_TWEET } from "../../queries/tweet";
import { TrashIcon } from "../Icons";

const DeleteTweet = ({ item }) => {

  const handleDeleteTweet = async () => {

    //this.tweets.get(resources.node.names.delete).put(soul);

    // Some things to consider,
    // Update latest
    // There is no "on" event on tweets for other users.
    //item.getNode().put(null); 

    //await deleteTweetMutation();
    toast.success("Your tweet has been deleted");
  };

  return <TrashIcon loading={false} onClick={handleDeleteTweet} />;
};

export default DeleteTweet;
