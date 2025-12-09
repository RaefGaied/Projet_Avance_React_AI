# Guide Pratique - Intégration IA

## Configuration Initiale

1. **Obtenir une clé API Gemini**
   - Allez sur [Google AI Studio](https://ai.google.dev/)
   - Créez un nouveau projet
   - Générez une clé API

2. **Configurer l'environnement**
   ```bash
   # Dans le dossier backend
   cp .env.example .env
   ```
   
   Puis éditez `.env` :
   ```env
   GEMINI_API_KEY=votre_cle_api
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/edupplatform
   JWT_SECRET=votre_secret_jwt
   ```

## Démarrage Rapide

1. **Démarrer le serveur**
   ```bash
   # Installation des dépendances
   npm install
   
   # Démarrer le serveur
   node server.js
   ```
   
   L'API sera disponible sur : http://localhost:5000

2. **Tester les endpoints IA**
   
   **Analyse des avis** :
   ```bash
   curl -X POST http://localhost:5000/api/ai/analyze-reviews/COURSE_ID \
     -H "Authorization: Bearer VOTRE_JWT"
   ```
   
   **Générer une description** :
   ```bash
   curl -X POST http://localhost:5000/api/ai/generate-description \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer VOTRE_JWT" \
     -d '{"title": "Introduction à l\'IA", "instructor": "Dr. Smith"}'
   ```

## Tests

1. **Tester avec Postman**
   - Importez la collection Postman fournie
   - Configurez les variables d'environnement dans Postman
   - Exécutez les tests d'intégration

2. **Tests unitaires**
   ```bash
   # Exécuter les tests
   npm test
   
   # Couverture de test
   npm run test:coverage
   ```

## Déploiement

1. **Préparation pour la production**
   ```bash
   # Build du frontend
   cd frontend
   npm run build
   
   # Variables d'environnement de production
   cp .env.production .env
   ```

2. **Déploiement avec PM2**
   ```bash
   # Installation de PM2
   npm install -g pm2
   
   # Démarrer l'application
   pm2 start ecosystem.config.js
   
   # Sauvegarder la configuration
   pm2 save
   pm2 startup
   ```

##  Dépannage

### Erreurs Courantes

1. **Clé API invalide**
   - Vérifiez que la clé est correctement définie dans `.env`
   - Vérifiez les quotas sur Google Cloud Console

2. **Erreurs de connexion**
   ```bash
   # Vérifier les logs du serveur
   pm2 logs
   
   # Vérifier les dépendances
   npm list --depth=0
   ```

3. **Problèmes de CORS**
   Vérifiez la configuration dans `server.js` :
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```


