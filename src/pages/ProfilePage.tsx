import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "../components/Postcard";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { username } = useParams();
  // Get users posts
  const posts = useQuery(api.post.userPosts, {
    authorUsername: username || "",
  });

  if (posts === undefined) {
    return (
      <div className="content-container">
        <div className="profile-header">
          <h1>u/{username}</h1>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="profile-header">
        <h1>u/{username}</h1>
        <p style={{ color: "#7c7c7c" }}>Posts : 0</p>
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">No posts</div>
        ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} showSubreddit={true} />
            ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
