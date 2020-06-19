const sq = require('sqlite3').verbose();	//module pour utiliser sqlite
const express = require('express');			//module pour faire une API
const cors = require('cors');	
const moment = require('moment');
const { Client } = require('pg');			//module pour aider dans la gestion des requêtes
const app = express();


app.use(cors());
app.use(express.json());	//on va récupérer les requête en json

moment.locale('fr');	//date française

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



 




// Routes


// Renvoi la liste des articles avec la visibilités public
app.get('/public/all', async (req, res) =>{
	const queryView = {
		text: "SELECT * FROM article WHERE visibility = 'public'"
	}
	const result = await run(queryView);
	res.json(result.rows);
})

// article public avec category news
app.get('/public/news', async (req, res) =>{
	const queryView = {
		text: "SELECT * FROM article WHERE visibility = 'public'"
	}
	const result = await run(queryView);
	const res = result.rows.find(element => element.category === 'maintenance');
	res.json(result.rows);
})







// Récupérer la liste complète des articles
app.get('/list', async (req, res) =>{
	const queryView = {
		text: "SELECT * FROM article"
	}
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

	//Ajout de la date actuel avec le commentaire
	let date = moment().format('DD MMMM YYYY');

	let queryInsert = {
		text: "INSERT INTO article (title, category, content, date, img, visibility) VALUES($1,$2,$3,$4,$5,$6)",
		values: [corps.title, corps.category, corps.content, date, corps.img, corps.visibility]
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




// Partie FAQ

//création d'une questions FAQ
app.post('/faq/create', async (req, res)=> {
	const corps = req.body;

	let queryInsert = {
		text: "INSERT INTO questions (question, answer) VALUES($1,$2)",
		values: [corps.question, corps.body]
	}
	run(queryInsert);
	res.send('contenu crée');
});


//Récupérer un question spécifique
app.get('/faq/:id', async (req, res) =>{
	let index = Number(req.params.id);
	let querySolo = {
		text: "SELECT * FROM questions WHERE id=$1",
		values: [index]
	};
	const result = await run(querySolo);
	res.json(result.rows[0]);

})



app.listen(process.env.PORT, ()=> console.log('Server started! 🎉'));



