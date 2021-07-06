// import { DateTree } from "gun-util";
// import { DispatcherEvent } from "./DispatcherEvent";
// import resources from "./resources";
import Gun from 'gun/gun';
import { DispatcherEvent } from './DispatcherEvent';

export class TweetContainer {

    static compare = (a, b) => a.compare(b);
    static sort = (obj) => Object.entries(obj).map(([key,val], i) => val).sort(TweetContainer.compare);

    constructor(data) {
        this.soul = Gun.node.soul(data);
        const soulElem = this.soul.split('/');
        this.userId = soulElem.shift(); // Get user ID, should be the same as Owner
        soulElem.shift(); // Just shift dpeep
        this.category = soulElem.shift(); 

        // Based on DateTime UTC format
        //this.id = `${soulElem[0]}-${soulElem[1]}-${soulElem[2]}T${soulElem[3]}:${soulElem[4]}:${soulElem[5]}.${soulElem[6]}Z`
        //this.id = `${soulElem[0]}`
        this.id = soulElem.shift(); 

        this.data = data;
        this.confirmedBy = {};
        
        this.onStateChange = new DispatcherEvent("onStateChange");
    }


    setOwner(owner) {
        this.owner = owner;
    }


    get node() {
        return this._node ?? (this._node = this.owner.node.tweets.get(this.id));
    }
    
    set node(node) {
        this._node = node;
    }


    compare(target) {
        return this.id > target.id ? -1 : 1;
    }
}