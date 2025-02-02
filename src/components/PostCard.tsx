import { useState } from "react";
import { FaRegCommentAlt, FaTrash } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import "../styles/PostCard.css";

interface Post {
  _id: Id<"post">;
  subject: string;
  body: string;
  _creationTime: number;
  authorId: string;
  imageUrl?: string;
  author?: { username: string };
  subreddit?: { name: string };
}

interface PostCardProps {
  post: Post;
  showSubreddit?: boolean;
  expandedView?: boolean;
}

interface PostHeaderProps {
  author?: { username: string };
  subreddit: { name: string };
  showSubreddit: boolean;
  creationTime: number;
}

interface PostContentProps {
  subject: string;
  body: string;
  image?: string;
  expandedView: boolean;
}

const PostHeader = ({
  author,
  subreddit,
  showSubreddit,
  creationTime,
}: PostHeaderProps) => {
  return (
    <div className="post-header">
      {author ? (
        <Link to={`/u/${author.username}`}>u/{author.username}</Link>
      ) : (
        <span className="post-author">u/deleted</span>
      )}

      {showSubreddit && subreddit && (
        <>
          <span className="post-dot">-</span>
          <Link to={`/r/${subreddit.name}`} className="post-subreddit">
            r/{subreddit.name}
          </Link>
        </>
      )}
      <span className="post-dot">-</span>
      <span className="post-time">
        {new Date(creationTime).toLocaleString()}
      </span>
    </div>
  );
};

const PostContent = ({
  subject,
  body,
  image,
  expandedView,
}: PostContentProps) => {
  return (
    <>
      {expandedView ? (
        <>
          <h1 className="post-title">{subject}</h1>

          {image && (
            <div className="post-image-container">
              <img src={image} alt="Post content" className="post-image" />
            </div>
          )}

          {body && <p className="post-body">{body}</p>}
        </>
      ) : (
        <div className="preview-post">
          <div>
            <h2 className="post-title">{subject}</h2>
            {body && <p className="post-body">{body}</p>}
          </div>
          {image && (
            <div className="post-image-container small-img">
              <img src={image} alt="Post content" className="post-image" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const PostCard = ({
  post,
  showSubreddit = false,
  expandedView = false,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(expandedView);
  const navigate = useNavigate();
  const { user } = useUser();
  const ownedByUser = post.author?.username === user?.username;

  const deletePost = useMutation(api.post.deletePost)

  const handleComment = () => {};

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
        await deletePost({ id: post._id });
        if(expandedView) {
            navigate("/");
        }
      }
  };

  const handleSubmit = () => {
    
  };

  return (
    <div className="post-card ${expandedView ? 'expanded' : ''}">
      <div className="post-content">
        <PostHeader
          author={post.author}
          subreddit={post.subreddit ?? { name: "delete" }}
          showSubreddit={showSubreddit}
          creationTime={post._creationTime}
        />
        <PostContent
          subject={post.subject}
          body={post.body}
          image={post.imageUrl}
          expandedView={expandedView}
        />

        <div className="post-actions">
          <button className="action-button" onClick={handleComment}>
            <FaRegCommentAlt />
            <span>0 comments</span>
          </button>

          {ownedByUser && (
            <button className="action-button  delete-button" onClick={handleDelete}>
              <FaTrash />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
