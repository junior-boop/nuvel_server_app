# SimpleORM - Documentation Complète

## Table des matières

1. [Introduction](#introduction)
2. [Installation et Configuration](#installation-et-configuration)
3. [Définition des Modèles](#définition-des-modèles)
4. [Opérations CRUD](#opérations-crud)
5. [Requêtes Avancées](#requêtes-avancées)
6. [Relations (Include)](#relations-include)
7. [Méthodes Utilitaires](#méthodes-utilitaires)
8. [Transactions](#transactions)
9. [Exemples Pratiques](#exemples-pratiques)

---

## Introduction

**SimpleORM** est un ORM (Object-Relational Mapping) léger et performant conçu spécialement pour **Cloudflare D1**. Il offre une API simple et intuitive pour interagir avec votre base de données SQLite tout en supportant TypeScript pour une meilleure sécurité des types.

### Caractéristiques principales

✅ **Type-safe** : Support complet de TypeScript avec autocomplétion  
✅ **Relations** : Support des relations hasMany, hasOne, et belongsTo  
✅ **Sélection de colonnes** : Optimisation des requêtes avec `select`  
✅ **Count automatique** : Comptage des relations avec l'option `count`  
✅ **Query Builder** : Chaînage de méthodes pour des requêtes complexes  
✅ **Transactions** : Support des opérations batch avec D1

---

## Installation et Configuration

### 1. Initialiser l'ORM

```typescript
import { defineModel, SimpleORM } from './utils/simpleorm';

// Dans votre worker Cloudflare
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const orm = new SimpleORM(env.DB); // env.DB est votre D1 Database
    // ... votre code
  }
}
```

### 2. Définir vos bindings TypeScript

```typescript
// types.ts
interface Env {
  DB: D1Database;
}
```

---

## Définition des Modèles

### Créer un modèle

```typescript
import { defineModel } from './utils/simpleorm';

// 1. Définir l'interface TypeScript pour votre modèle
export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

// 2. Définir le schéma de la table
const userSchema = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  email: 'TEXT NOT NULL UNIQUE',
  age: 'INTEGER',
  createdAt: 'DATETIME NOT NULL',
  updatedAt: 'DATETIME NOT NULL',
};

// 3. Créer le modèle avec defineModel
export const Users = (env: Env) => 
  defineModel<User>('users', userSchema, new SimpleORM(env.DB));
```

### Créer la table dans la base de données

```typescript
// Dans votre initialisation
const UserModel = Users(env);
await UserModel.createTable(); // Crée la table si elle n'existe pas
```

---

## Opérations CRUD

### Create - Créer un enregistrement

```typescript
const UserModel = Users(env);

// Créer un utilisateur
const newUser = await UserModel.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

console.log(newUser); 
// { id: 1, name: 'John Doe', email: 'john@example.com', ... }
```

### Read - Lire des enregistrements

#### Récupérer tous les enregistrements

```typescript
const users = await UserModel.findAll();
// [{ id: 1, name: 'John', ... }, { id: 2, name: 'Jane', ... }]
```

#### Récupérer par ID

```typescript
const user = await UserModel.findById(1);
// { id: 1, name: 'John Doe', ... } ou null si non trouvé
```

#### Récupérer un seul enregistrement avec conditions

```typescript
const user = await UserModel.findOne({
  where: { email: 'john@example.com' }
});
// { id: 1, name: 'John Doe', ... } ou null
```

### Update - Mettre à jour

#### Mettre à jour par ID

```typescript
const updatedUser = await UserModel.update(1, {
  name: 'John Smith',
  updatedAt: new Date().toISOString(),
});
// { id: 1, name: 'John Smith', ... }
```

#### Mettre à jour avec conditions

```typescript
const affectedRows = await UserModel.updateWhere(
  { email: 'john@example.com' }, // conditions
  { age: 31 } // nouvelles valeurs
);
// Retourne le nombre de lignes modifiées
```

### Delete - Supprimer

#### Supprimer par ID

```typescript
const deleted = await UserModel.delete(1);
// true si supprimé, false sinon
```

#### Supprimer avec conditions

```typescript
const deletedCount = await UserModel.deleteWhere({
  age: { $lt: 18 } // Exemple conceptuel
});
// Retourne le nombre de lignes supprimées
```

---

## Requêtes Avancées

### Option `where` - Filtrer les résultats

```typescript
const adults = await UserModel.findAll({
  where: {
    age: 18, // age = 18
    status: 'active' // AND status = 'active'
  }
});
```

### Option `select` - Sélectionner des colonnes spécifiques

```typescript
// Ne récupérer que certaines colonnes (optimisation)
const users = await UserModel.findAll({
  select: ['id', 'name', 'email'], // Type-safe!
  where: { status: 'active' }
});
// [{ id: 1, name: 'John', email: 'john@...' }]
```

### Option `orderBy` - Trier les résultats

#### Tri simple

```typescript
const users = await UserModel.findAll({
  orderBy: { column: 'name', direction: 'ASC' }
});
```

#### Tri multiple

```typescript
const users = await UserModel.findAll({
  orderBy: [
    { column: 'age', direction: 'DESC' },
    { column: 'name', direction: 'ASC' }
  ]
});
```

### Options `limit` et `offset` - Pagination

```typescript
// Récupérer les 10 premiers utilisateurs
const firstPage = await UserModel.findAll({
  limit: 10,
  offset: 0,
  orderBy: { column: 'createdAt', direction: 'DESC' }
});

// Page suivante
const secondPage = await UserModel.findAll({
  limit: 10,
  offset: 10,
  orderBy: { column: 'createdAt', direction: 'DESC' }
});
```

### Combiner toutes les options

```typescript
const results = await UserModel.findAll({
  select: ['id', 'name', 'email'],
  where: { status: 'active' },
  orderBy: { column: 'name', direction: 'ASC' },
  limit: 20,
  offset: 0
});
```

---

## Relations (Include)

SimpleORM supporte trois types de relations :
- **hasMany** : Un-à-plusieurs (1:N)
- **hasOne** : Un-à-un (1:1)
- **belongsTo** : Appartient-à (relation inverse)

### Relation `belongsTo`

**Exemple** : Un article appartient à un utilisateur

```typescript
// Modèles
interface Article {
  id: number;
  title: string;
  userId: number; // Clé étrangère
}

interface User {
  id: number;
  name: string;
}

// Récupérer des articles avec leurs auteurs
const articles = await ArticleModel.findAll({
  include: {
    model: 'users',          // Nom de la table liée
    as: 'author',            // Alias pour la propriété
    foreignKey: 'userId',    // Clé étrangère dans la table articles
    localKey: 'id',          // Clé primaire dans la table users
    type: 'belongsTo'
  }
});

// Résultat :
// [
//   {
//     id: 1,
//     title: 'Mon article',
//     userId: 5,
//     author: { id: 5, name: 'John Doe' } // ← Objet user
//   }
// ]
```

### Relation `hasMany`

**Exemple** : Un utilisateur a plusieurs articles

```typescript
const users = await UserModel.findAll({
  include: {
    model: 'articles',
    as: 'articles',
    foreignKey: 'userId',    // Clé étrangère dans la table articles
    localKey: 'id',          // Clé primaire dans la table users
    type: 'hasMany'
  }
});

// Résultat :
// [
//   {
//     id: 1,
//     name: 'John Doe',
//     articles: [           // ← Tableau d'articles
//       { id: 1, title: 'Article 1', userId: 1 },
//       { id: 2, title: 'Article 2', userId: 1 }
//     ]
//   }
// ]
```

### Relation `hasOne`

**Exemple** : Un utilisateur a un profil

```typescript
const users = await UserModel.findAll({
  include: {
    model: 'profiles',
    as: 'profile',
    foreignKey: 'userId',
    localKey: 'id',
    type: 'hasOne'
  }
});

// Résultat :
// [
//   {
//     id: 1,
//     name: 'John Doe',
//     profile: { id: 1, bio: 'Developer', userId: 1 } // ← Objet unique
//   }
// ]
```

### Option `select` dans les relations

Optimisez vos requêtes en ne sélectionnant que les colonnes nécessaires :

```typescript
const articles = await ArticleModel.findAll({
  select: ['id', 'title', 'createdAt'],
  include: {
    model: 'users',
    as: 'author',
    foreignKey: 'userId',
    type: 'belongsTo',
    select: ['id', 'name', 'photo'] // ← Seulement ces colonnes
  } as IncludeOptions<User>
});
```

### Option `where` dans les relations

Filtrez les relations avec des conditions :

```typescript
const users = await UserModel.findAll({
  include: {
    model: 'articles',
    as: 'publishedArticles',
    foreignKey: 'userId',
    type: 'hasMany',
    where: { status: 'published' }, // ← Filtre sur les articles
    select: ['id', 'title']
  }
});
```

### Option `count` - Compter les relations 🆕

L'option `count` permet d'obtenir **à la fois les données ET le nombre total** :

```typescript
const users = await UserModel.findAll({
  include: {
    model: 'articles',
    as: 'articles',
    foreignKey: 'userId',
    type: 'hasMany',
    count: true // ← Active le comptage
  }
});

// Résultat :
// [
//   {
//     id: 1,
//     name: 'John Doe',
//     articles: [{ id: 1, ... }, { id: 2, ... }], // Les données
//     articlesCount: 2                             // Le count automatique
//   }
// ]
```

**Note** : Le nom de la propriété count est automatiquement généré avec le suffixe `Count` basé sur le nom de la relation.

### Includes multiples

Vous pouvez inclure plusieurs relations en même temps :

```typescript
const articles = await ArticleModel.findAll({
  include: [
    {
      model: 'users',
      as: 'author',
      foreignKey: 'userId',
      type: 'belongsTo',
      select: ['id', 'name', 'photo']
    },
    {
      model: 'comments',
      as: 'comments',
      foreignKey: 'articleId',
      type: 'hasMany',
      where: { status: 'approved' },
      count: true
    },
    {
      model: 'categories',
      as: 'category',
      foreignKey: 'categoryId',
      type: 'belongsTo'
    }
  ]
});

// Résultat :
// [
//   {
//     id: 1,
//     title: 'Mon article',
//     author: { id: 5, name: 'John' },
//     comments: [{ id: 1, ... }, ...],
//     commentsCount: 15,
//     category: { id: 2, name: 'Tech' }
//   }
// ]
```

---

## Méthodes Utilitaires

### `exists` - Vérifier l'existence

```typescript
const userExists = await UserModel.exists({ 
  email: 'john@example.com' 
});
// true ou false
```

### `count` - Compter les enregistrements

```typescript
const totalUsers = await UserModel.count();
const activeUsers = await UserModel.count({ status: 'active' });
```

### `createMany` - Insertion en batch

```typescript
const users = await UserModel.createMany([
  { name: 'John', email: 'john@example.com', ... },
  { name: 'Jane', email: 'jane@example.com', ... },
  { name: 'Bob', email: 'bob@example.com', ... }
]);
// Insertion optimisée en une seule transaction
```

### `upsert` - Insérer ou remplacer

```typescript
// INSERT OR REPLACE
const user = await UserModel.upsert({
  id: 1,
  name: 'John Updated',
  email: 'john@example.com',
  ...
});
```

### `findOrCreate` - Trouver ou créer

```typescript
const { record, created } = await UserModel.findOrCreate(
  { email: 'john@example.com' }, // Conditions de recherche
  { name: 'John Doe', age: 30 }   // Valeurs par défaut si création
);

if (created) {
  console.log('Nouvel utilisateur créé');
} else {
  console.log('Utilisateur existant trouvé');
}
```

### `increment` / `decrement` - Incrémentation

```typescript
// Incrémenter une colonne numérique
await UserModel.increment(1, 'loginCount', 1); // +1
await UserModel.increment(1, 'points', 10);    // +10

// Décrémenter
await UserModel.decrement(1, 'credits', 5);    // -5
```

---

## Transactions

Les transactions permettent d'exécuter plusieurs opérations en batch :

```typescript
const orm = new SimpleORM(env.DB);

const statements = [
  () => orm['db'].prepare(
    'INSERT INTO users (name, email) VALUES (?, ?)'
  ).bind('John', 'john@example.com'),
  
  () => orm['db'].prepare(
    'INSERT INTO profiles (userId, bio) VALUES (?, ?)'
  ).bind(1, 'Developer'),
];

const results = await orm.transaction(statements);
// Toutes les requêtes réussissent ou échouent ensemble
```

---

## Exemples Pratiques

### Exemple 1 : Système de blog

```typescript
// Récupérer les articles récents avec auteur et nombre de commentaires
const recentArticles = await ArticleModel.findAll({
  select: ['id', 'title', 'description', 'imageUrl', 'createdAt'],
  orderBy: { column: 'createdAt', direction: 'DESC' },
  limit: 10,
  include: [
    {
      model: 'users',
      as: 'author',
      foreignKey: 'userId',
      type: 'belongsTo',
      select: ['id', 'name', 'photo']
    },
    {
      model: 'comments',
      as: 'comments',
      foreignKey: 'articleId',
      type: 'hasMany',
      where: { status: 'approved' },
      count: true
    }
  ]
});

// Résultat :
// [
//   {
//     id: 1,
//     title: 'Introduction à TypeScript',
//     description: '...',
//     imageUrl: 'https://...',
//     createdAt: '2024-01-15T...',
//     author: { id: 5, name: 'John Doe', photo: 'https://...' },
//     comments: [{ id: 1, ... }, { id: 2, ... }],
//     commentsCount: 2
//   },
//   ...
// ]
```

### Exemple 2 : Pagination avec métadonnées

```typescript
async function getPaginatedUsers(page: number = 1, perPage: number = 20) {
  const offset = (page - 1) * perPage;
  
  const [users, total] = await Promise.all([
    UserModel.findAll({
      select: ['id', 'name', 'email', 'createdAt'],
      orderBy: { column: 'createdAt', direction: 'DESC' },
      limit: perPage,
      offset: offset
    }),
    UserModel.count()
  ]);
  
  return {
    data: users,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage)
    }
  };
}

// Utilisation
const result = await getPaginatedUsers(2, 20);
// {
//   data: [{ id: 21, ... }, { id: 22, ... }, ...],
//   meta: { page: 2, perPage: 20, total: 150, totalPages: 8 }
// }
```

### Exemple 3 : Recherche avec statistiques

```typescript
const userStats = await UserModel.findAll({
  select: ['id', 'name', 'email'],
  where: { status: 'active' },
  include: [
    {
      model: 'articles',
      as: 'articles',
      foreignKey: 'userId',
      type: 'hasMany',
      select: ['id', 'title', 'createdAt'],
      count: true
    },
    {
      model: 'articles',
      as: 'publishedArticles',
      foreignKey: 'userId',
      type: 'hasMany',
      where: { status: 'published' },
      count: true
    }
  ]
});

// Résultat :
// [
//   {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com',
//     articles: [...],              // Tous les articles
//     articlesCount: 42,            // Nombre total
//     publishedArticles: [...],     // Articles publiés
//     publishedArticlesCount: 35    // Nombre publié
//   }
// ]
```

### Exemple 4 : Création avec relations

```typescript
// 1. Créer un utilisateur
const user = await UserModel.create({
  name: 'Jane Smith',
  email: 'jane@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// 2. Créer son profil
const profile = await ProfileModel.create({
  userId: user.id,
  bio: 'Full-stack developer',
  website: 'https://jane.dev'
});

// 3. Créer plusieurs articles
const articles = await ArticleModel.createMany([
  {
    userId: user.id,
    title: 'First Article',
    content: '...',
    createdAt: new Date().toISOString()
  },
  {
    userId: user.id,
    title: 'Second Article',
    content: '...',
    createdAt: new Date().toISOString()
  }
]);
```

---

## Bonnes Pratiques

### 1. Toujours utiliser `select` pour les grandes tables

```typescript
// ❌ Mauvais : Récupère toutes les colonnes
const users = await UserModel.findAll();

// ✅ Bon : Sélectionne uniquement ce qui est nécessaire
const users = await UserModel.findAll({
  select: ['id', 'name', 'email']
});
```

### 2. Utiliser `count: true` au lieu de charger toutes les données

```typescript
// ❌ Inefficace : Charge tous les commentaires juste pour les compter
const articles = await ArticleModel.findAll({
  include: {
    model: 'comments',
    as: 'comments',
    foreignKey: 'articleId',
    type: 'hasMany'
  }
});
const count = articles[0].comments.length;

// ✅ Efficace : Utilise count pour avoir les deux
const articles = await ArticleModel.findAll({
  include: {
    model: 'comments',
    as: 'comments',
    foreignKey: 'articleId',
    type: 'hasMany',
    select: ['id', 'text'], // Colonnes minimales si on a besoin des données
    count: true              // + Le count
  }
});
```

### 3. Pagination pour les grandes listes

```typescript
// Toujours utiliser limit/offset pour les listes
const articles = await ArticleModel.findAll({
  limit: 20,
  offset: (page - 1) * 20,
  orderBy: { column: 'createdAt', direction: 'DESC' }
});
```

### 4. Type Safety avec TypeScript

```typescript
// Définir des types pour vos modèles
import { IncludeOptions } from './utils/simpleorm';

const articles = await ArticleModel.findAll({
  include: {
    model: 'users',
    as: 'author',
    foreignKey: 'userId',
    type: 'belongsTo',
    select: ['id', 'name', 'email']
  } as IncludeOptions<User> // ← Type-safe!
});
```

---

## Dépannage

### Erreur : "Table not found"

```typescript
// Solution : Créer la table d'abord
await UserModel.createTable();
```

### Erreur : "Query failed"

Activez les logs pour voir la requête SQL :

```typescript
// Dans simpleorm.ts, la méthode query() log déjà les erreurs
console.error('Query error:', error, 'SQL:', sql, 'Params:', params);
```

### Performance lente

1. Utilisez `select` pour limiter les colonnes
2. Ajoutez des index sur vos colonnes fréquemment recherchées
3. Utilisez `count: true` au lieu de charger toutes les relations

---

## Référence API Complète

### Méthodes du Modèle

| Méthode | Description | Retour |
|---------|-------------|--------|
| `create(data)` | Créer un enregistrement | `Promise<T>` |
| `createMany(dataArray)` | Créer plusieurs enregistrements | `Promise<T[]>` |
| `findAll(options?)` | Récupérer tous les enregistrements | `Promise<T[]>` |
| `findById(id, options?)` | Récupérer par ID | `Promise<T \| null>` |
| `findOne(options)` | Récupérer un enregistrement | `Promise<T \| null>` |
| `update(id, data)` | Mettre à jour par ID | `Promise<T \| null>` |
| `updateWhere(conditions, data)` | Mettre à jour avec conditions | `Promise<number>` |
| `delete(id)` | Supprimer par ID | `Promise<boolean>` |
| `deleteWhere(conditions)` | Supprimer avec conditions | `Promise<number>` |
| `count(conditions?)` | Compter les enregistrements | `Promise<number>` |
| `exists(conditions)` | Vérifier l'existence | `Promise<boolean>` |
| `upsert(data)` | Insérer ou remplacer | `Promise<T>` |
| `findOrCreate(conditions, defaults)` | Trouver ou créer | `Promise<{record: T, created: boolean}>` |
| `increment(id, column, value?)` | Incrémenter une colonne | `Promise<T \| null>` |
| `decrement(id, column, value?)` | Décrémenter une colonne | `Promise<T \| null>` |

### Options de Requête

```typescript
interface QueryOptions<T> {
  where?: Partial<T>;                   // Conditions de filtrage
  select?: (keyof T)[];                 // Colonnes à sélectionner
  orderBy?: OrderByOptions | OrderByOptions[]; // Tri
  limit?: number;                       // Limite de résultats
  offset?: number;                      // Offset pour pagination
  include?: IncludeOptions | IncludeOptions[]; // Relations
}
```

### Options d'Include

```typescript
interface IncludeOptions<TRelated> {
  model: string;                        // Nom de la table liée
  foreignKey: string;                   // Clé étrangère
  localKey?: string;                    // Clé locale (défaut: 'id')
  as?: string;                          // Alias pour la propriété
  type?: 'hasMany' | 'hasOne' | 'belongsTo'; // Type de relation
  where?: Partial<TRelated>;            // Filtres sur la relation
  select?: (keyof TRelated)[];          // Colonnes de la relation
  count?: boolean;                      // Ajouter le count (défaut: false)
}
```

---

## Support et Contribution

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou contribuer au projet.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Licence** : MIT