const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json()); // Middleware pour analyser les corps de requêtes JSON

// Créez une connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'db', // Nom du service MySQL dans docker-compose.yml
  user: 'user',
  password: 'userpassword',
  database: 'mydb',
  port: 3306 // Assurez-vous que ce port est correct
});

// Connectez-vous à la base de données
function connectWithRetry() {
  db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données, nouvel essai dans 5 secondes...', err);
      setTimeout(connectWithRetry, 5000); // Réessayer après 5 secondes
    } else {
      console.log('Connexion à la base de données MySQL réussie');
    }
  });
}

connectWithRetry();

// Route pour obtenir les articles depuis la base de données
app.get('/api/articles', (req, res) => {
  const query = 'SELECT * FROM articles';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des articles: ', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json(results); // Retourner les articles de la base de données
  });
});

// Route pour supprimer un article
app.delete('/api/articles/:id', (req, res) => {
  const { id } = req.params;

  // Créer la requête SQL pour supprimer l'article avec l'ID donné
  const query = 'DELETE FROM articles WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'article: ', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(204).send(); // Pas de contenu à retourner
  });
});

// Route pour mettre à jour un article
app.put('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body; // Les champs à mettre à jour

  if (!title || !content) {
    return res.status(400).json({ message: 'Les champs title et content sont requis' });
  }

  // Créer la requête SQL pour mettre à jour l'article
  const query = 'UPDATE articles SET title = ?, content = ? WHERE id = ?';

  db.query(query, [title, content, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'article: ', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.json({ message: 'Article mis à jour avec succès' });
  });
});

// Route pour ajouter un nouvel article
app.post('/api/articles', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Les champs title et content sont requis' });
  }

  // Créer la requête SQL pour insérer un nouvel article
  const query = 'INSERT INTO articles (title, content) VALUES (?, ?)';

  db.query(query, [title, content], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'article: ', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    res.status(201).json({ message: 'Article ajouté avec succès', id: result.insertId });
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});