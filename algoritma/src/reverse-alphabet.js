function reverseAlphabet(str) {
    const letters = str.match(/[A-Z]/g);
    const digits = str.match(/\d+/g);
    
    const reversedLetters = letters.reverse().join('');
    
    return reversedLetters + (digits ? digits.join('') : '');
}

const input = "NEGIE1";
const result = reverseAlphabet(input);
console.log(result);