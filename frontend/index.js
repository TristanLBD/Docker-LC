const root = document.getElementById('root');

// Fonction pour récupérer et afficher les articles
async function fetchArticles() {
    const response = await fetch('http://localhost:5000/api/articles');
    const articles = await response.json();
    const root = document.getElementById('root');

    // Créer un affichage des articles avec des boutons de suppression et d'édition
    root.innerHTML = `
        <h1>Articles</h1>
        <ul>
        ${articles.map(article => `
            <li>
                <strong>${article.title}</strong>: ${article.content}
                <button onclick="deleteArticle(${article.id})">Supprimer</button>
                <button onclick="showUpdateForm(${article.id}, '${article.title}', '${article.content}')">Éditer</button>
            </li>
        `).join('')}
        </ul>
        <div id="updateForm" style="display:none;">
            <h2>Mettre à jour un article</h2>
            <form onsubmit="updateArticle(event)">
                <input type="hidden" id="updateId">
                <label for="updateTitle">Titre:</label>
                <input type="text" id="updateTitle" required><br>
                <label for="updateContent">Contenu:</label>
                <textarea id="updateContent" required></textarea><br>
                <button type="submit">Mettre à jour</button>
                <button type="button" onclick="hideUpdateForm()">Annuler</button>
            </form>
        </div>
    `;
}

// Fonction pour supprimer un article
async function deleteArticle(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchArticles();
        } else {
            alert('Erreur lors de la suppression de l\'article');
        }
    } catch (error) {
        console.error('Erreur de suppression:', error);
        alert('Une erreur est survenue');
    }
}

// Fonction pour afficher le formulaire de mise à jour
function showUpdateForm(id, title, content) {
    const updateForm = document.getElementById('updateForm');
    document.getElementById('updateId').value = id;
    document.getElementById('updateTitle').value = title;
    document.getElementById('updateContent').value = content;
    updateForm.style.display = 'block';
}

// Fonction pour masquer le formulaire de mise à jour
function hideUpdateForm() {
    const updateForm = document.getElementById('updateForm');
    updateForm.style.display = 'none';
}

// Fonction pour mettre à jour un article
async function updateArticle(event) {
    event.preventDefault();

    const id = document.getElementById('updateId').value;
    const title = document.getElementById('updateTitle').value;
    const content = document.getElementById('updateContent').value;

    try {
        const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            hideUpdateForm();
            fetchArticles();
        } else {
            alert('Erreur lors de la mise à jour de l\'article');
        }
    } catch (error) {
        console.error('Erreur de mise à jour:', error);
        alert('Une erreur est survenue');
    }
}

// Fonction pour ajouter un nouvel article
async function addArticle(event) {
    event.preventDefault();

    const title = document.getElementById('addTitle').value;
    const content = document.getElementById('addContent').value;

    try {
        const response = await fetch('http://localhost:5000/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            document.getElementById('addArticleForm').reset();
            fetchArticles(); // Rafraîchir la liste des articles
        } else {
            alert('Erreur lors de l\'ajout de l\'article');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
        alert('Une erreur est survenue');
    }
}

// Appeler fetchArticles pour initialiser l'affichage des articles
fetchArticles();
