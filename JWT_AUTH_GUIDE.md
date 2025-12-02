# Guide Complet: JWT et Authentification dans EduPlatform

## Table des Matières
1. [Qu'est-ce que JWT?](#quest-ce-que-jwt)
2. [Architecture de l'Authentification](#architecture-de-lauthentification)
3. [Implémentation Frontend](#implémentation-frontend)
4. [Implémentation Backend](#implémentation-backend)
5. [Flux d'Authentification Complet](#flux-dauthentification-complet)
6. [Sécurité et Bonnes Pratiques](#sécurité-et-bonnes-pratiques)

---

## Qu'est-ce que JWT?

### Définition
Un **JWT (JSON Web Token)** est un standard ouvert (RFC 7519) qui définit une manière compacte et auto-contenue de transmettre des informations entre deux parties sous forme d'objet JSON.

### Structure d'un JWT
Un JWT se compose de 3 parties séparées par des points (`.`):

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJhYmMxMjM0NTY3ODkiLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

└─ Header         └─ Payload                    └─ Signature
\`\`\`

#### 1. Header (En-tête)
Contient le type de token et l'algorithme de signature utilisé.

\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

#### 2. Payload (Données)
Contient les informations (claims) à transmettre. Exemple:

\`\`\`json
{
  "userId": "672abc1234567890",
  "email": "alice@example.com",
  "iat": 1702000000,
  "exp": 1702086400
}
\`\`\`

**Claims importants:**
- `iat` (issued at): Timestamp de création
- `exp` (expiration time): Timestamp d'expiration
- `userId`: ID unique de l'utilisateur
- `email`: Email de l'utilisateur

#### 3. Signature
Créée en signant les deux premières parties avec une clé secrète et l'algorithme spécifié:

\`\`\`
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
\`\`\`

**Avantage**: La signature garantit que le token n'a pas été modifié.

---

## Architecture de l'Authentification

### Schéma du Flux

\`\`\`
┌─────────────┐          Credentials           ┌─────────────┐
│   Client    │─────────────────────────────→  │   Backend   │
│   React     │                                 │  Express    │
└─────────────┘                                 └─────────────┘
      ↑                                                │
      │              JWT Token                        │
      └────────────────────────────────────────────────┘
      
      Store Token (localStorage)
      
┌─────────────┐          Token in Header       ┌─────────────┐
│   Client    │─────────────────────────────→  │   Backend   │
│   React     │  Authorization: Bearer JWT     │  Express    │
└─────────────┘                                 └─────────────┘
      ↑                                                │
      │         Protected Data (User info)           │
      └────────────────────────────────────────────────┘
\`\`\`

### Types de Routes

**Routes Publiques**
- Accessible sans authentification
- Exemple: `/login`, `/register`, `/courses` (liste)

**Routes Protégées**
- Nécessite une authentification valide
- Le client doit envoyer un JWT valide
- Exemple: `/profile`, `/my-reviews`, `/courses/:id` (détails)

---

## Implémentation Frontend

### 1. Configuration Axios

**Fichier: `src/utils/axios.ts`**

\`\`\`typescript
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
})

// Intercepteur pour ajouter le token automatiquement
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
\`\`\`

**Fonctionnement:**
- Avant chaque requête, le token est récupéré de localStorage
- Le token est ajouté dans le header `Authorization: Bearer <token>`
- Aucun besoin de gérer le token manuellement dans chaque requête

### 2. Context d'Authentification

**Fichier: `src/context/AuthContext.tsx`**

Le Context API gère l'état global d'authentification:

\`\`\`typescript
interface AuthContextType {
  user: User | null           // Utilisateur connecté
  token: string | null        // JWT token
  isLoading: boolean          // État de chargement
  login: (email, password) => Promise<void>
  register: (username, email, password) => Promise<void>
  logout: () => void
  isAuthenticated: boolean    // boolean pour vérifier l'authentification
}
\`\`\`

**Méthodes principales:**

#### `login(email, password)`
\`\`\`typescript
const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password })
  const { token, user } = response.data
  
  // Sauvegarder en localStorage
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
  
  // Mettre à jour l'état
  setToken(token)
  setUser(user)
}
\`\`\`

#### `register(username, email, password)`
Crée un nouvel utilisateur et retourne automatiquement un token.

#### `logout()`
\`\`\`typescript
const logout = () => {
  setUser(null)
  setToken(null)
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
\`\`\`

### 3. Routes Protégées

**Fichier: `src/components/ProtectedRoute.tsx`**

\`\`\`typescript
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <div>Chargement...</div>
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}
\`\`\`

**Comportement:**
- Vérifie si l'utilisateur a un token valide
- Redirige vers `/login` si non authentifié
- Affiche le contenu si authentifié

### 4. Utilisation dans les Composants

**Exemple dans une page:**

\`\`\`typescript
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  
  return (
    <div>
      <h1>Profil de {user?.username}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  )
}
\`\`\`

---

## Implémentation Backend

### 1. Dépendances Requises

\`\`\`bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/jsonwebtoken
\`\`\`

### 2. Modèle User avec Password

**Fichier: `models/User.js`**

\`\`\`javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, { timestamps: true })
\`\`\`

### 3. Routes d'Authentification

**Fichier: `routes/authRoutes.js`**

#### Route Register

\`\`\`javascript
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Vérifier si l'utilisateur existe
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé' })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
\`\`\`

#### Route Login

\`\`\`javascript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Trouver l'utilisateur
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      })
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
\`\`\`

### 4. Middleware de Protection

**Fichier: `middleware/authMiddleware.js`**

\`\`\`javascript
const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  let token

  // Récupérer le token du header Authorization
  if (req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer ')) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1]

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Ajouter l'ID utilisateur à la requête
      req.userId = decoded.userId

      next()
    } catch (error) {
      res.status(401).json({ message: 'Token invalide' })
    }
  }

  if (!token) {
    res.status(401).json({ 
      message: 'Pas de token, accès refusé' 
    })
  }
}

module.exports = { protect }
\`\`\`

### 5. Utilisation du Middleware

\`\`\`javascript
const { protect } = require('../middleware/authMiddleware')

// Route publique
router.get('/', async (req, res) => {
  // Accessible sans authentification
})

// Route protégée
router.get('/profile', protect, async (req, res) => {
  // req.userId contient l'ID de l'utilisateur connecté
  const user = await User.findById(req.userId).select('-password')
  res.json(user)
})
\`\`\`

### 6. Variables d'Environnement

**Fichier: `.env`**

\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eduplatform
JWT_SECRET=votre_secret_super_securise_ici_changez_le
NODE_ENV=development
\`\`\`

⚠️ **Important**: Changez le `JWT_SECRET` en production et gardez-le secret!

---

## Flux d'Authentification Complet

### Étape 1: Inscription

\`\`\`
Utilisateur
    ↓
[Page Register] → Saisit username, email, password
    ↓
POST /api/auth/register
    ↓
[Backend]
  - Valider les données
  - Hasher le password avec bcrypt
  - Créer l'utilisateur en DB
  - Générer JWT
    ↓
Retourner { token, user }
    ↓
[Frontend]
  - Sauvegarder token en localStorage
  - Mettre à jour AuthContext
  - Rediriger vers /courses
\`\`\`

### Étape 2: Connexion

\`\`\`
Utilisateur
    ↓
[Page Login] → Saisit email, password
    ↓
POST /api/auth/login
    ↓
[Backend]
  - Chercher utilisateur par email
  - Vérifier password avec bcrypt.compare()
  - Générer JWT avec userId
    ↓
Retourner { token, user }
    ↓
[Frontend]
  - Sauvegarder token en localStorage
  - Mettre à jour AuthContext
  - Rediriger vers page protégée
\`\`\`

### Étape 3: Requête Authentifiée

\`\`\`
Utilisateur clique sur "Mon Profil"
    ↓
[Frontend] GET /api/user/profile
  - Intercepteur Axios ajoute:
    Authorization: Bearer <token>
    ↓
[Backend] middleware protect
  - Extraire token du header
  - Vérifier signature JWT
  - Décoder et obtenir userId
  - Passer à la route
    ↓
Route protégée accède à req.userId
  - Récupérer utilisateur de la DB
  - Retourner les données
    ↓
[Frontend] Afficher les données utilisateur
\`\`\`

### Étape 4: Déconnexion

\`\`\`
Utilisateur clique sur "Déconnexion"
    ↓
[Frontend]
  - Supprimer token de localStorage
  - Vider AuthContext
  - Rediriger vers /login
\`\`\`

---

## Sécurité et Bonnes Pratiques

### 1. Stockage du Token

✅ **Recommandé**: localStorage (pour SPA)
\`\`\`javascript
localStorage.setItem('token', token)
\`\`\`

⚠️ **Considérations**: 
- localStorage est vulnérable au XSS (Cross-Site Scripting)
- Mais c'est le standard pour les SPAs

🔒 **Plus sécurisé**: HttpOnly Cookies
- Non accessible via JavaScript
- Protection contre XSS
- Nécessite configuration serveur CORS

### 2. Expiration du Token

**Recommandation**: Entre 1h et 7 jours selon le contexte

\`\`\`javascript
// Token court terme (1 heure)
jwt.sign(payload, secret, { expiresIn: '1h' })

// Token long terme (7 jours)
jwt.sign(payload, secret, { expiresIn: '7d' })
\`\`\`

### 3. Refresh Token (Optionnel)

Pour une meilleure sécurité:

\`\`\`javascript
// Générer 2 tokens
const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' })
const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' })

// Client: Quand accessToken expire, utiliser refreshToken pour en obtenir un nouveau
\`\`\`

### 4. Mot de Passe Sécurisé

Toujours hasher avec bcrypt:

\`\`\`javascript
// ✅ Correct
const hashedPassword = await bcrypt.hash(password, 10)

// ❌ Jamais faire ça
const hashedPassword = password // DANGEREUX!
\`\`\`

### 5. Secrets Sécurisés

\`\`\`env
# ✅ Bon secret (aléatoire, long, unique)
JWT_SECRET=aX9dKmL2pQ7rTvWxYzAb3CdEfGhIjKlMnOpQrStUvWxYz

# ❌ Mauvais secrets
JWT_SECRET=password
JWT_SECRET=secret123
JWT_SECRET=votre_secret_super_securise_ici_changez_le
\`\`\`

### 6. Validation des Données

Toujours valider côté backend:

\`\`\`javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // ✅ Valider
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et password requis' })
  }
  
  // ✅ Email format valide
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Email invalide' })
  }
  
  // Continuer...
})
\`\`\`

### 7. HTTPS en Production

- Tous les tokens doivent être transmis via HTTPS
- Jamais en HTTP (token en clair!)

### 8. Rate Limiting

Limiter les tentatives de login:

\`\`\`javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 tentatives max
})

router.post('/login', limiter, async (req, res) => {
  // ...
})
\`\`\`

---

## Résumé des Concepts Clés

| Concept | Description |
|---------|-------------|
| **JWT** | Token auto-contenu pour authentifier les requêtes |
| **Token** | Identifie et valide un utilisateur connecté |
| **Header** | Type de token et algorithme de signature |
| **Payload** | Données de l'utilisateur (userId, email, etc.) |
| **Signature** | Garantit que le token n'a pas été modifié |
| **localStorage** | Stocke le token côté client |
| **Axios Interceptor** | Ajoute automatiquement le token aux requêtes |
| **ProtectedRoute** | Vérifie l'authentification avant d'afficher une page |
| **bcrypt** | Hache les mots de passe de manière sécurisée |
| **Middleware** | Valide le token côté backend |

---

## Dépannage Courant

### Erreur: "Token invalide"
- Vérifier que le token n'est pas expiré
- Vérifier que `JWT_SECRET` est identique frontend/backend
- Vérifier que le token est correctement envoyé dans le header

### Erreur: "Accès refusé"
- Vérifier que le middleware `protect` est appliqué à la route
- Vérifier que le token est présent dans localStorage

### Erreur: "Email déjà utilisé"
- Cet utilisateur existe déjà
- Utiliser la page de login

---

**Fin du guide complet JWT!**
