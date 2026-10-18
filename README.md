# PrintX

Boutique statique en français pour demandes de commandes personnalisées.

## Utilisation locale

Ouvrez `index.html` dans un navigateur. Le panier est stocké uniquement dans le `localStorage` du navigateur et de l'appareil utilisés. Il n'y a ni paiement ni envoi automatique.

Le numéro WhatsApp professionnel est configuré au format international. La demande est préparée dans un nouvel onglet WhatsApp : l'utilisateur doit toujours relire et appuyer lui-même sur Envoyer.

## Google Sheets (facultatif)

`Code.gs` est prêt à être collé dans un projet Apps Script lié à une feuille Google. Exécutez `setupSheet` une fois, puis déployez `doPost` comme application web selon les droits choisis. Aucun URL de déploiement, compte Google ni autorisation n'est inclus dans ce projet ; le site ne transmet donc encore aucune donnée à Google. Toute future intégration doit demander le consentement avant de soumettre les données.
