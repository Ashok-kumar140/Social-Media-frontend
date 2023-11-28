import React from 'react'

const CommentForm = ({comment,addComment,setComment}) => {
    return (
        <div>
            <form onSubmit={addComment}>

                <input type="text"
                    className='form-control'
                    placeholder='write here...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} />
                <button className='btn btn-sm btn-primary btn-block mt-3'>
                    Submit
                </button>

            </form>

        </div>
    )
}

export default CommentForm
