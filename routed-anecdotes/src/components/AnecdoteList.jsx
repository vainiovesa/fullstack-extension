import { useAnecdotes } from "../hooks"

const AnecdoteList = () => {
  const { anecdotes, removeAnecdote } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => {
          return (
            <li key={anecdote.id}>
              {anecdote.content} <button onClick={() => removeAnecdote(anecdote)}>delete</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


export default AnecdoteList
