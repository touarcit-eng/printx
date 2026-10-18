PRINTX — INTÉGRATION GRATUITE GOOGLE SHEETS + WHATSAPP
======================================================

CE QUE FAIT CETTE VERSION
- La page PrintX est servie par Google Apps Script.
- Au clic sur « Envoyer par WhatsApp », une fenêtre est préparée immédiatement.
- Le site enregistre d'abord la commande dans Google Sheets.
- WhatsApp ne s'ouvre avec le récapitulatif que si Google confirme l'enregistrement.
- Si l'enregistrement échoue, la fenêtre WhatsApp se ferme et le site affiche une erreur : aucune fausse confirmation.
- Le message WhatsApp est prérempli, mais le client doit encore appuyer sur Envoyer.
- « Enregistrer une copie locale » ne crée qu'une copie dans le navigateur du client.

INSTALLATION (à faire avec le compte Google propriétaire de PrintX)
1. Ouvrir https://script.google.com/ et créer un Nouveau projet.
2. Renommer le projet « PrintX — Commandes ».
3. Dans le fichier Code.gs, remplacer le contenu par celui du fichier Code.gs fourni ici.
4. Cliquer sur + à côté de « Fichiers », choisir HTML et nommer le fichier exactement : index
   (Apps Script crée index.html). Coller tout le contenu de index.html fourni ici.
5. Dans l'éditeur, choisir la fonction setupPrintX puis cliquer sur Exécuter.
6. Accepter les autorisations Google demandées. Cette fonction crée la feuille privée
   « PrintX — Base des commandes » dans le Drive du propriétaire.
7. Ouvrir Affichage > Journaux d'exécution (ou consulter le journal d'exécution) pour récupérer
   l'URL de la feuille. Garder cette feuille privée : ne pas la partager publiquement.
8. Cliquer sur Déployer > Nouveau déploiement.
9. Type : Application Web.
10. Exécuter en tant que : Moi (le propriétaire du projet).
11. Qui a accès : Toute personne (nécessaire pour que les clients sans compte Google puissent commander).
12. Déployer, autoriser si demandé, puis copier l'URL de l'application Web se terminant par /exec.
13. Ouvrir cette URL /exec pour utiliser le site connecté à Google Sheets. C'est cette URL qu'il faut
    partager avec les clients. Ne partagez pas l'URL de l'éditeur Apps Script.
14. Après chaque modification du code : Déployer > Gérer les déploiements > Modifier > Nouvelle version > Déployer.

IMPORTANT — SÉCURITÉ ET LIMITES
- Le site public doit pouvoir recevoir des commandes sans connexion Google. La feuille reste privée,
  mais l'URL publique peut être sollicitée par des robots. Le code limite les champs, vérifie le panier,
  neutralise les formules dans les cellules, évite les doublons par identifiant, utilise un champ piège
  anti-robot et limite les envois par numéro. Ces protections réduisent les abus courants, sans garantir
  une protection absolue contre un attaquant déterminé.
- Ne mettez jamais de mots de passe, de jeton secret ou d'identifiants Google dans index.html.
- Demandez uniquement les données nécessaires. Évitez les informations sensibles dans « Précisions ».
- Les quotas gratuits de Google Apps Script et Google Sheets s'appliquent. Ils peuvent évoluer.
- Ce système enregistre les commandes envoyées depuis le bouton WhatsApp. Il ne peut pas vérifier si
  le client a réellement appuyé sur « Envoyer » dans WhatsApp.
- Le site doit être ouvert via l'URL /exec d'Apps Script. Si vous ouvrez index.html directement ou
  l'hébergez sur un autre service, google.script.run n'est pas disponible et l'enregistrement en ligne
  ne fonctionnera pas.

TEST APRÈS DÉPLOIEMENT
1. Ouvrir le site /exec.
2. Ajouter un produit, saisir un nom, un téléphone et une ville.
3. Cliquer sur « Envoyer par WhatsApp ».
4. Vérifier que WhatsApp ne s'ouvre qu'après la confirmation d'enregistrement.
5. Vérifier que la ligne correspondante apparaît dans l'onglet Commandes de la feuille privée.
6. Ne pas considérer la commande comme envoyée tant que le client n'a pas appuyé sur Envoyer dans WhatsApp.


AMÉLIORATIONS DU PARCOURS CLIENT (version actuelle)
- Logo PrintX compact avec un seul X orange stylisé.
- Étapes visuelles : produits/panier, coordonnées, envoi sécurisé.
- Validation de quantité et du format du numéro de téléphone.
- Modification des quantités directement dans le panier avec les boutons + / −, sans supprimer puis recréer la ligne.
- Message clair distinguant une copie locale d'une commande réellement enregistrée en ligne.
- État d'enregistrement visible et WhatsApp ouvert seulement après confirmation de Sheets.
- Les produits peuvent être marqués dans le catalogue avec available: false ; ils restent visibles avec « Indisponible » et ne peuvent pas être ajoutés au panier. Aucun produit actuel n'a été marqué indisponible, car aucune liste de produits indisponibles n'a été fournie.
- Le serveur recalcule les totaux estimatifs à partir d'une liste de produits et de prix de référence ; il ne fait plus confiance aux totaux envoyés par le navigateur. Ces prix restent des exemples et doivent être validés avant usage commercial.