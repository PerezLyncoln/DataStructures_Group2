// DOM elements
const form = document.getElementById('calculatorForm');
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const operationInput = document.getElementById('operation');
const previousOperandDisplay = document.querySelector('.previous-operand');
const currentOperandDisplay = document.querySelector('.current-operand');
const numberButtons = document.querySelectorAll('.number-btn');
const operationButtons = document.querySelectorAll('.op-btn');
const equalsButton = document.querySelector('.equals-btn');
const clearButton = document.querySelector('.clear-btn');
const clearEntryButton = document.querySelector('.clear-entry-btn');
const backspaceButton = document.querySelector('.backspace-btn');
const decimalButton = document.querySelector('.decimal-btn');

// API endpoint
const API_URL = 'http://localhost:8080/api/calculate';

// Calculator state
let firstNumber = null;
let operation = null;
let shouldResetDisplay = false;

// Function to append number or decimal
function appendNumber(value) {
    if (shouldResetDisplay) {
        currentOperandDisplay.textContent = '';
        shouldResetDisplay = false;
    }
    if (value === '.' && currentOperandDisplay.textContent.includes('.')) return;
    if (currentOperandDisplay.textContent === '0' && value !== '.') {
        currentOperandDisplay.textContent = value;
    } else {
        currentOperandDisplay.textContent += value;
    }
}

// Number button handlers
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.dataset.number);
    });
});

// Decimal button handler
decimalButton.addEventListener('click', () => {
    appendNumber('.');
});

// Operation button handlers
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (firstNumber === null) {
            firstNumber = parseFloat(currentOperandDisplay.textContent);
            operation = button.dataset.operation;
            previousOperandDisplay.textContent = `${formatNumber(firstNumber)} ${getOperationSymbol(operation)}`;
            shouldResetDisplay = true;
        } else {
            const secondNumber = parseFloat(currentOperandDisplay.textContent);
            calculateResult(firstNumber, operation, secondNumber);
            operation = button.dataset.operation;
            previousOperandDisplay.textContent = `${formatNumber(firstNumber)} ${getOperationSymbol(operation)}`;
            shouldResetDisplay = true;
        }
        operationButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Equals button handler
equalsButton.addEventListener('click', async () => {
    if (firstNumber === null || operation === null) return;
    
    const secondNumber = parseFloat(currentOperandDisplay.textContent);
    calculateResult(firstNumber, operation, secondNumber);
    previousOperandDisplay.textContent = '';
    operation = null;
    shouldResetDisplay = true;
});
    
// Clear button handler
clearButton.addEventListener('click', () => {
    currentOperandDisplay.textContent = '0';
    previousOperandDisplay.textContent = '';
    firstNumber = null;
    operation = null;
    operationButtons.forEach(btn => btn.classList.remove('active'));
});

// Clear entry button handler
clearEntryButton.addEventListener('click', () => {
    currentOperandDisplay.textContent = '0';
});

// Backspace button handler
backspaceButton.addEventListener('click', () => {
    if (currentOperandDisplay.textContent.length === 1) {
        currentOperandDisplay.textContent = '0';
    } else {
        currentOperandDisplay.textContent = currentOperandDisplay.textContent.slice(0, -1);
    }
});

// Helper function to get operation symbol
function getOperationSymbol(op) {
    switch(op) {
        case 'add': return '+';
        case 'subtract': return '−';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

// Calculate result
async function calculateResult(num1, operation, num2) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `num1=${num1}&operation=${operation}&num2=${num2}`
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        firstNumber = data.result;
        currentOperandDisplay.textContent = formatNumber(data.result);

    } catch (error) {
        console.error('Error:', error);
        showError(`Error: ${error.message}`);
        currentOperandDisplay.textContent = 'Error';
        firstNumber = null;
        operation = null;
        previousOperandDisplay.textContent = '';
    }
}

// Format number for display
function formatNumber(num) {
    if (isNaN(num)) return 'Error';
    
    // Handle division by zero
    if (!isFinite(num)) return 'Cannot divide by zero';
    
    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6);
    }
    
    // Handle regular numbers
    if (Number.isInteger(num) && Math.abs(num) < 1e12) {
        return num.toLocaleString();
    }
    
    // Handle decimals
    return parseFloat(num.toPrecision(10)).toLocaleString();
}

// Format number for display
function formatNumber(num) {
    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6);
    }
    
    // Handle regular numbers
    if (Number.isInteger(num) && Math.abs(num) < 1e12) {
        return num.toString();
    }
    
    // Handle decimals
    return parseFloat(num.toPrecision(10)).toString();
}

// Show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(hideError, 5000);
}

// Hide error message
function hideError() {
    errorDiv.style.display = 'none';
}

// Input validation and formatting
num1Input.addEventListener('input', validateInput);
num2Input.addEventListener('input', validateInput);

function validateInput(e) {
    // Remove any invalid characters (basic validation)
    const value = e.target.value;
    const validValue = value.replace(/[^0-9.-]/g, '');
    
    if (value !== validValue) {
        e.target.value = validValue;
    }
}

// Handle Enter key in inputs
num1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        num2Input.focus();
    }
});

num2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});

// Clear result when inputs change
num1Input.addEventListener('input', clearResult);
num2Input.addEventListener('input', clearResult);

function clearResult() {
    if (resultValue.textContent !== '-') {
        resultValue.textContent = '-';
        hideError();
    }
}

// Initialize - focus on first input
window.addEventListener('load', () => {
    num1Input.focus();
});

// Handle connection errors gracefully
window.addEventListener('beforeunload', () => {
    // Cancel any pending requests if needed
});

console.log('C++ Calculator Frontend Loaded');
console.log('Backend should be running on http://localhost:8080');