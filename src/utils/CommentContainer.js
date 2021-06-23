// import { DateTree } from "gun-util";
// import { DispatcherEvent } from "./DispatcherEvent";
// import resources from "./resources";
import Gun from 'gun/gun';

export class CommentContainer {

    constructor(data, getUser) {
        this.soul = Gun.node.soul(data);
        const soulElem = this.soul.split('/');
        this.userId = soulElem.shift(); // Get user ID, should be the same as Owner
        soulElem.shift(); // Just shift dpeep
        this.category = soulElem.shift(); 

        // Based on DateTime UTC format
        this.id = `${soulElem[0]}-${soulElem[1]}-${soulElem[2]}T${soulElem[3]}:${soulElem[4]}:${soulElem[5]}.${soulElem[6]}Z`

        this.data = data;
        this.confirmedBy = {};
        if(getUser)
            this.setOwner(getUser);

    }

    setOwner(getUser) {
        this.owner = getUser(this.userId);
    }

    get node() {
        return this._node ?? (this._node = this.owner.node.comments.get(this.id));
    }
    
    set node(node) {
        this._node = node;
    }

}