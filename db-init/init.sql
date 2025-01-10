CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);

INSERT INTO articles (title, content) VALUES
('Premier Article', 'Contenu du premier article'),
('Deuxième Article', 'Contenu du deuxième article'),
('Troisième Article', 'Contenu du troisième article');