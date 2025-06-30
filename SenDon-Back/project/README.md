# Backend Application de Don de Sang

## Description
Backend Spring Boot pour une application de don de sang permettant aux utilisateurs de s'inscrire et de gérer une liste de contacts (famille/amis) avec le même groupe sanguin.

## Fonctionnalités

### Authentification
- Inscription des utilisateurs avec validation
- Connexion avec JWT
- Sécurité avec Spring Security

### Gestion des Utilisateurs
- Profil utilisateur complet avec groupe sanguin
- Recherche par groupe sanguin et ville
- Mise à jour du profil

### Gestion des Contacts
- Ajout de contacts avec informations personnelles
- Filtrage par groupe sanguin
- Recherche des contacts ayant le même groupe sanguin que l'utilisateur
- CRUD complet sur les contacts

## Technologies Utilisées
- **Spring Boot 3.2.0**
- **Spring Security** (JWT)
- **Spring Data JPA**
- **MySQL** (Base de données)
- **ModelMapper** (Mapping DTO/Entity)
- **Bean Validation** (Validation des données)

## Structure du Projet

```
src/main/java/com/blooddonation/
├── config/              # Configuration (Security, ModelMapper)
├── controller/          # Contrôleurs REST
├── dto/                 # Data Transfer Objects
├── entity/              # Entités JPA
├── enums/               # Énumérations (BloodType)
├── exception/           # Exceptions personnalisées
├── repository/          # Repositories JPA
├── security/            # Configuration JWT
└── service/             # Services métier
```

## Configuration

### Base de données MySQL
Configurez votre base de données MySQL dans `application.yml` :

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blood_donation_db?createDatabaseIfNotExist=true
    username: your_username
    password: your_password
```

### JWT
Modifiez la clé secrète JWT dans `application.yml` :

```yaml
jwt:
  secret: your_secret_key_here
  expiration: 86400000 # 24 heures
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Utilisateurs
- `GET /api/users/{id}` - Obtenir un utilisateur par ID
- `GET /api/users/email/{email}` - Obtenir un utilisateur par email
- `GET /api/users/blood-type/{bloodType}` - Utilisateurs par groupe sanguin
- `GET /api/users/search?bloodType={type}&city={city}` - Recherche avancée
- `PUT /api/users/{id}` - Mettre à jour un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

### Contacts
- `POST /api/contacts/user/{userId}` - Ajouter un contact
- `GET /api/contacts/user/{userId}` - Contacts d'un utilisateur
- `GET /api/contacts/user/{userId}/same-blood-type` - Contacts avec même groupe sanguin
- `GET /api/contacts/user/{userId}/blood-type/{bloodType}` - Contacts par groupe sanguin
- `GET /api/contacts/{contactId}` - Obtenir un contact
- `PUT /api/contacts/{contactId}` - Mettre à jour un contact
- `DELETE /api/contacts/{contactId}` - Supprimer un contact

## Groupes Sanguins Supportés
- A+, A-, B+, B-, AB+, AB-, O+, O-

## Démarrage

1. Clonez le projet
2. Configurez MySQL
3. Modifiez `application.yml` avec vos paramètres
4. Exécutez : `mvn spring-boot:run`

L'application sera disponible sur `http://localhost:8080`

## Exemples d'utilisation

### Inscription
```json
POST /api/auth/register
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "password": "motdepasse123",
  "phoneNumber": "0123456789",
  "birthDate": "1990-01-01",
  "bloodType": "A_POSITIVE",
  "address": "123 Rue de la Paix",
  "city": "Paris",
  "postalCode": "75001"
}
```

### Ajout d'un contact
```json
POST /api/contacts/user/1
{
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie.martin@email.com",
  "phoneNumber": "0987654321",
  "birthDate": "1985-05-15",
  "bloodType": "A_POSITIVE",
  "relationship": "famille",
  "address": "456 Avenue des Champs",
  "city": "Lyon",
  "postalCode": "69001",
  "notes": "Sœur, disponible en cas d'urgence"
}
```

## Sécurité
- Toutes les API (sauf auth) nécessitent un token JWT
- Validation des données d'entrée
- Gestion des erreurs centralisée
- Chiffrement des mots de passe avec BCrypt