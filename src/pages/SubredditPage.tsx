import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "../styles/SubredditPage.css";
import PostCard from "../components/Postcard";

const SubredditPage = () => {
  const { subredditName } = useParams();
  const subReddit = useQuery(api.subreddit.get, { name: subredditName || "" });

  if (subReddit === undefined) {
    return <p>Loading...</p>;
  }

  if (!subReddit) {
    return (
      <div className="content-container">
        <div className="not-found">
          <h1>
            <p>The subreddit r/{subredditName} does not exist.</p>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="subreddit-banner">
        <h1>r/{subReddit.name}</h1>
        {subReddit.description && <p>{subReddit.description}</p>}
      </div>

      <div className="posts-container">
        {subReddit.posts.length === 0 ? (
          <div className="no-posts">
            <h1>No posts in this subreddit. Be the first one to post!</h1>
          </div>
        ) : (
          subReddit.posts.map((post) => (
            <PostCard key={post._id} post={post} showSubreddit={false} />
          ))
        )}
      </div>
    </div>
  );
};

export default SubredditPage;
