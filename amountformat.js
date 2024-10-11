// Usage example:
// const contractAmountInput = document.getElementById('amount');
// if (amountInput) {
//     setupNumberFormatting(amountInput);
// }

// To apply to multiple inputs:
// document.querySelectorAll('.number-format').forEach(setupNumberFormatting);

function setupNumberFormatting(inputElement) {
    function formatNumber(value) {
        if (value === '') return '';
        
        let [integerPart, decimalPart] = value.split('.');
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        if (decimalPart !== undefined) {
            decimalPart = decimalPart.slice(0, 2);
            return `${integerPart}.${decimalPart}`;
        }
        return integerPart;
    }

    function parseLocaleNumber(stringNumber) {
        return parseFloat(stringNumber.replace(/,/g, ''));
    }
    
    function prepareForBackend() {
        if (inputElement.value === '' || inputElement.value === '0') {
            return '';
        }
        return parseLocaleNumber(inputElement.value).toFixed(2);
    }

    inputElement.form.addEventListener('submit', function(e) {
        let hiddenInput = inputElement.form.querySelector(`input[name="${inputElement.name}_backend"]`);
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `${inputElement.name}_backend`;
            inputElement.parentNode.appendChild(hiddenInput);
        }
        hiddenInput.value = prepareForBackend();
    });

    inputElement.addEventListener('input', function(e) {
        let cursorPos = this.selectionStart;
        let originalValue = this.value;
        let originalLength = originalValue.length;
        
        let isDeleting = e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward';

        let value = this.value.replace(/[^\d.]/g, '');
        
        let decimalPoints = (value.match(/\./g) || []).length;
        if (decimalPoints > 1) {
            value = value.replace(/\.(?=.*\.)/g, '');
        }
        
        let parts = value.split('.');
        if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join('.');
        }
        
        let formattedValue = formatNumber(value);
        
        this.value = formattedValue;
        
        if (isDeleting) {
            let commasBeforeCursor = (originalValue.slice(0, cursorPos).match(/,/g) || []).length;
            let newCommasBeforeCursor = (formattedValue.slice(0, cursorPos).match(/,/g) || []).length;
            cursorPos -= (commasBeforeCursor - newCommasBeforeCursor);
        } else {
            let newLength = formattedValue.length;
            let cursorOffset = newLength - originalLength;
            cursorPos += cursorOffset;
        }
        
        cursorPos = Math.max(0, Math.min(cursorPos, formattedValue.length));
        
        this.setSelectionRange(cursorPos, cursorPos);
    });

    inputElement.addEventListener('blur', function() {
        if (this.value === '' || this.value === '.') {
            this.value = '0';
        } else {
            let value = parseLocaleNumber(this.value);
            this.value = formatNumber(value.toFixed(2));
        }
    });

    inputElement.addEventListener('focus', function() {
        if (this.value === '0') {
            this.value = '';
        }
    });

    // Set initial value
    if (!inputElement.value) {
        inputElement.value = '';
    } else {
        inputElement.value = formatNumber(inputElement.value.replace(/,/g, ''));
    }
}