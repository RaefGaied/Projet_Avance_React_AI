# Intégration d'Intelligence Artificielle avec Gemini

## Démonstration

### 1. Analyse des Avis
![Analyse des Avis](./screenshots/test_api_ai_analyse_reviews.png)

### 2. Génération de Bio
![Génération de Bio](./screenshots/test_api_ai_generate-bio.png)

### 3. Génération de Description
![Génération de Description](./screenshots/test_api_ai_generate-description.png)

### 4. Insights de la Plateforme
![Insights de la Plateforme](./screenshots/test_api_ai_platform-insights.png)

### 5. Cours Similaires
![Cours Similaires](./screenshots/test_api_ai_similar-courses.png)

---

## Fonctionnalités

### 1. Analyse des Avis
- Génération de rapports détaillés
- Analyse de sentiment
- Recommandations personnalisées

### 2. Génération de Contenu
- Descriptions de cours
- Biographies utilisateurs
- Résumés automatiques

## Configuration

1. Installer les dépendances :
```bash
npm install @google/generative-ai
```

2. Ajouter la clé API dans `.env` :
```env
GEMINI_API_KEY=votre_cle_api
```

## Utilisation

### Analyse des Avis
```javascript
// Exemple d'appel API
const response = await fetch('/api/ai/analyze-reviews/courseId', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Génération de Description
```javascript
const data = {
  title: "Introduction à l'IA",
  instructor: "Dr. Smith",
  keywords: ["IA", "Machine Learning"]
};

const response = await fetch('/api/ai/generate-description', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

## Structure du Projet

```
backend/
  ├── config/
  │   └── gemini.js
  ├── controllers/
  │   └── aiController.js
  └── routes/
      └── aiRoutes.js
```

## Sécurité
- Toutes les routes (sauf /similar-courses) nécessitent une authentification
- Validation des entrées utilisateur
- Gestion des erreurs détaillée
