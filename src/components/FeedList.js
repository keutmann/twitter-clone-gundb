import React, { useEffect, useState} from "react";
//import styled from "styled-components";
import Loader from "./Loader";
import Tweet from "./Tweet/Tweet";
import CustomResponse from "./CustomResponse";
import useUser from "../hooks/useUser";
import InfiniteScroll from "react-infinite-scroll-component";
//import { useIntersectionObserver } from 'react-intersection-observer-hook';

// const Wrapper = styled.div`
//   margin-bottom: 7rem;
// `;

const FeedList = () => {

  const { feedManager } = useUser(); 
  const [feed, setFeed] = useState();

  // Start the effect on page load
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    const callback = (data) => (data.length > 0) ? setFeed(data): true;
    feedManager.onFeedUdated.registerCallback(callback);

    return () => {
      feedManager.onFeedUdated.unregisterCallback(callback);
    };


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // loadNextBatch() {
  //   this.context.Feed.loadNextBatch();
  // }

  const fetchMoreData = () => {
    feedManager.loadNextBatch();
  };

  if(!feed) return <Loader />;


  // let more = (items.length > 0 && !this.loading) ? html`<${LoadMore} loadNext=${this.loadNextBatch.bind(this)}  />` : "";
  // //var pleaseWait = (items.length == 0 && this.loading) ? html`<div>Loading - Please wait a few seconds...</div>` : "";
  // let pleaseWait = "";
  let items = feed.map(item => 
    <Tweet key={item.soul} item={item} />
  );
  // if(items.length === 0)
  //   items = [<CustomResponse text="Follow some people to get some feed updates" />];

  return (
      //<div ref={rootRef}>
<InfiniteScroll
    dataLength={items.length} //This is important field to render the next data
    next={fetchMoreData}
    hasMore={true}
    loader={<h4>Loading...</h4>}
    endMessage={
      <p style={{ textAlign: 'center' }}>
        <b>Yay! You have seen it all</b>
      </p>
    }
    >
      {items}
    </InfiniteScroll>

  );
};

export default FeedList;
    // below props only if you need pull down functionality
// refreshFunction={this.refresh}
// pullDownToRefresh
// pullDownToRefreshThreshold={50}
// pullDownToRefreshContent={
//   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
// }
// releaseToRefreshContent={
//   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
// }
