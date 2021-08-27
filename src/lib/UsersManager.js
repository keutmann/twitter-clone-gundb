import { UserContainer } from "./UserContainer";

export class UsersManager {
    constructor(gun) {
        this.users = {};
        this.gun = gun;
        this.block = {};
    }

    getUserContainer (gunUser) {
        let userContainer = new UserContainer(gunUser);

        let pubId = userContainer.id;
        this.users[pubId] = userContainer;

        return userContainer;
    }

    getUserContainerById (pubId) {
            if (pubId[0] === '~')
                pubId = pubId.substring(1);

            const user = this.users[pubId];
            if (user && user.node) return user; // Just return an exiting container is exist and node is set

            const gunUser = this.gun.user(pubId);

            return this.getUserContainer(gunUser); // Create a new one
    }



}