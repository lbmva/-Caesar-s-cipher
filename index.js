
const InputText = document.getElementById('Text');
const InputKey = document.getElementById('Key');
const Start = document.getElementById('Start');
const EncriptText = document.getElementById('EncriptText');
const DecriptText = document.getElementById('DecriptText');
const DecipherText = document.getElementById('DecipherText');

class Caesar {
  static #alphabet = 'abcdefghijklmnopqrstuvwxyz';
  static #uppercaseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 

  static closeAll = () => {

  }


   static Start = (text, shift) => {
    // Шифрование
    let encripted = '';
    if (shift > this.#alphabet.length) shift = this.#alphabet.length;
    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      if (this.#alphabet.includes(letter) || this.#uppercaseAlphabet.includes(letter)) {
        encripted += this.#ShiftLetter(letter, shift);
      } else {
        encripted += letter;
      }
    }

    // расшифрование
    let decripted = ''
    for (let i = 0; i < encripted.length; i++) {
      const letter = encripted[i];
      if (this.#alphabet.includes(letter) || this.#uppercaseAlphabet.includes(letter)) {
        decripted += this.#ShiftLetter(letter, -shift);
      } else {
        decripted += letter;
      }
    }

    // пытаемся взломать
    const popularSymbols = ['e', 't', 'a', 'o', 'i', 'n', 's'];
    const variants = []
    for (const symbol of popularSymbols) {
      variants.push(this.#GetCipherVariant(text, symbol));
    }

    return { encripted, decripted, variants };
  }

  static #GetCipherVariant = (text, symbol) => {
    const frequency = new Array(26).fill(0);
    const alphabet = this.#alphabet; 
  
    for (let i = 0; i < text.length; i++) {
      const letter = text[i].toLowerCase();
      if (alphabet.includes(letter)) {
        frequency[letter.charCodeAt(0) - 'a'.charCodeAt(0)]++;
      }
    }
  
    let maxFrequency = 0;
    let maxIndex = 0;
  
    for (let i = 0; i < frequency.length; i++) {
      if (frequency[i] > maxFrequency) {
        maxFrequency = frequency[i];
        maxIndex = i;
      }
    }
  
    const key = maxIndex - (symbol.charCodeAt(0) - 'a'.charCodeAt(0));
  
    let decryptedText = '';
    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      const isUpperCase = letter === letter.toUpperCase();
      const lowerLetter = letter.toLowerCase();
      if (alphabet.includes(lowerLetter)) {
        let decryptedLetter = lowerLetter.charCodeAt(0) - key - 'a'.charCodeAt(0);
        if (decryptedLetter < 0) {
          decryptedLetter += 26;
        }

        decryptedLetter = (decryptedLetter % alphabet.length) + 'a'.charCodeAt(0);
        decryptedLetter = String.fromCharCode(decryptedLetter);
        if (isUpperCase) decryptedLetter = decryptedLetter.toUpperCase()

        decryptedText += decryptedLetter;
      } else {
        decryptedText += letter;
      }
    }

    return decryptedText;
  }
  

  static #ShiftLetter = (letter, shiftAmount) => {
    const isUpperCase = letter === letter.toUpperCase();
    const alphabet = isUpperCase ? this.#uppercaseAlphabet : this.#alphabet;
    const letterIndex = alphabet.indexOf(letter);
  
    let shiftedIndex = (letterIndex + shiftAmount) % alphabet.length;
    if (shiftedIndex < 0) shiftedIndex = alphabet.length + shiftedIndex;
    let shiftedLetter = alphabet.charAt(shiftedIndex);
  
    if (!isUpperCase) {
      shiftedLetter = shiftedLetter.toLowerCase();
    }
  
    return shiftedLetter;
  }
}

Start.addEventListener('click', () => {
  const textValue = InputText.value;
  const { encripted, decripted, variants } = Caesar.Start(textValue, parseInt(InputKey.value));
  EncriptText.innerHTML = encripted;
  DecriptText.innerHTML = decripted;
  DecipherText.innerHTML = '';
  variants.forEach((variant, i) => {
    const isRight = variant === textValue;
    DecipherText.innerHTML += `
      <p class="${isRight ? 'right' : ''}">
        Вариант ${i + 1}: ${variant} ${isRight ? '- Правильный вариант' : ''}
      </p>
      <br/>
    `;
  })
});


InputKey.addEventListener('input', function () {
  InputKey.value = InputKey.value.replace(/\D/g, '');
});

InputText.addEventListener('input', function () {
  InputText.value = InputText.value.replace(/[^a-zA-Z\s,.\-]/g, '');
});
