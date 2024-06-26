const express = require('express')
const app = express()
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello Worgfld!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.delete('/api/notes/:id', (request, response) => {
  const id = parseInt(request.params.id)
    notes = notes.filter(note => {
      response.write("noteID is " + note.id + " versus delete target of " + id)
      const keep = note.id !== id
    response.write("\nkeep? " + keep + "\n")
    return keep
    }
    )
// if (note) {
  response.write("wiped: " + notes)
  response.status(204).end()
// } else {
//   response.send("<h1>can't find note</h1>")
// }
})

app.get('/api/notes/:id', (request, response) => {
  const id = parseInt(request.params.id)
  const tid = typeof id
  console.log("what is my id", id, tid)
  console.log("notes are", notes)
  const fnote = notes[0]
  const tnote = typeof fnote.id
  console.log("first note id type", tnote)
const note = notes.find(note => note.id === id)
  console.log("what is my note", note)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})