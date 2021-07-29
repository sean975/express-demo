const express = require('express')
const router = express.Router()


const courses = [
    { id: 1, name: 'node.js' },
    { id: 2, name: 'html&CSS' },
    { id: 3, name: 'jQuery' }
]


//* PUT REQUEST

router.put('/:id', (req, res) => {
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

router.get('/', (req, res) => {
    res.send(courses)
})

router.get('/:id', (req, res) => {
    const course = courses.find(x => x.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID doesn\'t exist')

    res.send(course)

})

//* POST REQUEST

router.post('/', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router

