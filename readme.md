# Projet avec Docker
Application web simpliste dans le cadre d'un TP sur docker.
Projet réparti en 3 containers :
   - DB
   - Backend
   - Frontend

## Prérequis
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation et lancement

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/TristanLBD/Docker-LC.git
   ```
2. Se placer dans le dossier du projet :
   ```bash
   cd Docker-LC
   ```
3. Lancer le projet :
   ```bash
   docker-compose up -d
   ```
4. Visualiser le projet :
   - http://localhost:3000 afin de voir le front
   - http://localhost:5000 afin de voir le back