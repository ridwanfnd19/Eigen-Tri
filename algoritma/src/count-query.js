function countQuery(INPUT, QUERY) {
    const frequencyMap = {};

    for (const item of INPUT) {
        frequencyMap[item] = (frequencyMap[item] || 0) + 1;
    }

    return QUERY.map(query => frequencyMap[query] || 0);
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
const output = countQuery(INPUT, QUERY);
console.log(output);
