# SimpleORM Documentation

## Table des matières
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Concepts de base](#concepts-de-base)
5. [Modèles](#modèles)
6. [Opérations CRUD](#opérations-crud)
7. [Query Builder](#query-builder)
8. [Relations](#relations)
9. [Transactions](#transactions)
10. [Types et Interfaces](#types-et-interfaces)

## Introduction

SimpleORM est un ORM (Object-Relational Mapping) léger et puissant conçu spécifiquement pour Cloudflare D1. Il offre une API intuitive pour interagir avec votre base de données SQL tout en maintenant une approche typée avec TypeScript.

## Installation

L'ORM est inclus dans votre projet et ne nécessite pas d'installation supplémentaire. Il est conçu pour fonctionner avec Cloudflare D1.

## Configuration

```typescript
// Initialisation de l'ORM
const orm = new SimpleORM(env.DB);
const factory = new ModelFactory(orm);
```

## Concepts de base

L'ORM s'articule autour de trois classes principales :
- `SimpleORM`: La classe principale qui gère les connexions et les requêtes
- `Model`: La classe de base pour tous les modèles
- `ModelFactory`: Un utilitaire pour créer des modèles typés

## Modèles

### Définition d'un modèle

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const UserModel = factory.createModel<User>('users', {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE NOT NULL',
  created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP'
});
```

## Opérations CRUD

### Création

```typescript
// Créer un enregistrement
const user = await UserModel.create({
  name: 'John Doe',
  email: 'john@example.com'
});

// Créer plusieurs enregistrements
const users = await UserModel.createMany([
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' }
]);
```

### Lecture

```typescript
// Trouver tous les enregistrements
const allUsers = await UserModel.findAll();

// Trouver par ID
const user = await UserModel.findById(1);

// Trouver avec conditions
const user = await UserModel.findOne({
  where: { email: 'john@example.com' }
});
```

### Mise à jour

```typescript
// Mettre à jour par ID
const updatedUser = await UserModel.update(1, {
  name: 'John Updated'
});

// Mise à jour conditionnelle
const updatedCount = await UserModel.updateWhere(
  { status: 'inactive' },
  { status: 'active' }
);

// Incrémenter/Décrémenter
await UserModel.increment(1, 'points', 5);
await UserModel.decrement(1, 'points', 3);
```

### Suppression

```typescript
// Supprimer par ID
await UserModel.delete(1);

// Suppression conditionnelle
const deletedCount = await UserModel.deleteWhere({
  status: 'inactive'
});
```

## Query Builder

L'ORM inclut un Query Builder fluide pour des requêtes complexes :

```typescript
const users = await UserModel
  .where({ status: 'active' })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .offset(20)
  .findAll();
```

## Relations

L'ORM supporte les relations via l'option `include` :

```typescript
// Définition de la relation
const users = await UserModel.findAll({
  include: {
    model: 'posts',
    foreignKey: 'user_id',
    as: 'userPosts'
  }
});
```

## Transactions

L'ORM supporte les transactions pour les opérations groupées :

```typescript
const statements = [
  () => db.prepare("INSERT INTO users (name) VALUES (?)").bind("User 1"),
  () => db.prepare("INSERT INTO users (name) VALUES (?)").bind("User 2")
];

await orm.transaction(statements);
```

## Types et Interfaces

### Principales interfaces

```typescript
interface WhereConditions {
  [key: string]: any;
}

interface OrderByOptions {
  column: string;
  direction?: "ASC" | "DESC";
}

interface QueryOptions {
  where?: WhereConditions;
  orderBy?: OrderByOptions | OrderByOptions[];
  limit?: number;
  offset?: number;
  include?: IncludeOptions | IncludeOptions[];
}
```

### Options de requête

- `where`: Conditions de filtrage
- `orderBy`: Options de tri
- `limit`: Nombre maximum d'enregistrements
- `offset`: Décalage pour la pagination
- `include`: Relations à inclure

## Fonctionnalités avancées

### Upsert

```typescript
// Insert or Update
const user = await UserModel.upsert({
  id: 1,
  name: 'John',
  email: 'john@example.com'
});

// Upsert avec préservation de l'ID
const user = await UserModel.upsertWithCoalesce({
  id: 1,
  name: 'John',
  email: 'john@example.com'
});
```

### Trouver ou créer

```typescript
const { record, created } = await UserModel.findOrCreate(
  { email: 'john@example.com' },
  { name: 'John' }
);
```

### Vérification d'existence

```typescript
const exists = await UserModel.exists({
  email: 'john@example.com'
});
```

### Comptage

```typescript
const count = await UserModel.count({
  status: 'active'
});
```

## Bonnes pratiques

1. **Types**: Toujours définir des interfaces pour vos modèles
2. **Validation**: Valider les données avant insertion
3. **Transactions**: Utiliser les transactions pour les opérations groupées
4. **Relations**: Utiliser les includes plutôt que des requêtes multiples
5. **Query Builder**: Préférer le Query Builder pour les requêtes complexes

## Gestion des erreurs

L'ORM inclut une gestion d'erreurs robuste. Toutes les méthodes sont asynchrones et peuvent lever des exceptions. Il est recommandé d'utiliser try/catch :

```typescript
try {
  const user = await UserModel.create({
    name: 'John',
    email: 'john@example.com'
  });
} catch (error) {
  console.error('Error creating user:', error);
}
```