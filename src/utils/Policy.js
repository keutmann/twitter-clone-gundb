export class Policy {

    static TweetPolicy = { 
        hideDeleted: true,
        hideBlocked: true
    }

    static addTweet(tweet, user, usersBlock) {

        const policy = Object.assign(Policy.TweetPolicy, user?.policy);

        if(tweet?.data?.deleted && policy.hideDeleted)
            return false;

        if(usersBlock && usersBlock[tweet.owner.id] && policy.hideBlocked)
            return false;

        // user.policy settings may have other rules.

        return true;
    }
}