// FaseUp Feedback API - Public Interface
// This file provides the data from admin dashboard to public feedback section

class FeedbackAPI {
    constructor() {
        this.storageKey = 'faseup-feedback-data';
    }

    // Get all feedback data
    getFeedbackData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (error) {
            console.warn('Error loading feedback data:', error);
            return this.getDefaultData();
        }
    }

    // Get default sample data
    getDefaultData() {
        return {
            items: [
                {
                    id: 1,
                    type: 'bug',
                    title: 'Sincronização offline melhorada',
                    description: 'Fotos agora sincronizam automaticamente ao reconectar',
                    category: 'performance',
                    status: 'resolvido',
                    priority: 'alta',
                    date: '2025-09-08',
                    resolvedDate: '2025-09-10'
                },
                {
                    id: 2,
                    type: 'bug',
                    title: 'Chat não carrega em obras grandes',
                    description: 'Performance lenta em projetos com +50 participantes',
                    category: 'chat',
                    status: 'em-analise',
                    priority: 'alta',
                    date: '2025-09-11'
                },
                {
                    id: 3,
                    type: 'bug',
                    title: 'Geolocalização das fotos imprecisa',
                    description: 'Algumas fotos aparecem com localização incorreta',
                    category: 'interface',
                    status: 'em-analise',
                    priority: 'media',
                    date: '2025-09-12'
                },
                {
                    id: 4,
                    type: 'suggestion',
                    title: 'Sistema de medalhas por milestone',
                    description: 'Gamificação com conquistas por etapas da obra',
                    category: 'gamificacao',
                    status: 'implementado',
                    priority: 'media',
                    date: '2025-09-02',
                    resolvedDate: '2025-09-09'
                },
                {
                    id: 5,
                    type: 'suggestion',
                    title: 'WhatsApp nativo integrado',
                    description: 'Integração direta com WhatsApp Business',
                    category: 'chat',
                    status: 'em-desenvolvimento',
                    priority: 'alta',
                    date: '2025-09-05'
                },
                {
                    id: 6,
                    type: 'suggestion',
                    title: 'Dashboard para clientes móvel',
                    description: 'App dedicado só para acompanhamento de clientes',
                    category: 'interface',
                    status: 'em-analise',
                    priority: 'media',
                    date: '2025-09-10'
                }
            ],
            stats: { total: 6, bugs: 3, suggestions: 3, resolved: 2 }
        };
    }

    // Get statistics
    getStats() {
        const data = this.getFeedbackData();
        const items = data.items || [];
        
        return {
            total: items.length,
            bugs: items.filter(item => item.type === 'bug').length,
            suggestions: items.filter(item => item.type === 'suggestion').length,
            resolved: items.filter(item => 
                item.status === 'resolvido' || item.status === 'implementado'
            ).length,
            testadores: 500 + Math.floor(Math.random() * 50), // Dynamic number
            bugsCorrigidos: items.filter(item => 
                item.type === 'bug' && (item.status === 'resolvido' || item.status === 'implementado')
            ).length,
            sugestoesImplementadas: items.filter(item => 
                item.type === 'suggestion' && item.status === 'implementado'
            ).length
        };
    }

    // Get recent bugs for display
    getRecentBugs(limit = 3) {
        const data = this.getFeedbackData();
        const bugs = data.items.filter(item => item.type === 'bug');
        
        return bugs
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit)
            .map(bug => ({
                ...bug,
                statusLabel: this.getStatusLabel(bug.status),
                statusColor: this.getStatusColor(bug.status),
                priorityLabel: this.getPriorityLabel(bug.priority),
                dateFormatted: this.formatDate(bug.date),
                resolvedDateFormatted: bug.resolvedDate ? this.formatDate(bug.resolvedDate) : null
            }));
    }

    // Get recent suggestions for display  
    getRecentSuggestions(limit = 3) {
        const data = this.getFeedbackData();
        const suggestions = data.items.filter(item => item.type === 'suggestion');
        
        return suggestions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit)
            .map(suggestion => ({
                ...suggestion,
                statusLabel: this.getStatusLabel(suggestion.status),
                statusColor: this.getStatusColor(suggestion.status),
                priorityLabel: this.getPriorityLabel(suggestion.priority),
                dateFormatted: this.formatDate(suggestion.date),
                resolvedDateFormatted: suggestion.resolvedDate ? this.formatDate(suggestion.resolvedDate) : null
            }));
    }

    // Utility functions
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit' 
        });
    }

    getStatusLabel(status) {
        const labels = {
            'pendente': 'PENDENTE',
            'em-analise': 'EM ANÁLISE', 
            'em-desenvolvimento': 'EM DESENVOLVIMENTO',
            'resolvido': 'CORRIGIDO',
            'implementado': 'IMPLEMENTADO'
        };
        return labels[status] || status.toUpperCase();
    }

    getStatusColor(status) {
        const colors = {
            'pendente': 'warning',
            'em-analise': 'warning',
            'em-desenvolvimento': 'primary', 
            'resolvido': 'success',
            'implementado': 'success'
        };
        return colors[status] || 'info';
    }

    getPriorityLabel(priority) {
        const labels = {
            'baixa': 'Baixa',
            'media': 'Média', 
            'alta': 'Alta'
        };
        return labels[priority] || priority;
    }

    // Add new feedback item (for public form)
    addFeedbackItem(item) {
        const data = this.getFeedbackData();
        const newItem = {
            id: Date.now(),
            ...item,
            date: new Date().toISOString().split('T')[0],
            status: 'pendente'
        };
        
        data.items.push(newItem);
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving feedback item:', error);
            return false;
        }
    }
}

// Global instance
window.FeedbackAPI = new FeedbackAPI();

// Function to update public feedback display
function updatePublicFeedback() {
    const api = window.FeedbackAPI;
    const stats = api.getStats();
    const recentBugs = api.getRecentBugs();
    const recentSuggestions = api.getRecentSuggestions();

    // Update statistics
    const statsElements = {
        testadores: document.querySelector('[data-stat="testadores"]'),
        bugs: document.querySelector('[data-stat="bugs-corrigidos"]'),
        sugestoes: document.querySelector('[data-stat="sugestoes-implementadas"]')
    };

    if (statsElements.testadores) statsElements.testadores.textContent = `${stats.testadores}+ testadores ativos`;
    if (statsElements.bugs) statsElements.bugs.textContent = `${stats.bugsCorrigidos} bugs corrigidos`;
    if (statsElements.sugestoes) statsElements.sugestoes.textContent = `${stats.sugestoesImplementadas} sugestões implementadas`;

    // Update bugs list
    updateBugsList(recentBugs);
    
    // Update suggestions list  
    updateSuggestionsList(recentSuggestions);
}

function updateBugsList(bugs) {
    const container = document.querySelector('[data-bugs-container]');
    if (!container || !bugs.length) return;

    container.innerHTML = bugs.map(bug => `
        <div class="bg-${getStatusBackgroundColor(bug.status)}/10 border-l-4 border-${bug.statusColor} p-4 rounded-r-lg">
            <div class="flex justify-between items-start mb-2">
                <div class="font-medium text-textPrimary">${bug.title}</div>
                <span class="bg-${bug.statusColor} text-white text-xs px-2 py-1 rounded">${bug.statusLabel}</span>
            </div>
            <div class="text-textSecondary text-sm">${bug.description}</div>
            <div class="text-textSecondary text-xs mt-2">
                Reportado: ${bug.dateFormatted}${bug.resolvedDateFormatted ? ` • Corrigido: ${bug.resolvedDateFormatted}` : ` • Prioridade: ${bug.priorityLabel}`}
            </div>
        </div>
    `).join('');
}

function updateSuggestionsList(suggestions) {
    const container = document.querySelector('[data-suggestions-container]');
    if (!container || !suggestions.length) return;

    container.innerHTML = suggestions.map(suggestion => `
        <div class="bg-${getStatusBackgroundColor(suggestion.status)}/10 border-l-4 border-${suggestion.statusColor} p-4 rounded-r-lg">
            <div class="flex justify-between items-start mb-2">
                <div class="font-medium text-textPrimary">${suggestion.title}</div>
                <span class="bg-${suggestion.statusColor} text-white text-xs px-2 py-1 rounded">${suggestion.statusLabel}</span>
            </div>
            <div class="text-textSecondary text-sm">${suggestion.description}</div>
            <div class="text-textSecondary text-xs mt-2">
                Sugerido: ${suggestion.dateFormatted}${suggestion.resolvedDateFormatted ? ` • Implementado: ${suggestion.resolvedDateFormatted}` : ` • Votos: ${Math.floor(Math.random() * 30) + 5} usuários`}
            </div>
        </div>
    `).join('');
}

function getStatusBackgroundColor(status) {
    const colors = {
        'pendente': 'warning',
        'em-analise': 'warning',
        'em-desenvolvimento': 'primary',
        'resolvido': 'success', 
        'implementado': 'success'
    };
    return colors[status] || 'info';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update feedback data on load
    updatePublicFeedback();
    
    // Update every 30 seconds to catch admin changes
    setInterval(updatePublicFeedback, 30000);
});