require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  { username: 'Echo', title: 'Post 1' },
  { username: 'Dan', title: 'Post 2' }
]

app.get('/posts', authenticateToken, (req, res) => {
  const userPosts = posts.filter(p => p.username === req.user.name)
  res.send(userPosts)
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }
  const accessToken = jwt.sign(user, process.env.ACCESS_TOCKEN_SECRET)
  res.json({ accessToken })
})

app.listen(3000)

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403)
    req.user = user
    next()
  })
}