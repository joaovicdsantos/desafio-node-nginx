const express = require('express')

const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}
const mysql = require('mysql2')
const connection = mysql.createConnection(config)

// create people table
connection.execute(
    `CREATE TABLE if not exists people(
        id int not null auto_increment,
        name varchar(255) not null,
        primary key (id)
    )`
)

const saveOneName = (name) => {
    const sql = `INSERT INTO people(name) VALUES (?)`
    connection.execute(sql, [name])
}

const getSavedNames = (callback) => {
    const sql = `SELECT * FROM people`
    return connection.execute(sql, callback)
}

const createHtmlList = (jsList) => {
    let list = '<ul>'
    jsList.forEach(elem => {
        list += `<li>${elem.name}</li>`
    })
    return (list+'</ul>')
}

app.get('/', (req, res) => {
    const name = 'Joãozinho'
    saveOneName(name)
    getSavedNames((err, results, fields) => {
        res.send(
            '<h1>Full Cycle Rocks!</h1>' +
            `<p>Saved name: ${name}</p>` +
            `<p>You can use http://localhost/:name to save a custom name</p>` +
            createHtmlList(results)
        )
    })
})

app.get('/:name', (req, res) => {
    const name = req.params.name
    saveOneName(name)
    getSavedNames((err, results, fields) => {
        res.send(
            '<h1>Full Cycle Rocks!</h1>' +
            `<p>Saved name: ${name}</p>` +
            createHtmlList(results)
        )
    })
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})
