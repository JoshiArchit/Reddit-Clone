import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FaArrowLeft } from "react-icons/fa";
import PostCard from "../components/Postcard";
import "../styles/PostPage.css";

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useQuery(api.post.getPost, { id: postId });

  if (!post) {
    return (
      <div className="post-page loading">
        <div className="container">...</div>
      </div>
    );
  }

  return (
    <div className="post-page">
      <div className="container">
        <div className="page-header">
          <div
            onClick={() => navigate(-1)}
            className="back-link"
            style={{ cursor: "pointer" }}
          >
            <FaArrowLeft />
            Back
          </div>
        </div>

        <PostCard post={post} showSubreddit={true} expandedView={true} />

      </div>
    </div>
  );
};

export default PostPage;
