// TODO 
// reset original (user input, in case user made a mistake) 
// or work with 2 matrices (input --> output)
// add borders
// beautify
// clean up code (col vs column_index)
// reset button for users unaware of ctrl f5 (just erase all fields, one button for each matrix)

// sudoku has 9 3x3 subFields. In every subfield, the numbers 1-9 should occur strictly once.
//	fields are ordered [[0,1,2],[3,4,5],[6,7,8]] (from left to right and up to down)
// sudoku has 9 1x9 rows. In every row, the numbers 1-9 should occur strictly once.
// sudoku has 9 1x9 cols. In every col, the numbers 1-9 should occur strictly once.
// The sudoku is solved using backtracking.

var OPTIONS = Object.freeze([1,2,3,4,5,6,7,8,9]);

function main(){
	var sudokuField = fetch_sudoku();
	var solution = solve_sudoku(sudokuField);
	console.log(solution);
	output_solution(solution);
}

function fetch_sudoku() {
	var sudokuField = [];
	var intermediate_array = [];
	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			var identity = "field_" + String(row) + "_" + String(col);	
			intermediate_array.push(parseInt(document.getElementById(identity).value)); 
		}	
		sudokuField.push(intermediate_array);
		intermediate_array = [];
	}
	return(sudokuField);
}

function solve_sudoku(sudokuField, row=0, col=0){
	if (row == 9) { // sudoku solved 
		return sudokuField;
	}
	if (col == 9) {
		return solve_sudoku(sudokuField, row+1, 0); // start working on next row
	}
	if (sudokuField[row][col]){ // element already filled in
		return solve_sudoku(sudokuField, row, col+1);
	}
	for (var candidate = 1; candidate <= 9 ; candidate++) {
		if (isValidCandidate(sudokuField, candidate, row, col)) {
			var new_sudokuFied = JSON.parse(JSON.stringify(sudokuField)); // deep copy
			new_sudokuFied[row][col] = candidate; 
			var solution = solve_sudoku(new_sudokuFied, row, col+1); // advance to next col
			if (solution) {
				return solution;
			}
		}
	}
	return false;
}

function isValidCandidate(sudokuField, candidate, row, col){
	if (!isValidRowCandidate(sudokuField, candidate, row)){
		return false;
	}
	if (!isValidColCandidate(sudokuField, candidate, col)){
		return false;
	}
	if (!isValidFieldCandidate(sudokuField, candidate, row, col)){
		return false;
	}
	return true;
}

function isValidRowCandidate(sudokuField, candidate, row_index){
	return (sudokuField[row_index].indexOf(candidate) == -1);
}

function isValidColCandidate(sudokuField, candidate, col_index){
	for (var i = 0; i < 9; i++) {
		if (candidate == sudokuField[i][col_index]){
			return false;
		}
	}
	return true;
}

function isValidFieldCandidate(sudokuField, candidate, row, col){
	var row = Math.floor(row/3)*3; // change element to first element of field
	var col = Math.floor(col/3)*3;
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (candidate == sudokuField[row+i][col+j]){
				return false;
			}
		}
	}
	return true;
}

function output_solution(solution){
	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			var content = solution[row][col];
			var identity = "field_" + String(row) + "_" + String(col);
			document.getElementById(identity).value = content; 
		}	
	}
}
