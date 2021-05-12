import Gun from 'gun/gun';
import 'gun/sea';

const PEEPS = "peeps";
const PREVIUOS_MESSAGE = "PM";
const LATEST_MESSAGE = "LM";
const REPLIES = "RL";

var user = gun.user(); 

function addUserMessage({ collectionName, message, replyEnabled }) {
    let collection = user.get(collectionName);
    let messageId = Sha256(JSON.stringify(message));

    let gunMessage = collection.get(messageId);
    gunMessage.put(message);
    gunMessage.get(PREVIUOS_MESSAGE).put(collection.get(LATEST_MESSAGE));
    collection.get(LATEST_MESSAGE).put(gunMessage);

    if(message.repliesEnabled) {
        var openRepliesCollection = dpeep.get(REPLIES);
        let openReplies = openRepliesCollection.get(messageId);
        gunMessage.get(REPLIES).put(openReplies);
    }
    return gunMessage;
}
  
// function listMessages(peep) {
//     peep.once(p => {
//         if(!p) return; // Undefined = no peep

//         console.log(p);
//         printPeeps(peep.get('previousPeep'));
//     })
// }



