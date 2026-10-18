# Audit et checklist de livraison — 18 octobre 2026

## État du transfert initial

Les fichiers cités dans la demande (`/mnt/data/PrintX` et le ZIP de continuité) n'étaient pas disponibles dans cet environnement. Aucun ancien projet n'a donc pu être sauvegardé ou audité ; cette livraison est une reconstruction propre, sans prétendre être une correction des fichiers absents.

## Comportements implémentés

- Catalogue produit généré en JavaScript.
- Ajout et retrait du panier, quantités, compteur et total estimé.
- Persistance locale du panier par navigateur (`localStorage`).
- Validation native des champs de commande et blocage d'un panier vide.
- Message WhatsApp complet, encodé et ouvert dans un nouvel onglet uniquement après validation.
- Numéro WhatsApp professionnel configuré explicitement, sans destination cachée.
- Script Apps Script défensif : validation minimale, horodatage, identifiant et statut dans Sheets.

## Vérifications réellement effectuées

- Syntaxe de `app.js` et `Code.gs` vérifiée avec Node.
- Contenu et structure des fichiers vérifiés localement.
- Tentative d’ouverture locale dans le navigateur intégré : bloquée par sa politique de sécurité (protocole `file://` non autorisé), sans contournement.

## Non vérifié / dépendant du propriétaire

- Aucun test navigateur automatisé ou manuel n'a été effectué.
- WhatsApp n'a pas été ouvert et aucune demande n'a été envoyée.
- Aucun compte Google, classeur, autorisation Apps Script, déploiement Web App ni connexion Sheets n'a été utilisé.
- Le client ne fait volontairement pas encore d'appel vers `Code.gs` : cette connexion exige l'URL de déploiement, le choix de sécurité et une information de confidentialité.

## À faire avant publication

1. Tester avec une commande non réelle avant publication.
2. Relire produits, prix, devise, coordonnées, conditions, délais et politique de confidentialité.
3. Si Sheets est souhaité, créer la feuille, exécuter `setupSheet`, déployer puis intégrer l'endpoint avec consentement et contrôle d'origine.
4. Tester sur mobile et ordinateur dans un navigateur réel avant publication.
