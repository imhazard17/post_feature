const express = require('express')
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const likeRouter = require('./routes/like')
const commentRouter = require('./routes/comment')
const error = require('./middlewares/error')

dotenv.config({ path: './.env' })

const app = express()

app.use(express.json())
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/like', likeRouter)
app.use('/comment', commentRouter)

app.all('*', (req, res, next) => {
    return res.status(404).json({
        err: `Endpoint ${req.url} does not exist`
    })
})

app.use(error)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on port: ${process.env.SERVER_PORT}`)
})
