const sq = require('sqlite3').verbose();	//module pour utiliser sqlite
const express = require('express');			//module pour faire une API
const cors = require('cors');	
const { Client } = require('pg');			//module pour aider dans la gestion des requêtes
const app = express();


app.use(cors());
app.use(express.json());	//on va récupérer les requête en json


// Connexion à la base de données HEROKU
const db = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: false,
});

// Connexion à la base de données local
// const db = new Client({
// 	connectionString: 'postgresql://sunlight_admin-univership:uni$$123@postgresql-sunlight.alwaysdata.net/sunlight_univership'
// });

db.connect();



// fonction permettant de voir tout les articles
async function run(query) {
	let result = await db.query(query);
	return result;
}






const queryView = {
	text: "SELECT * FROM article"
}

// Routes

app.get('/', async (req, res) =>{
	const result = await run(queryView);
	res.json(result.rows);
})



// Récupérer la liste complète des articles
app.get('/list', async (req, res) =>{
	const result = await run(queryView);
	res.json(result.rows);
})


//Récupérer un article spécifique
app.get('/article/:id', async (req, res) =>{
	let index = Number(req.params.id);
	let querySolo = {
		text: "SELECT * FROM article WHERE id=$1",
		values: [index]
	};
	const result = await run(querySolo);
	res.json(result.rows[0]);

})


//création d'un article
app.post('/create', async (req, res)=> {
	const corps = req.body;
	let queryInsert = {
		text: "INSERT INTO article (title, category, content, date, img, visibility) VALUES($1,$2,$3,$4,$5,$6)",
		values: [corps.title, corps.category, corps.content, corps.date, corps.img, corps.visibility]
	}
	run(queryInsert);
	res.send('contenu crée');
});


//Modification d'un article
app.post('/edit/:id', (req, res)=> {
	const index = Number(req.params.id);
	const corps = req.body;
	let queryUpdate = {
		text: "UPDATE article SET title = $1, category = $2, content = $3, date = $4, img = $5, visibility = $6 WHERE id = $7",
		values: [corps.title, corps.category, corps.content, corps.date, corps.img, corps.visibility, index]
	}
	// Mettre à jour la ligne lié à l'article sélectionné avec son id
	run(queryUpdate);
	res.send('contenu mis à jour');
});


//Suppression d'un article
app.delete('/delete/:id', (req, res)=> {
	const index = Number(req.params.id);

	let queryDelete = {
		text: "DELETE FROM article WHERE id = $1",
		values: [index]
	}
	run(queryDelete)
	.catch(err=>console.log(err))
	res.send('contenu supprimé');
});


app.listen(process.env.PORT, ()=> console.log('Server started! 🎉'));



