# Eisenhower Matrix Widget for Grist / Widget Matrice d'Eisenhower pour Grist

[English](#english) | [Français](#français)

---

<a name="english"></a>
## 🇬🇧 English

This project is a **Custom Widget** for [Grist](https://getgrist.com) that allows you to manage your tasks using an **Eisenhower Matrix**. It offers a visual interface in four quadrants to classify tasks according to their urgency and importance.

### Features

*   **Visualization**: Automatic distribution of tasks into 4 quadrants:
    *   *Do* (Urgent & Important)
    *   *Schedule* (Important & Not Urgent)
    *   *Delegate* (Urgent & Not Important)
    *   *Delete / To Sort* (Neither Urgent, Nor Important)
*   **Drag & Drop**: Move tasks from one quadrant to another to automatically update their tags (Urgent/Important).
*   **Filter**: Tasks with the status "Fait" (Done) are automatically hidden.
*   **Real-time**: Changes are instantly synchronized with your Grist document.

### Grist Configuration

To use this widget, add a "Custom" widget in Grist and map the following columns in the configuration panel:

| Widget Field | Expected Grist Column | Recommended Type |
| :--- | :--- | :--- |
| **Commentaire** | `comment` | Text |
| **Statut** | `status` | Choice / Text (Value 'Fait' to hide) |
| **Matrice Eisenhower** | `eisenhower_matrix` | ChoiceList |
| **Date** | `deadline_date` | Date |
| **Responsable** | `owner` | Text / Reference |

#### Expected HTML Structure

The JS script (`einsenhower.js`) interacts with 4 HTML containers defining the quadrants via `data-urgent` and `data-important` attributes:

*   `#quadrant-do-tasks` (Urgent + Important)
*   `#quadrant-schedule-tasks` (Important)
*   `#quadrant-delegate-tasks` (Urgent)
*   `#quadrant-delete-tasks` (None)

### Installation

1.  Host the files from this repository (HTML, CSS, JS) on an accessible server.
2.  In your Grist document:
    *   Add a new "Custom" widget.
    *   Select "Custom URL" and enter the URL of your `index.html` file.
    *   Configure the columns.
    *   Grant **Full** access (Read/Write) when requested.

### Development

"Vibe Coded" for maximum productivity.
The main file is `einsenhower.js`.

---

<a name="français"></a>
## 🇫🇷 Français

Ce projet est un **Custom Widget** pour Grist qui permet de gérer vos tâches via une **Matrice d'Eisenhower**. Il offre une interface visuelle en quatre quadrants pour classer les tâches selon leur urgence et leur importance.

### Fonctionnalités

*   **Visualisation** : Répartition automatique des tâches dans les 4 quadrants :
    *   *Faire* (Urgent & Important)
    *   *Planifier* (Important & Pas Urgent)
    *   *Déléguer* (Urgent & Pas Important)
    *   *Supprimer / À classer* (Ni Urgent, Ni Important)
*   **Drag & Drop** : Déplacez les tâches d'un quadrant à l'autre pour mettre à jour automatiquement leurs tags (Urgent/Important).
*   **Filtre** : Les tâches avec le statut "Fait" sont masquées automatiquement.
*   **Temps réel** : Les modifications sont synchronisées instantanément avec votre document Grist.

### Configuration requise dans Grist

Pour utiliser ce widget, ajoutez un widget "Custom" dans Grist et mappez les colonnes suivantes dans le panneau de configuration :

| Champ Widget | Colonne Grist attendue | Type recommandé |
| :--- | :--- | :--- |
| **Commentaire** | `comment` | Texte |
| **Statut** | `status` | Choice / Texte (Valeur 'Fait' pour masquer) |
| **Matrice Eisenhower** | `eisenhower_matrix` | ChoiceList (Liste de choix) |
| **Date** | `deadline_date` | Date |
| **Responsable** | `owner` | Texte / Reference |

#### Structure HTML attendue

Le script JS (`einsenhower.js`) interagit avec 4 conteneurs HTML définissant les quadrants via des attributs `data-urgent` et `data-important` :

*   `#quadrant-do-tasks` (Urgent + Important)
*   `#quadrant-schedule-tasks` (Important)
*   `#quadrant-delegate-tasks` (Urgent)
*   `#quadrant-delete-tasks` (Aucun)

### Installation

1.  Hébergez les fichiers de ce dépôt (HTML, CSS, JS) sur un serveur accessible.
2.  Dans votre document Grist :
    *   Ajoutez un nouveau widget "Custom".
    *   Sélectionnez "Custom URL" et entrez l'URL de votre fichier `index.html`.
    *   Configurez les colonnes.
    *   Accordez l'accès **Full** (Lecture/Écriture) lorsque demandé.

### Développement

Code "Vibe Coded" pour une productivité maximale.
Le fichier principal est `einsenhower.js`.