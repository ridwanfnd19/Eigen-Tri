function longest(sentence) {
    let longestWord = '';
    let currentWord = '';

    for (const char of sentence) {
        if (char === ' ') {
            if (currentWord.length > longestWord.length) {
                longestWord = currentWord;
            }
            currentWord = '';
        } else {
            currentWord += char;
        }
    }

    if (currentWord.length > longestWord.length) {
        longestWord = currentWord;
    }

    return longestWord;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
const longestWord = longest(sentence);
console.log(`${longestWord}: ${longestWord.length} character`);
