function diagonalDifference(matrix) {
    let ans = matrix[0][0] - matrix[0][matrix.length-1];
    for (let i=1; i<matrix.length; i++) {
        const value = matrix[i][i] - matrix[i][matrix.length-i-1]
        ans = ans + value
    }
    return Math.abs(ans)
}


const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
const result = diagonalDifference(matrix);
console.log(result);
