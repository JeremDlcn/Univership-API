const sq = require('sqlite3').verbose();	//module pour utiliser sqlite
const express = require('express');			//module pour faire une API
const cors = require('cors');				//module pour aider dans la gestion des requêtes
const app = express();

app.use(cors());
app.use(express.json());	//on va récupérer les requête en json


// Connexion à la base de données
let db = new sq.Database("./database.db", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});


// Récupérer la liste complète des articles
app.get('/list', (req, res) =>{
	let tab = []
	db.all("SELECT * FROM article", (err,row)=>{
		//console.log(row)
		res.json(row)
	});
})


//Récupérer un article spécifique
app.get('/article/:id', (req, res) =>{
	let index = Number(req.params.id);
	db.each("SELECT * FROM article WHERE id = ?", [index], (err,row)=>{
		if (err) {
			console.log(err);
		} else {
			res.json(row);
		}
	});
})


//création d'un article
app.post('/create', (req, res)=> {
	const corps = req.body;
	//const date = '25/06/2019'
	// Ajouté l'article dans la table "article"
	db.run("INSERT INTO article (title, category, content, date, img, visibility) VALUES(?,?,?,?,?,?)", [corps.title, corps.category, corps.content, date, corps.img, corps.visibility]);
	res.send('ok');
});


//Modification d'un article
app.post('/edit/:id', (req, res)=> {
	const index = Number(req.params.id)+1;
	const corps = req.body;

	// Mettre à jour la ligne lié à l'article sélectionné avec son id
	db.run("UPDATE article SET title = ?, category = ?, content = ?, date = ?, img = ?, visibility = ? WHERE id = ?", [corps.title, corps.category, corps.content, corps.date, corps.img, corps.visibility, index]);
	res.send('ok');
});


//Suppression d'un article
app.delete('/delete/:id', (req, res)=> {
	const index = Number(req.params.id)+1;

	// Mettre à jour la ligne lié à l'article sélectionné avec son id
	db.run("DELETE FROM article WHERE id = ?", [index]);
	res.send('ok');
});


app.listen(3000, ()=> console.log('Server started! 🎉'));