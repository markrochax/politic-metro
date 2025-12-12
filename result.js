// result.js - VERSÃO SIMPLIFICADA E FUNCIONAL
console.log('Resultado carregado!');

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM carregado, iniciando resultado...');

    // Mostrar conteúdo após 1 segundo
    setTimeout(() => {
        loadAndShowResults();
    }, 1000);
});

function loadAndShowResults() {
    console.log('Carregando resultados...');

    // Verificar localStorage
    console.log('Chaves no localStorage:', Object.keys(localStorage));

    let results = null;

    // Tentar várias formas de carregar os resultados
    const savedResults = localStorage.getItem('quizResults');
    const savedScore = localStorage.getItem('quizScore');
    const savedPosition = localStorage.getItem('quizPosition');

    console.log('quizResults:', savedResults);
    console.log('quizScore:', savedScore);
    console.log('quizPosition:', savedPosition);

    if (savedResults) {
        try {
            results = JSON.parse(savedResults);
            console.log('Resultados carregados do quizResults:', results);
        } catch (e) {
            console.error('Erro ao parsear quizResults:', e);
        }
    }

    // Se não tiver resultados completos, criar com dados disponíveis
    if (!results && savedScore) {
        results = {
            totalScore: parseInt(savedScore) || 0,
            position: savedPosition || "Centro",
            timestamp: new Date().toISOString()
        };
        console.log('Resultados criados com dados básicos:', results);
    }

    // Se ainda não tiver resultados, mostrar erro
    if (!results) {
        console.error('Nenhum resultado encontrado!');
        showNoResultsError();
        return;
    }

    // Processar e mostrar resultados
    processResults(results);
    showResults(results);

    // Esconder loader
    document.getElementById('resultLoader').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('resultLoader').style.display = 'none';
        document.querySelector('.result-container').style.display = 'block';
    }, 500);
}

function processResults(results) {
    // Calcular percentuais baseados no score
    const score = results.totalScore || 0;
    const maxScore = 60; // -60 a +60

    // Converter score para percentual (0-100)
    // Score -60 = 0% (Extrema Esquerda)
    // Score 0 = 50% (Centro)
    // Score +60 = 100% (Extrema Direita)
    const leftRightPercent = ((score + maxScore) / (maxScore * 2)) * 100;

    // Outros espectros (baseados no principal com variação aleatória)
    results.spectrumPercentages = {
        leftRight: leftRightPercent,
        nationalistGlobalist: 30 + (Math.random() * 40), // 30-70%
        capitalistSocialist: leftRightPercent + (Math.random() * 20 - 10), // Base + variação
        liberalConservative: 50 + (Math.random() * 40 - 20), // 30-70%
        authoritarianLibertarian: 40 + (Math.random() * 40) // 40-80%
    };

    // Determinar posição principal se não tiver
    if (!results.position) {
        results.position = getPositionByScore(score);
    }

    // Adicionar descrição
    results.description = getDescriptionByPosition(results.position);
}

function getPositionByScore(score) {
    if (score < -40) return "Esquerda Radical";
    if (score < -15) return "Esquerda";
    if (score < -5) return "Centro-Esquerda";
    if (score < 5) return "Centro";
    if (score < 15) return "Centro-Direita";
    if (score < 40) return "Direita";
    return "Direita Conservadora";
}

function getDescriptionByPosition(position) {
    const descriptions = {
        "Esquerda Radical": "Defende transformações profundas na sociedade, com forte intervenção estatal e ênfase em igualdade social.",
        "Esquerda": "Apoia políticas sociais, estado de bem-estar social e regulamentação econômica.",
        "Centro-Esquerda": "Busca equilíbrio entre mercado e estado, com foco em justiça social.",
        "Centro": "Posicionamento pragmático, avaliando cada proposta individualmente sem ideologias fixas.",
        "Centro-Direita": "Valoriza liberdade econômica com alguma proteção social.",
        "Direita": "Defende livre mercado, menor intervenção estatal e valores tradicionais.",
        "Direita Conservadora": "Ênfase na liberdade econômica, soberania nacional e conservadorismo moral."
    };

    return descriptions[position] || "Perfil político único e complexo.";
}

function showResults(results) {
    console.log('Mostrando resultados:', results);

    // 1. Posição principal
    document.getElementById('resultTitle').textContent = results.position;
    document.getElementById('resultDescription').textContent = results.description;
    document.getElementById('scoreNumber').textContent = results.totalScore;

    // 2. Emoji baseado na posição
    const emojis = {
        "Esquerda Radical": "☭",
        "Esquerda": "🌹",
        "Centro-Esquerda": "⚖️",
        "Centro": "🎯",
        "Centro-Direita": "⚖️",
        "Direita": "🦅",
        "Direita Conservadora": "✝️"
    };
    document.getElementById('resultEmoji').textContent = emojis[results.position] || "🎯";

    // 3. Badge com cor
    const colors = {
        "Esquerda Radical": "#E74C3C",
        "Esquerda": "#E67E22",
        "Centro-Esquerda": "#F1C40F",
        "Centro": "#2ECC71",
        "Centro-Direita": "#3498DB",
        "Direita": "#9B59B6",
        "Direita Conservadora": "#2C3E50"
    };
    document.getElementById('resultBadge').innerHTML = `
        <span style="background: ${colors[results.position] || '#2ECC71'}; color: white; padding: 8px 20px; border-radius: 50px;">
            ${emojis[results.position] || "🎯"} ${results.position}
        </span>
    `;

    // 4. Atualizar espectros
    updateSpectrums(results.spectrumPercentages);

    // 5. Animar círculo de score
    animateScoreCircle(results.totalScore);

    // 6. Configurar candidatos
    setupCandidates(results.position);

    // 7. Configurar gráfico
    setupChart(results.spectrumPercentages);

    // 8. Configurar compartilhamento
    setupSharing(results);

    // 9. Iniciar animações
    startAnimations();
}

function updateSpectrums(percentages) {
    console.log('Atualizando espectros:', percentages);

    // Esquerda vs Direita
    updateSpectrumItem('spectrum', percentages.leftRight);
    document.getElementById('leftPercent').textContent = `${Math.round(100 - percentages.leftRight)}%`;
    document.getElementById('rightPercent').textContent = `${Math.round(percentages.leftRight)}%`;

    // Nacionalista vs Globalista
    updateSpectrumItem('nationalism', percentages.nationalistGlobalist);
    document.getElementById('nationalistPercent').textContent = `${Math.round(100 - percentages.nationalistGlobalist)}%`;
    document.getElementById('globalistPercent').textContent = `${Math.round(percentages.nationalistGlobalist)}%`;

    // Capitalista vs Socialista
    updateSpectrumItem('capitalism', percentages.capitalistSocialist);
    document.getElementById('capitalistPercent').textContent = `${Math.round(100 - percentages.capitalistSocialist)}%`;
    document.getElementById('socialistPercent').textContent = `${Math.round(percentages.capitalistSocialist)}%`;

    // Liberal vs Conservador
    updateSpectrumItem('values', percentages.liberalConservative);
    document.getElementById('liberalPercent').textContent = `${Math.round(100 - percentages.liberalConservative)}%`;
    document.getElementById('conservativePercent').textContent = `${Math.round(percentages.liberalConservative)}%`;

    // Autoritário vs Libertário
    updateSpectrumItem('freedom', percentages.authoritarianLibertarian);
    document.getElementById('authoritarianPercent').textContent = `${Math.round(100 - percentages.authoritarianLibertarian)}%`;
    document.getElementById('libertarianPercent').textContent = `${Math.round(percentages.authoritarianLibertarian)}%`;
}

function updateSpectrumItem(type, percentage) {
    const fill = document.getElementById(`${type}Fill`);
    const marker = document.getElementById(`${type}Marker`);

    if (fill && marker) {
        // Definir largura da barra
        fill.style.setProperty('--target-width', `${100 - percentage}%`);

        // Animar marcador após delay
        setTimeout(() => {
            marker.style.left = `${percentage}%`;

            // Emoji do marcador
            let emoji = '🎯';
            if (type === 'spectrum') {
                if (percentage < 30) emoji = '👈';
                else if (percentage > 70) emoji = '👉';
            } else if (type === 'nationalism') {
                if (percentage < 30) emoji = '🇧🇷';
                else if (percentage > 70) emoji = '🌍';
            } else if (type === 'capitalism') {
                if (percentage < 30) emoji = '🏭';
                else if (percentage > 70) emoji = '⚖️';
            } else if (type === 'values') {
                if (percentage < 30) emoji = '🌈';
                else if (percentage > 70) emoji = '⛪';
            } else if (type === 'freedom') {
                if (percentage < 30) emoji = '🏛️';
                else if (percentage > 70) emoji = '🗽';
            }

            marker.innerHTML = `<span>${emoji}</span>`;
        }, 300);
    }
}

function animateScoreCircle(score) {
    const circle = document.getElementById('scoreCircle');
    if (!circle) return;

    const percentage = ((score + 60) / 120) * 100; // Converter -60/+60 para 0-100%
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}

function setupCandidates(position) {
    const grid = document.getElementById('candidatesGrid');
    if (!grid) return;

    // Candidatos baseados na posição
    const candidates = {
        "Esquerda Radical": [
            { name: "Guilherme Boulos", party: "PSOL", emoji: "👨🏼", match: "85%" },
            { name: "Lula", party: "PT", emoji: "👨🏾", match: "75%" }
        ],
        "Esquerda": [
            { name: "Lula", party: "PT", emoji: "👨🏾", match: "90%" },
            { name: "Ciro Gomes", party: "PDT", emoji: "👨🏽", match: "70%" }
        ],
        "Centro-Esquerda": [
            { name: "Ciro Gomes", party: "PDT", emoji: "👨🏽", match: "80%" },
            { name: "Simone Tebet", party: "MDB", emoji: "👩", match: "75%" }
        ],
        "Centro": [
            { name: "Simone Tebet", party: "MDB", emoji: "👩", match: "85%" },
            { name: "Marina Silva", party: "REDE", emoji: "👩🏾", match: "75%" }
        ],
        "Centro-Direita": [
            { name: "João Amoêdo", party: "NOVO", emoji: "👨🏻", match: "80%" },
            { name: "Bolsonaro", party: "PL", emoji: "👨", match: "65%" }
        ],
        "Direita": [
            { name: "Bolsonaro", party: "PL", emoji: "👨", match: "85%" },
            { name: "Tarcísio de Freitas", party: "Republicanos", emoji: "👨🏽", match: "75%" }
        ],
        "Direita Conservadora": [
            { name: "Bolsonaro", party: "PL", emoji: "👨", match: "90%" },
            { name: "Michele Bolsonaro", party: "PL", emoji: "👩", match: "80%" }
        ]
    };

    const positionCandidates = candidates[position] || candidates["Centro"];

    grid.innerHTML = '';
    positionCandidates.forEach((candidate, index) => {
        const card = document.createElement('div');
        card.className = `candidate-card ${index === 0 ? 'selected' : ''}`;
        card.onclick = () => alert(`${candidate.name} (${candidate.party})\n${candidate.match} de compatibilidade`);

        card.innerHTML = `
            <div class="candidate-emoji">${candidate.emoji}</div>
            <div class="candidate-name">${candidate.name}</div>
            <div class="candidate-match">${candidate.match} de compatibilidade</div>
            <div class="candidate-party">${candidate.party}</div>
        `;

        grid.appendChild(card);
    });
}

function setupChart(percentages) {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (window.resultChart) {
        window.resultChart.destroy();
    }

    window.resultChart = new Chart(ctx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['Econômico', 'Social', 'Diplomático', 'Segurança', 'Ambiental'],
            datasets: [{
                label: 'Seu Perfil',
                data: [
                    percentages.leftRight,
                    percentages.liberalConservative,
                    percentages.nationalistGlobalist,
                    percentages.authoritarianLibertarian,
                    50 // ambiental (fixo por enquanto)
                ],
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

function setupSharing(results) {
    // Texto para compartilhamento
    window.shareText = `Meu perfil político: ${results.position} (${results.totalScore} pontos)\n\nFaça você também: ${window.location.origin}`;
}

function startAnimations() {
    // Animar barras de progresso
    setTimeout(() => {
        document.querySelectorAll('.spectrum-fill').forEach(fill => {
            fill.style.animation = 'progressFill 1.5s ease-out forwards';
        });
    }, 500);

    // Animar marcadores
    setTimeout(() => {
        document.querySelectorAll('.spectrum-marker').forEach(marker => {
            marker.style.transition = 'left 1s ease-out';
        });
    }, 1000);
}

// Funções de compartilhamento
function shareOnWhatsApp() {
    const text = encodeURIComponent(window.shareText || "Descobri meu perfil político!");
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const text = encodeURIComponent(window.shareText || "Meu perfil político!");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function copyResultLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copiado!'))
        .catch(() => {
            // Fallback para navegadores antigos
            const input = document.createElement('input');
            input.value = window.location.href;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('Link copiado!');
        });
}

function openShareMenu() {
    const menu = document.getElementById('shareMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function showNoResultsError() {
    document.getElementById('resultLoader').innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 60px;">😕</div>
            <h2>Nenhum resultado encontrado</h2>
            <p>Parece que você ainda não fez o teste.</p>
            <div style="margin-top: 30px;">
                <button onclick="window.location.href='quiz.html'" 
                        style="padding: 15px 30px; background: #2E8B57; color: white; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin: 10px;">
                    🎯 Fazer Teste Agora
                </button>
                <button onclick="window.location.href='index.html'" 
                        style="padding: 15px 30px; background: #666; color: white; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin: 10px;">
                    🏠 Voltar ao Início
                </button>
            </div>
        </div>
    `;
}

// Expor funções globais
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.copyResultLink = copyResultLink;
window.openShareMenu = openShareMenu;