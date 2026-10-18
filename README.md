# PrintX — impression professionnelle personnalisée

Version complète bilingue français/arabe de PrintX : catalogue d'imprimés professionnels, personnalisation, panier, récapitulatif de commande et transfert vers WhatsApp.

## Aperçu GitHub Pages

Le lien https://touarcit-eng.github.io/printx/ sert l'interface en mode HTML autonome. Dans ce mode, les commandes ne sont pas enregistrées dans une feuille Google partagée : une copie éventuelle reste dans le navigateur utilisé, et le client doit lui-même confirmer l'envoi dans WhatsApp.

## Publication avec enregistrement centralisé

Pour enregistrer les commandes dans Google Sheets avant d'ouvrir WhatsApp, la version de production doit être publiée comme application Web Google Apps Script. Le code serveur est dans `Code.gs`. Suivez les étapes de `README-INSTALLATION.txt`, puis partagez uniquement l'URL publique de l'application Web terminant par `/exec`.

La feuille Google reste privée dans le Drive du propriétaire. Aucune connexion de la feuille ni déploiement Apps Script n'est présumé tant qu'une vraie commande test n'a pas été vérifiée dans la feuille.

## Tarifs et tests

Les prix du catalogue sont des estimations à confirmer avant la production. Après le déploiement Apps Script, réalisez le test de bout en bout décrit dans le guide : commande test, vérification de la ligne dans Google Sheets et ouverture du récapitulatif WhatsApp. Le client doit toujours appuyer sur **Envoyer** dans WhatsApp.
