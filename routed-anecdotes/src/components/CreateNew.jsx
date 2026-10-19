import { useNavigate } from "react-router"
import  { useField } from '../hooks'
import { useAnecdotes } from "../hooks"

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({
      content: content.attributes.value,
      author: author.attributes.value,
      info: info.attributes.value,
      votes: 0
    })
    navigate("/")
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content <input { ...content.attributes } />
        </div>
        <div>
          author <input { ...author.attributes } />
        </div>
        <div>
          url for more info <input { ...info.attributes } />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
