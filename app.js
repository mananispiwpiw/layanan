const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "layanan",
    password: "layanan123",
    port: 5432,
    ssl: false,
});

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM catatan ORDER BY id DESC"
        );
        const data = result.rows;
        res.render("index", {
            imageSrc:
                "https://www.its.ac.id/komputer/wp-content/uploads/sites/28/2020/01/Computer-Engineering-1.jpg",
            data,
        });
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/catatan", async (req, res) => {
    const { data_catatan } = req.body;

    if (data_catatan && data_catatan.trim() !== "") {
        try {
            await pool.query("INSERT INTO catatan (data_catatan) VALUES ($1)", [
                data_catatan,
            ]);
            console.log("Data inserted successfully");
            res.redirect("/");
        } catch (error) {
            console.error("Error inserting data", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.redirect("/");
    }
});

app.post("/delete-catatan", async (req, res) => {
    const { catatan_id } = req.body;

    if (catatan_id) {
        try {
            await pool.query("DELETE FROM catatan WHERE id = $1", [catatan_id]);
            console.log("Data deleted successfully");
            res.redirect("/");
        } catch (error) {
            console.error("Error deleting data", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
