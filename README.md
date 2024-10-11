# amountformat

### Usage example
```
<input type="text" step="0.01" class="number-format" id="amount" name="amount" value="" >

if (contractAmountInput) {
	setupNumberFormatting(contractAmountInput);
}

// To apply to multiple inputs
document.querySelectorAll('.number-format').forEach(setupNumberFormatting);
```
