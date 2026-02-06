let display = document.getElementById('display');
let expressionDisplay = document.getElementById('expression');
let currentValue = '0';
let previousValue = null;
let operation = null;
let shouldResetDisplay = false;

function updateDisplay() {
    // Format display to show up to 9 digits
    let displayValue = currentValue;
    if (displayValue.length > 9) {
        displayValue = parseFloat(displayValue).toExponential(5);
    }
    display.textContent = displayValue;
    
    // Update expression display
    if (previousValue !== null && operation !== null) {
        let opSymbol = operation;
        if (operation === '*') opSymbol = '×';
        if (operation === '/') opSymbol = '÷';
        if (operation === '-') opSymbol = '−';
        expressionDisplay.textContent = `${previousValue} ${opSymbol}`;
    } else {
        expressionDisplay.textContent = '';
    }
}

function clearDisplay() {
    currentValue = '0';
    previousValue = null;
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function toggleSign() {
    if (currentValue !== '0') {
        if (currentValue.startsWith('-')) {
            currentValue = currentValue.substring(1);
        } else {
            currentValue = '-' + currentValue;
        }
        updateDisplay();
    }
}

function percentage() {
    currentValue = (parseFloat(currentValue) / 100).toString();
    updateDisplay();
}

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentValue = num;
        shouldResetDisplay = false;
    } else {
        if (currentValue === '0' && num !== '.') {
            currentValue = num;
        } else if (num === '.' && currentValue.includes('.')) {
            return;
        } else if (currentValue.length < 9) {
            currentValue += num;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operation !== null && !shouldResetDisplay) {
        calculate();
    }
    previousValue = currentValue;
    operation = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (operation === null || previousValue === null) {
        return;
    }

    let prev = parseFloat(previousValue);
    let current = parseFloat(currentValue);
    let result;
    
    // Show full expression before calculating
    let opSymbol = operation;
    if (operation === '*') opSymbol = '×';
    if (operation === '/') opSymbol = '÷';
    if (operation === '-') opSymbol = '−';
    expressionDisplay.textContent = `${previousValue} ${opSymbol} ${currentValue}`;

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentValue = 'Error';
                operation = null;
                previousValue = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    currentValue = result.toString();
    operation = null;
    previousValue = null;
    shouldResetDisplay = true;
    display.textContent = currentValue;
}

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');
        themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        themeIcon.textContent = '🌙';
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendNumber('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clearDisplay();
    } else if (event.key === '%') {
        percentage();
    }
});