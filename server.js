require("dotenv").config()
const cors = require("cors")
const db = require("./db")
const express = require("express")
const app = express()

//midlleware that prevents CORS error due the different ports of server and client
app.use(cors())

//buitin express middleware that attaches the posted object to the body of the request
app.use(express.json())


//get all groceries
app.get("/api/", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM groceries")

        res.json({
            groceries: results.rows
        })
    } catch (error) {
        console.log(error)
    }
})

//create individual grocery
app.post("/api/", async (req, res) => {
    try {
        const grocery = await db.query(
            'INSERT INTO groceries(description) VALUES($1) RETURNING *',
            [req.body.description]
        )

        res.json({
            grocery: grocery.rows[0]
        })
    } catch (error) {
        console.error(error.message)
    }
})

//delete individual grocery
app.delete("/api/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM groceries WHERE id = $1", [req.params.id])
    } catch (error) {
        console.log(error)
    }
})

//update individual grocery
app.put("/api/:id", async (req, res) => {
    try {
        const grocery = await db.query(
            "UPDATE groceries SET description = $1 WHERE id = $2 RETURNING *",
            [req.body.description, req.params.id]
        )

        res.json({
            grocery: grocery.rows[0]
        })
    } catch (error) {
        console.log(error)
    }
})


//run server
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`server has started on port ${port}`))