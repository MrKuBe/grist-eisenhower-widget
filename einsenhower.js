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

const quadrants = document.querySelectorAll('.quadrant-tasks');

// --- Initialisation des listeners Drag & Drop (une seule fois) ---
quadrants.forEach(q => {
    q.addEventListener('dragover', handleDragOver);
    q.addEventListener('dragleave', handleDragLeave);
    q.addEventListener('drop', handleDrop);
});


// --- DÉTECTION DES TAGS ---
function checkTag(val, keyword) {
    if (!val) return false;
    // Recherche textuelle brute dans la cellule (robuste aux formats ChoiceList)
    return JSON.stringify(val).toLowerCase().includes(keyword.toLowerCase());
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

    // Récupération des nouveaux tags via les data-attributes du quadrant HTML
    const isUrgent = this.getAttribute('data-urgent') === 'true';
    const isImportant = this.getAttribute('data-important') === 'true';

    let newTags = [];
    if (isImportant) newTags.push('important');
    if (isUrgent) newTags.push('urgent');

    try {
        // MÉTHODE ULTIME : On met à jour la "table sélectionnée" 
        // Cela évite de devoir fournir un ID de table (plus de KeyError)
        await grist.selectedTable.updateRecord(rowId, {
            eisenhower_matrix: newTags
        });
    } catch (err) {
        console.error("Erreur de mise à jour Grist :", err);
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
grist.onRecords((records) => {
    // Vider les quadrants avant de les remplir à nouveau
    quadrants.forEach(q => q.innerHTML = '');

    records.forEach(record => {
        if (record.status === 'Fait') return;

        const val = record.eisenhower_matrix;
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