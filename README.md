# Eisenhower Matrix Widget for Grist / Widget Matrice d'Eisenhower pour Grist

**[English](#english) | [Français](#français)**

---

⚠️ **Note**: This widget was designed for the **DINUM Grist instance** (`grist.numerique.gouv.fr`) but should work on other Grist instances as well. Compatibility with other instances has not been extensively tested.

<a name="english"></a>
## 🇬🇧 English

### Overview

This is a **Custom Widget** for [Grist](https://getgrist.com) that enables efficient task management through the **Eisenhower Matrix** framework. The widget provides a visual interface organized into four quadrants to classify tasks based on urgency and importance.

### ✨ Features

- **📊 Visual Matrix**: Automatically distributes tasks across 4 quadrants:
  - 🔥 **Do** (Urgent + Important) — Handle immediately
  - 📅 **Schedule** (Important, Not Urgent) — Plan for later
  - 🤝 **Delegate** (Urgent, Not Important) — Assign to others
  - 🗑️ **Delete** (Neither) — Eliminate or ignore

- **🎯 Drag & Drop**: Move tasks between quadrants to update tags in real-time
- **🚫 Auto-Filter**: Completed tasks (status = "Fait") are hidden automatically
- **⚡ Real-Time Sync**: Changes instantly sync with your Grist table
- **📱 Responsive Design**: Grid layout adapts to different screen sizes

### 📋 Grist Column Configuration

Map these columns in the widget settings panel:

| Widget Field | Grist Column Name | Data Type | Notes |
| :--- | :--- | :--- | :--- |
| **Commentaire** | `comment` | Text | Task description/title |
| **Statut** | `status` | Choice/Text | Use "Fait" to hide completed tasks |
| **Matrice Eisenhower** | Actual field name used in Grist | ChoiceList | Must contain "important" and/or "urgent" tags |
| **Date** | `deadline_date` | Date | Task deadline |
| **Responsable** | `owner` | Text/Reference | Task owner/assignee |

⚠️ **Important**: The actual column name in Grist may differ from the display name. The widget uses Grist's column mapping to resolve the correct field name dynamically.

### 🏗️ Technical Details

#### How It Works

1. The widget reads the column mapping provided by Grist
2. It parses the target column to detect "important" and "urgent" tags
3. Tasks are distributed into quadrants based on tag presence
4. Drag & Drop updates are converted to ChoiceList format: `['L', 'important', 'urgent']`
5. Changes are persisted via Grist's `.update()` API

#### Tag Detection

The `checkTag()` function supports multiple tag formats:
- Array values: `['important', 'urgent']`
- String values: `'important'` or `'important, urgent'`
- JSON stringified objects

### 📦 Installation

1. **Host the widget files** on an accessible server (HTTP/HTTPS):
   - `index.html`
   - `einsenhower.js`
   - `index.html` includes inline CSS

2. **Add the widget to Grist**:
   - Open your document
   - Create a new "Custom" widget
   - Paste the URL of `index.html`
   - In the widget settings panel, map the columns to your Grist table structure
   - Grant **Full** access permissions (Read + Write)

3. **Configure your columns**:
   - Ensure the ChoiceList column contains values like "important" and "urgent"
   - Set status values (recommend "Fait" for completed tasks)

### 🐛 Troubleshooting

**Tasks not appearing in the correct quadrant?**
- Check browser console (F12) for any errors
- Verify column names match exactly in the widget settings
- Ensure the ChoiceList column contains the expected tags

**Can't save changes?**
- Confirm you have **Full** (Write) access to the widget
- Check if a Trigger Formula is interfering with the column updates
- Review Grist's console for error messages

### 📝 Development

- **Main file**: `einsenhower.js` (JavaScript logic)
- **Markup**: `index.html` (HTML + inline CSS)
- **API**: Uses Grist's `grist.ready()` and `grist.onRecords()` callbacks

---

<a name="français"></a>
## 🇫🇷 Français

⚠️ **Note** : Ce widget a été conçu pour l'instance Grist de la **DINUM** (`grist.numerique.gouv.fr`) mais devrait fonctionner sur d'autres instances Grist. La compatibilité avec d'autres instances n'a pas été testée de manière exhaustive.

### Vue d'ensemble

Ce widget est un **Custom Widget** pour Grist qui facilite la gestion des tâches grâce à la **Matrice d'Eisenhower**. Le widget affiche une interface visuelle organisée en quatre quadrants pour classer les tâches selon leur urgence et leur importance.

### ✨ Fonctionnalités

- **📊 Matrice Visuelle** : Répartit automatiquement les tâches en 4 quadrants :
  - 🔥 **À faire** (Urgent + Important) — À traiter immédiatement
  - 📅 **À planifier** (Important, Pas urgent) — À prévoir
  - 🤝 **À déléguer** (Urgent, Pas important) — À assigner à quelqu'un d'autre
  - 🗑️ **À éliminer** (Ni l'un ni l'autre) — À supprimer ou ignorer

- **🎯 Glisser-Déposer** : Déplacez les tâches entre quadrants pour mettre à jour les tags en temps réel
- **🚫 Filtrage Automatique** : Les tâches complétées (status = "Fait") sont masquées automatiquement
- **⚡ Synchronisation Instantanée** : Les modifications se synchronisent immédiatement avec votre table Grist
- **📱 Responsive** : La mise en page s'adapte à différentes tailles d'écran

### 📋 Configuration des colonnes Grist

Mappez ces colonnes dans le panneau des paramètres du widget :

| Champ Widget | Nom Colonne Grist | Type de Données | Notes |
| :--- | :--- | :--- | :--- |
| **Commentaire** | `comment` | Texte | Titre/description de la tâche |
| **Statut** | `status` | Choice/Texte | Utilisez "Fait" pour masquer les tâches complétées |
| **Matrice Eisenhower** | Nom du champ réel dans Grist | ChoiceList | Doit contenir les tags "important" et/ou "urgent" |
| **Date** | `deadline_date` | Date | Date limite de la tâche |
| **Responsable** | `owner` | Texte/Reference | Propriétaire ou responsable de la tâche |

⚠️ **Important** : Le nom réel de la colonne dans Grist peut différer du nom d'affichage. Le widget utilise le mapping de colonnes de Grist pour résoudre dynamiquement le nom exact du champ.

### 🏗️ Détails Techniques

#### Fonctionnement

1. Le widget lit le mapping de colonnes fourni par Grist
2. Il analyse la colonne cible pour détecter les tags "important" et "urgent"
3. Les tâches sont réparties en quadrants selon la présence des tags
4. Les mises à jour par glisser-déposer sont converties au format ChoiceList : `['L', 'important', 'urgent']`
5. Les modifications sont persistées via l'API `.update()` de Grist

#### Détection des Tags

La fonction `checkTag()` supporte plusieurs formats de tags :
- Tableaux : `['important', 'urgent']`
- Chaînes : `'important'` ou `'important, urgent'`
- Objets convertis en JSON

### 📦 Installation

1. **Hébergez les fichiers du widget** sur un serveur accessible (HTTP/HTTPS) :
   - `index.html`
   - `einsenhower.js`
   - `index.html` inclut le CSS en ligne

2. **Ajoutez le widget à Grist** :
   - Ouvrez votre document
   - Créez un nouveau widget "Custom"
   - Collez l'URL de `index.html`
   - Dans le panneau de paramètres du widget, mappez les colonnes à votre structure Grist
   - Accordez l'accès **Full** (Lecture + Écriture)

3. **Configurez vos colonnes** :
   - Assurez-vous que la colonne ChoiceList contient des valeurs comme "important" et "urgent"
   - Définissez les valeurs de statut (recommandé : "Fait" pour les tâches complétées)

### 🐛 Dépannage

**Les tâches n'apparaissent pas dans le bon quadrant ?**
- Vérifiez la console du navigateur (F12) pour les erreurs
- Confirmez que les noms de colonnes correspondent exactement dans les paramètres du widget
- Assurez-vous que la colonne ChoiceList contient les tags attendus

**Impossible de sauvegarder les modifications ?**
- Confirmez que vous avez l'accès **Full** (Écriture) au widget
- Vérifiez qu'une formule déclencheur n'interfère pas avec les mises à jour de la colonne
- Consultez la console de Grist pour les messages d'erreur

### 📝 Développement

- **Fichier principal** : `einsenhower.js` (logique JavaScript)
- **Balisage** : `index.html` (HTML + CSS en ligne)
- **API** : Utilise les callbacks `grist.ready()` et `grist.onRecords()` de Grist