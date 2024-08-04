import { useState } from "react"
import "./index.css"

const CommentInput = () => {
    const [comment, setComment] = useState("")


    const handleChange = (a) => {
        setComment(a.target.value)
    }

    return (
    <div className="comment-input">
    <input
      type="text"
      value={comment}
      onChange={handleChange}
      placeholder="Add a comment..."
      className="comment-input-field"
    />
  </div>

    )
}

export default CommentInput