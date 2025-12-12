// quiz.js - VERSÃO SIMPLIFICADA E FUNCIONAL
console.log('Quiz carregado!');

// Perguntas simplificadas
const QUESTIONS = [
    "O governo deve fornecer saúde pública gratuita?",
    "Impostos sobre ricos devem aumentar?",
    "Porte de armas deve ser liberado?",
    "Aborto deve ser legalizado?",
    "Empresas estatais devem ser privatizadas?",
    "Cotas raciais são necessárias?",
    "Reforma da previdência foi necessária?",
    "Brasil deve priorizar países ocidentais?",
    "Maioridade penal deve ser reduzida?",
    "Estado deve intervir menos na economia?",
    "Maconha deve ser legalizada?",
    "Ensino religioso deve ter nas escolas?",
    "Serviço militar deve ser obrigatório?",
    "Sindicatos têm muito poder?",
    "União estável homoafetiva deve ser legal?",
    "Pena de morte deve ser implantada?",
    "Mídia deve ser mais regulada?",
    "Brasil deve sair da ONU?",
    "Escola sem Partido é necessária?",
    "Homeschooling deve ser permitido?",
    "Empresários devem financiar campanhas?",
    "Voto eletrônico é seguro?",
    "Foro privilegiado deve acabar?",
    "Governo deve controlar preços?",
    "Latifúndio deve ser desapropriado?",
    "Royalties do petróleo devem ir para educação?",
    "Pesquisa com células-tronco deve ser liberada?",
    "Copa do Mundo foi boa para o Brasil?",
    "Dilma sofreu impeachment justo?",
    "Lula é inocente?"
];

// Respostas possíveis
const ANSWERS = [
    { value: -2, label: "Discordo Totalmente", emoji: "👎" },
    { value: -1, label: "Discordo Parcialmente", emoji: "↘️" },
    { value: 0, label: "Neutro", emoji: "➖" },
    { value: 1, label: "Concordo Parcialmente", emoji: "↗️" },
    { value: 2, label: "Concordo Totalmente", emoji: "👍" }
];

// Estado do quiz
let currentQuestion = 0;
let userAnswers = new Array(QUESTIONS.length).fill(null);
let quizStarted = false;

// Inicializar
function initQuiz() {
    console.log('Iniciando quiz...');

    // Carregar progresso salvo
    loadProgress();

    // Mostrar primeira pergunta
    showQuestion(currentQuestion);

    // Configurar botões
    setupButtons();

    // Esconder loader
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 500);

    quizStarted = true;
}

// Mostrar pergunta
function showQuestion(index) {
    if (index < 0 || index >= QUESTIONS.length) return;

    currentQuestion = index;

    // Atualizar texto da pergunta
    document.getElementById('questionText').textContent = QUESTIONS[index];
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('progressText').textContent = `Pergunta ${index + 1} de ${QUESTIONS.length}`;

    // Atualizar barra de progresso
    const progressPercent = ((index + 1) / QUESTIONS.length) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;

    // Atualizar contador de respondidas
    const answered = userAnswers.filter(a => a !== null).length;
    document.getElementById('answeredCount').textContent = answered;

    // Atualizar botões de navegação
    updateNavigationButtons();

    // Destacar resposta selecionada
    highlightSelectedAnswer();
}

// Configurar botões de resposta
function setupButtons() {
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';

    ANSWERS.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.innerHTML = `
            <span class="answer-emoji">${answer.emoji}</span>
            <span class="answer-label">${answer.label}</span>
        `;

        button.onclick = () => selectAnswer(answer.value);

        answersGrid.appendChild(button);
    });

    // Botões de navegação
    document.getElementById('prevBtn').onclick = prevQuestion;
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('skipBtn').onclick = skipQuestion;
}

// Selecionar resposta
function selectAnswer(value) {
    console.log(`Resposta selecionada: ${value} para pergunta ${currentQuestion}`);

    userAnswers[currentQuestion] = value;

    // Salvar progresso
    saveProgress();

    // Destacar resposta
    highlightSelectedAnswer();

    // Habilitar botão próximo
    document.getElementById('nextBtn').disabled = false;

    // Auto-avançar após 0.5 segundos (opcional)
    setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
            nextQuestion();
        }
    }, 500);
}

// Destacar resposta selecionada
function highlightSelectedAnswer() {
    // Remover destaque de todos
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Destacar se tiver resposta
    const answerValue = userAnswers[currentQuestion];
    if (answerValue !== null) {
        const answerIndex = ANSWERS.findIndex(a => a.value === answerValue);
        const buttons = document.querySelectorAll('.answer-btn');
        if (buttons[answerIndex]) {
            buttons[answerIndex].classList.add('selected');
        }
    }
}

// Navegação
function prevQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

function nextQuestion() {
    // Se não respondeu e não é a última, alerta
    if (userAnswers[currentQuestion] === null && currentQuestion < QUESTIONS.length - 1) {
        alert('Por favor, selecione uma resposta antes de continuar.');
        return;
    }

    if (currentQuestion < QUESTIONS.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        // ÚLTIMA PERGUNTA - IR PARA RESULTADO
        finishQuiz();
    }
}

function skipQuestion() {
    userAnswers[currentQuestion] = 0; // Neutro como skip
    saveProgress();

    if (currentQuestion < QUESTIONS.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        finishQuiz();
    }
}

function updateNavigationButtons() {
    // Botão anterior
    document.getElementById('prevBtn').disabled = currentQuestion === 0;

    // Botão próximo
    const hasAnswered = userAnswers[currentQuestion] !== null;
    const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

    document.getElementById('nextBtn').disabled = !hasAnswered && !isLastQuestion;
    document.getElementById('nextBtn').textContent = isLastQuestion ?
        'Ver Resultado →' : 'Próxima →';
}

// FINALIZAR QUIZ - VERSÃO SUPER SIMPLES QUE FUNCIONA
function finishQuiz() {
    console.log('Finalizando quiz...');

    // Calcular score simples
    let totalScore = 0;
    let answeredCount = 0;

    userAnswers.forEach(answer => {
        if (answer !== null) {
            totalScore += answer;
            answeredCount++;
        }
    });

    // Salvar dados SIMPLES no localStorage
    const results = {
        totalScore: totalScore,
        answeredCount: answeredCount,
        answers: userAnswers,
        timestamp: new Date().toISOString(),
        position: getPositionByScore(totalScore)
    };

    console.log('Resultados calculados:', results);

    // Salvar de DUAS formas (garantido)
    localStorage.setItem('quizResults', JSON.stringify(results));
    localStorage.setItem('quizScore', totalScore.toString());
    localStorage.setItem('quizPosition', results.position);

    // DEBUG: Verificar se salvou
    console.log('localStorage após salvar:');
    console.log('- quizResults:', localStorage.getItem('quizResults'));
    console.log('- quizScore:', localStorage.getItem('quizScore'));

    // Redirecionar para resultado
    window.location.href = 'result.html';
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

// Persistência
function saveProgress() {
    const progress = {
        currentQuestion: currentQuestion,
        answers: userAnswers,
        timestamp: Date.now()
    };

    localStorage.setItem('quizProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('quizProgress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);

            // Verificar se não é muito antigo (1 hora)
            if (Date.now() - progress.timestamp < 60 * 60 * 1000) {
                currentQuestion = progress.currentQuestion || 0;
                userAnswers = progress.answers || new Array(QUESTIONS.length).fill(null);

                // Perguntar se quer continuar
                const answered = userAnswers.filter(a => a !== null).length;
                if (answered > 0) {
                    if (confirm(`Encontramos um teste com ${answered} respostas. Deseja continuar?`)) {
                        return true;
                    }
                }
            }
        } catch (e) {
            console.error('Erro ao carregar progresso:', e);
        }
    }

    // Resetar
    currentQuestion = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);
    return false;
}

// Funções UI extras
function resetQuiz() {
    if (confirm('Tem certeza que deseja reiniciar o teste? Todo o progresso será perdido.')) {
        localStorage.removeItem('quizProgress');
        localStorage.removeItem('quizResults');
        localStorage.removeItem('quizScore');

        currentQuestion = 0;
        userAnswers = new Array(QUESTIONS.length).fill(null);
        showQuestion(0);
    }
}

function pauseQuiz() {
    document.getElementById('pauseModal').style.display = 'flex';
}

function resumeQuiz() {
    document.getElementById('pauseModal').style.display = 'none';
}

// Expor funções globais
window.resetQuiz = resetQuiz;
window.pauseQuiz = pauseQuiz;
window.resumeQuiz = resumeQuiz;
window.showExplanation = function () {
    alert('Escolha uma opção de acordo com seu grau de concordância com a afirmação.');
};

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', initQuiz);