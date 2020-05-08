let sq = require('sqlite3').verbose();

let db = new sq.Database("./database.db", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});


// create();


// for (let i = 1; i <= 5; i++){
// 	insert(i);
// }


view();


function create() {
	db.run("CREATE TABLE article(id INTEGER PRIMARY KEY NOT NULL, title TEXT, category TEXT, content TEXT, date TEXT, img TEXT, visibility TEXT)");	
}


function insert(index) {
	db.run("INSERT INTO article (title, category, content, date, img, visibility) VALUES(?,?,?,?,?,?)", ["Mises à Jour : La guerre des dieux", "Mise à jour", "La nouvelle grosse mise à jour est sortie, retrouvez-vous au coeur de la guerre des dieux, un affrontement sans précédent entre les deux plus grandes puissances militaires de toute la galaxie. Cette mise à jour apporte un lot d'armes militaire qui pourront vous servir pour vous défendre contre les créatures hostiles et les chasseurs. Les équipes de plus de 100 personnes auront accès au plus grand vaisseau ayant jamais exister, le 'croiseur antique', qui est composé de 600 canons à Protons.", "25/06/2019", "../image/news/news1.png", "private"]);
}


function view() {
	db.each("SELECT * FROM article", (err,row)=>{
		if (err) {
			console.log(err);
		} else {
			console.log(row);
		}
	})
}