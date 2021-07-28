const express = require('express')
const Joi = require('joi')
const helmet = require('helmet')
const morgan = require('morgan')
const logger = require('./logger')
const config = require('config')
const app = express()


// Configuration
console.log(`Application name: ${config.get('name')}`)
console.log(`Mail server: ${config.get('mail.host')}`)
console.log(`Mail Password: ${config.get('mail.password')}`)

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))
app.use(helmet())

if (app.get('env') === 'development') {
    app.use(morgan('common'))
    console.log('Morgan enable...')
}

app.use(logger)


const courses = [
    { id: 1, name: 'node.js' },
    { id: 2, name: 'html&CSS' },
    { id: 3, name: 'jQuery' }
]



//* PUT REQUEST

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not exists, return 404
    const course = courses.find(x => x.id === parseInt(req.params.id))
    if (!course) res.status(404).send('The course with the given ID doesn\'t exist')


    // Validate
    // If invalid, return 400 - bad request
    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)


    // Update course
    course.name = req.body.name
    // Return the updated course
    res.send(course)
})


//* GET REQUEST

app.get('/', (req, res) => {
    res.send('Hello World!!!')
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(x => x.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID doesn\'t exist')

    res.send(course)

})


//* POST REQUEST

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)


    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
}
)


//* DELETE REQUEST

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // Not exists, return 404
    const course = courses.find(x => x.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID doesn\'t exist')


    // Delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    // Return the same course
    res.send(course)
})


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(course)

}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
