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

// Préparation des queries
const queryView = {
	text: "SELECT * FROM article"
}





// fonction permettant de lancer une requête sans retour
function run(query) {
	db.query(query, (err, res)=>{
		if (err) {
			console.log(err);
		}
	});
}




// fonction permettant de regarder la requete
function view(query) {
	db.query(query, (err, res)=>{
		if (err) {
			console.log(err);
			result = err
		}
		else {
			console.log(res.rows)
			result = res.rows
		}
	});
	return result
}






app.get('/', (req, res) =>{
	const result = view(queryView);
	res.json(result);
})



// Récupérer la liste complète des articles
app.get('/list', (req, res) =>{
	const result = view(queryView);
	res.json(result);
})


//Récupérer un article spécifique
app.get('/article/:id', (req, res) =>{
	let index = Number(req.params.id);
	let querySolo = {
		text: "SELECT * FROM article WHERE id=$1",
		values: [index]
	};
	const result = run(querySolo);
	res.json(result);

})


//création d'un article
app.post('/create', (req, res)=> {
	const corps = req.body;
	let queryInsert = {
		text: "INSERT INTO article (title, category, content, date, img, visibility) VALUES($1,$2,$3,$4,$5,$6)",
		values: [corps.title, corps.category, corps.content, date, corps.img, corps.visibility]
	}
	const result = run(queryInsert);
	res.send(result);
});


//Modification d'un article
app.post('/edit/:id', (req, res)=> {
	const index = Number(req.params.id)+1;
	const corps = req.body;
	let queryUpdate = {
		text: "UPDATE article SET title = $1, category = $2, content = $3, date = $4, img = $5, visibility = $6 WHERE id = $7",
		values: [corps.title, corps.category, corps.content, corps.date, corps.img, corps.visibility, index]
	}
	// Mettre à jour la ligne lié à l'article sélectionné avec son id
	const result = run(queryUpdate);
	res.send(result);
});


//Suppression d'un article
app.delete('/delete/:id', (req, res)=> {
	const index = Number(req.params.id)+1;

	let queryDelete = {
		text: "DELETE FROM article WHERE id = ?",
		values: [index]
	}
	const result = run(queryDelete);
	res.send(result);
});


app.listen(process.env.PORT, ()=> console.log('Server started! 🎉'));