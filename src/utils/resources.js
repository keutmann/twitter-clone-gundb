const resources = {
    node : {
            names : {
                dpeep : "dpeep",
                profile : "profile",
                people: "people",
                tweets: "tweets",
                follow : "follow",
                trust: "trust",
                distrust: "distrust",
                confirm: "confirm",
                reject: "reject",
                trusted: "trusted",
                distrusted: "distrusted",
                latest: "latest",
                delete: "delete",
                next: "next",
                comments: "comments",
                userIndex: "userIndex"

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