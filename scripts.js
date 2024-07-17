document.addEventListener('DOMContentLoaded', function() {
    const createQuizForm = document.getElementById('create-quiz-form');
    const quizList = document.getElementById('quiz-list');

    createQuizForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('quiz-title').value;
        const questions = Array.from(document.querySelectorAll('#questions .question')).map(q => ({
            question: q.children[0].value,
            options: [q.children[1].value, q.children[2].value, q.children[3].value, q.children[4].value],
            correct: q.children[5].value
        }));

        fetch('/create-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, questions })
        }).then(response => response.json()).then(data => {
            if (data.success) {
                alert('Quiz created successfully!');
                showHomePage();
            }
        });
    });

    fetch('/quizzes')
        .then(response => response.json())
        .then(data => {
            data.forEach(quiz => {
                const li = document.createElement('li');
                li.textContent = quiz.title;
                li.addEventListener('click', () => startQuiz(quiz));
                quizList.appendChild(li);
            });
        });
});

function showHomePage() {
    document.getElementById('home-page').classList.remove('hidden');
    document.getElementById('create-quiz-page').classList.add('hidden');
    document.getElementById('take-quiz-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('results-page').classList.add('hidden');
}

function showCreateQuizPage() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('create-quiz-page').classList.remove('hidden');
}

function showTakeQuizPage() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('take-quiz-page').classList.remove('hidden');
}

function addQuestion() {
    const questionTemplate = `
        <div class="question">
            <input type="text" placeholder="Question" required>
            <input type="text" placeholder="Option 1" required>
            <input type="text" placeholder="Option 2" required>
            <input type="text" placeholder="Option 3" required>
            <input type="text" placeholder="Option 4" required>
            <input type="text" placeholder="Correct Answer" required>
        </div>
    `;
    document.getElementById('questions').insertAdjacentHTML('beforeend', questionTemplate);
}

function startQuiz(quiz) {
    document.getElementById('take-quiz-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    document.getElementById('quiz-title-display').textContent = quiz.title;

    const quizQuestions = document.getElementById('quiz-questions');
    quizQuestions.innerHTML = '';

    quiz.questions.forEach((q, index) => {
        const questionElement = `
            <div class="question" data-index="${index}">
                <p>${q.question}</p>
                ${q.options.map((opt, i) => `<label><input type="radio" name="question-${index}" value="${opt}"> ${opt}</label>`).join('<br>')}
            </div>
        `;
        quizQuestions.insertAdjacentHTML('beforeend', questionElement);
    });
}

function submitQuiz() {
    const questions = document.querySelectorAll('#quiz-questions .question');
    let score = 0;
    let total = questions.length;
    let results = [];

    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        const correctAnswer = quiz.questions[index].correct;

        if (selectedOption && selectedOption.value === correctAnswer) {
            score++;
        }

        results.push({
            question: quiz.questions[index].question,
            selected: selectedOption ? selectedOption.value : 'No answer',
            correct: correctAnswer
        });
    });

    displayResults(score, total, results);
}

function displayResults(score, total, results) {
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('results-page').classList.remove('hidden');

    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = `
        <p>Your score: ${score} out of ${total}</p>
        <ul>
            ${results.map(result => `
                <li>
                    <p>Question: ${result.question}</p>
                    <p>Your answer: ${result.selected}</p>
                    <p>Correct answer: ${result.correct}</p>
                </li>
            `).join('')}
        </ul>
    `;
}
