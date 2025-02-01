import { useParams, useNavigate } from "react-router-dom";
import { ReactHTML, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "../styles/SubmitPage.css";

const SubmitPage = () => {
  const { subredditName } = useParams();
  const navigate = useNavigate();
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

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = useMutation(api.post.create);
  const generateUploadUrl = useMutation(api.image.generateUploadUrl);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }

      setSelectedImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImg(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subReddit) {
      alert("Please enters a title and select a subreddit.");
      return;
    }

    try {
      setIsSubmitting(true);

      // generate upload url
      let imageUrl = undefined;
      if (selectedImg) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImg.type },
          body: selectedImg,
        });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        const { storageId } = await result.json();
        imageUrl = storageId;
      }

      await createPost({
        subject: title.trim(),
        body: body.trim(),
        subreddit: subReddit._id,
        storageId: imageUrl,
      });
      navigate(`/r/${subReddit.name}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(true);
    }
  };

  return (
    <div className="content-container">
      <div className="submit-container">
        <h1>Create a post in r/{subReddit.name}</h1>
        <form className="submit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="submit-title"
            maxLength={100}
          />

          <div className="media-input-container">
            <label className="image-upload-label">
              {" "}
              <FaImage className="image-icon" />
              Upload Image{" "}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              ></input>
            </label>
            {imagePreview && (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={handleRemoveImage}
                >
                  <IoMdClose />
                </button>
              </div>
            )}
          </div>

          <textarea
            placeholder="Text (optional)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="submit-body"
          />

          <div className="submit-actions">
            <button
              type="button"
              onClick={() => navigate(`/r/${subReddit.name}`)}
              className="back-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Posting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPage;
