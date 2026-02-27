document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialisation du mapping
    grist.ready({
      columns: [
        { name: 'comment', title: 'Commentaire' },
        { name: 'status', title: 'Statut' },
        { name: 'eisenhower_matrix', title: 'Matrice Eisenhower' }, 
        { name: 'deadline_date', title: 'Date' },
        { name: 'owner', title: 'Responsable' }
      ],
      requiredAccess: 'full' 
    });
    
    let columnMapping = null; // Variable pour stocker les vrais IDs des colonnes Grist
    let listenersAttached = false; // Drapeau pour n'attacher les listeners qu'une seule fois
    
    // --- DÉTECTION DES TAGS ---
    function checkTag(val, keyword) {
        if (!val) return false;
        const k = keyword.toLowerCase();
        
        // 1. Gestion des tableaux (ChoiceList standard)
        if (Array.isArray(val)) {
            return val.some(item => typeof item === 'string' && item.toLowerCase().includes(k));
        }
        
        // 2. Fallback "Brute Force" : Conversion en chaîne pour tout attraper (Objets, Proxies, JSON strings...)
        try {
            const str = (typeof val === 'string') ? val : JSON.stringify(val);
            return str.toLowerCase().includes(k);
        } catch (e) {
            return false;
        }
    }
    
    // --- LOGIQUE DRAG & DROP ---
    
    function handleDragStart(e) {
        // On stocke l'ID de la ligne dans le transfert
        e.dataTransfer.setData('text/plain', this.getAttribute('data-row-id'));
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragOver(e) {
        e.preventDefault(); 
        this.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }
    
    async function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const rowId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!rowId) return;
    
        // --- AMÉLIORATION : Mise à jour "optimiste" de l'interface ---
        // On déplace l'élément visuellement tout de suite pour une meilleure réactivité,
        // sans attendre la confirmation de Grist.
        const draggedElement = document.querySelector(`.task-item[data-row-id="${rowId}"]`);
        if (draggedElement) {
            this.appendChild(draggedElement); // 'this' est la zone de dépôt
        }
    
        // Récupération des nouveaux tags via les data-attributes du quadrant HTML
        const isUrgent = this.getAttribute('data-urgent') === 'true';
        const isImportant = this.getAttribute('data-important') === 'true';
    
        let newTags = [];
        if (isImportant) newTags.push('important');
        if (isUrgent) newTags.push('urgent');
    
        // Format spécifique Grist pour les ChoiceList : ['L', 'tag1', 'tag2']
        const valueToSend = ['L', ...newTags];
    
        try {
            // On récupère l'ID réel de la colonne dans Grist (ex: "Tags" au lieu de "eisenhower_matrix")
            const colId = columnMapping && columnMapping.eisenhower_matrix;
            
            // VÉRIFICATION : On s'assure que colId est bien une chaîne de caractères valide
            if (colId && typeof colId === 'string') {
                // DEBUG : On affiche ce qu'on va envoyer pour être sûr
                console.log(`Mise à jour Grist -> Ligne: ${rowId}, Colonne: ${colId}, Valeur:`, valueToSend);
    
                // Note : Si vous voyez #KeyError dans la cellule Grist, vérifiez qu'il n'y a pas
                // de "Formule Déclencheur" (Trigger Formula) active sur la colonne.
                // On utilise .update() avec le format standard [{id, fields}] et le vrai ID de colonne
                await grist.selectedTable.update([{
                    id: rowId,
                    fields: {
                        [colId]: valueToSend
                    }
                }]);
            } else {
                // Si le mapping est perdu ou incorrect, on prévient l'utilisateur et on annule visuellement
                console.error("Erreur de mapping : La colonne 'Matrice Eisenhower' n'est pas trouvée.");
                alert("Impossible de sauvegarder : La colonne 'Matrice Eisenhower' n'est pas correctement configurée dans le panneau de droite.");
                
                // On recharge les données pour annuler le mouvement visuel incorrect
                grist.fetchSelectedTable(); 
            }
        } catch (err) {
            console.error("Erreur de mise à jour Grist :", err);
            // En cas d'erreur, Grist enverra un `onRecords` avec les anciennes données,
            // ce qui annulera automatiquement notre déplacement visuel.
        }
    }
    
    // --- RENDU DES ÉLÉMENTS ---
    
    function createTaskElement(record) {
        const el = document.createElement('div');
        el.className = 'task-item';
        el.setAttribute('draggable', 'true');
        el.setAttribute('data-row-id', record.id);
        
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('click', () => grist.setCursorPos({ rowId: record.id }));
    
        const title = document.createElement('div');
        title.textContent = record.comment || 'Sans titre';
        el.appendChild(title);
    
        if (record.deadline_date) {
            const dateEl = document.createElement('small');
            dateEl.className = 'task-date';
            dateEl.textContent = `Éch. : ${new Date(record.deadline_date).toLocaleDateString('fr-FR')} | Resp. : ${record.owner}`;
            el.appendChild(dateEl);
        }
        
        return el;
    }
    
    // 2. Écouteur principal
    grist.onRecords((records, mappings) => {
        // À chaque mise à jour, on récupère les quadrants. C'est la méthode la plus robuste
        // pour contrer les problèmes de timing lors du rechargement de la vue.
        const quadrants = document.querySelectorAll('.quadrant-tasks');
        if (quadrants.length === 0) {
            console.warn("Affichage annulé : les quadrants ne sont pas encore prêts dans le HTML.");
            return; // On arrête tout si le HTML n'est pas prêt.
        }

        // On s'assure que les listeners pour le Drag & Drop ne sont attachés qu'une seule fois.
        if (!listenersAttached) {
            quadrants.forEach(q => {
                q.addEventListener('dragover', handleDragOver);
                q.addEventListener('dragleave', handleDragLeave);
                q.addEventListener('drop', handleDrop);
            });
            listenersAttached = true;
        }

        // On sauvegarde le mapping si Grist nous le fournit.
        if (mappings) {
            columnMapping = mappings;
        }
        if (!columnMapping) { return; } // Sécurité : on ne fait rien si le mapping n'est pas encore connu.
    
        // Vider les quadrants avant de les remplir à nouveau
        quadrants.forEach(q => q.innerHTML = '');
    
        records.forEach(record => {
            if (record.status === 'Fait') return;
    
            // Utilise le mapping pour accéder au bon champ Grist
            const fieldName = columnMapping.eisenhower_matrix;
            const val = record[fieldName];
    
            const imp = checkTag(val, 'important');
            const urg = checkTag(val, 'urgent');
    
            let targetId;
            if (imp && urg) targetId = 'quadrant-do-tasks';
            else if (imp) targetId = 'quadrant-schedule-tasks';
            else if (urg) targetId = 'quadrant-delegate-tasks';
            else targetId = 'quadrant-delete-tasks';
    
            const target = document.getElementById(targetId);
            if (target) target.appendChild(createTaskElement(record));
        });
    });
});