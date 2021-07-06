const resources = {
    node : {
            names : {
                dpeep : "dpeep",
                profile : "profile",
                people: "people",
                peopleMetadata: "peopleMetadata",
                tweet: "tweet",
                tweets: "tweets",
                tweetsIndex: "tweetsIndex",
                relationships: "relationships",
                relationshipsIndex: "relationshipsIndex",
                replys: "replys",
                claims: "claims",
                claimsIndex: "claimsIndex",
                distrust: "distrust",
                confirm: "confirm",
                reject: "reject",
                trusted: "trusted",
                distrusted: "distrusted",
                latest: "latest",
                delete: "delete",
                next: "next",
                comments: "comments",
                userIndex: "userIndex",
                trust: "trust",
                follow : "follow",
                neutral: "neutral",
                mute: "mute",
                block: "block"

            },
            envelope: {
                _id: undefined,
                _sig: undefined
            },
            tweet : {
                text : '',
                tags : '',
            },
            comment : {
                //id hash of data
                text: '',
                tags : undefined,
                createdAt: undefined
            },
            profile : {
                handle : undefined,
                displayname : undefined,
                coverPhoto: undefined,
                avatar: undefined,
                bio : undefined,
                location: undefined,
                website : undefined,
                dob : undefined
            
            
            }
    }
}

export default resources;