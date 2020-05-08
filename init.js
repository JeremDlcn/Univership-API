const { Client } = require('pg');


// Connexion à la base de données HEROKU
const db = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: false,
});

// Connexion à la base de données local
// const db = new Client({
// 	connectionString: 'postgresql://sunlight_admin-univership:uni$$123@postgresql-sunlight.alwaysdata.net/sunlight_univership'
// });


db.connect()



//Queries
const queryCreate = {
	text: "CREATE TABLE article(id SERIAL PRIMARY KEY, title TEXT, category TEXT, content TEXT, date TEXT, img TEXT, visibility TEXT)"
}

let queryInsert = {
	text: "INSERT INTO article (title, category, content, date, img, visibility) VALUES($1,$2,$3,$4,$5,$6)",
	values: []
}

const queryView = {
	text: "SELECT * FROM article"
}




// data to insert
const ins = [
["Mises à Jour : La guerre des dieux", "Mise à jour", "La nouvelle grosse mise à jour est sortie, retrouvez-vous au coeur de la guerre des dieux, un affrontement sans précédent entre les deux plus grandes puissances militaires de toute la galaxie. Cette mise à jour apporte un lot d''armes militaire qui pourront vous servir pour vous défendre contre les créatures hostiles et les chasseurs. Les équipes de plus de 100 personnes auront accès au plus grand vaisseau ayant jamais exister, le croiseur antique, qui est composé de 600 canons à Protons.", "25/06/2019", "../image/news/news1.png", "private"],
["Réparation des bugs sur la génération de terrain", "Fixe de bugs", "Dans cette petite mise à jour, nous avons fixé quelques problèmes de génération de terrain sur la planète principale, cela causait des crashs chez certains joueurs et les empêchaient d''avancer.", "25/06/2019", "../image/news/news3.png", "private"],
["Nouvelle Station spatial disponible", "Ajout", "Dans cette petite mise à jour, nous avons ajouter une station spatial dans la région reculée, elle permettra de faire des échanges plus rapidement","25/06/2019", "../image/news/news2.png", "private"],
["Nouvelle région disponible dans l''univers", "Ajout", "Dans cette mise à jour, une nouvelle région est disponible, elle contient de nombreuses ressources encore inutilisées.","25/06/2019", "../image/news/news2.png", "private"],
["Nouvelles armes disponibles", "Ajout", "Dans cette mise à jour, 3 nouvelles armes sont disponible.","25/06/2019", "../image/news/news3.png", "private"]
]



// running function

run(queryCreate);
for (let i = 0; i < ins.length; i++){
	queryInsert.values = ins[i];
	run(queryInsert);
}
view(queryView);





// fonction permettant de lancer la query
function run(query) {
	db.query(query, (err, res)=>{
		if (err) {
			console.log(err);
		}
		else {
			console.log(res)
		}
	});
}


// fonction permettant de regarder la requete
function view(query) {
	db.query(query, (err, res)=>{
		if (err) {
			console.log(err);
		}
		else {
			console.log(res.rows)
		}
	});
}