// TODO 
// solve it lol
// reset original (user input, in case user made a mistake) 
// add borders
// speed boosts: 
//	- solve_sudoku(sodokuField, row, col) where everything before row,col is filled in already

// sudoku has 9 3x3 subFields. In every subfield, the numbers 1-9 should occur strictly once.
//	fields are ordered [[0,1,2],[3,4,5],[6,7,8]] (from left to right and up to down)
// sudoku has 9 1x9 rows. In every row, the numbers 1-9 should occur strictly once.
// sudoku has 9 1x9 cols. In every col, the numbers 1-9 should occur strictly once.

var OPTIONS = Object.freeze(new Set([1,2,3,4,5,6,7,8,9]));

function main(){
	var sudokuField = fetch_sudoku();
	console.log(solve_sudoku(sudokuField));
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
	// if only 1 candidate: fill in candidate
	// if candidate can only go in one spot: fill in candidate
	if (row == col == 8) { // sudoku solved (should be 9 though)
		return sudokuField;
	}
	for (var i = row; i < 9 ; i++) {
		var row_candidates = rowCandidates(sudokuField, i); // same for every col in this row anyways
		if (row_candidates.size == 0){
			continue; // do next row, this one is already done
		}
		for (var j = 0; j < 9; j++) {
			if (!sudokuField[i][j]) { // filled in? 1-9 evaluate to true, NaN to false
				var field_candidates = fieldCandidates(sudokuField, Math.floor(i/3)*3+Math.floor(j/3)); // element (i,j) is in 3x3 subfield fl(i/3)*3+fl(j/3) 
				var col_candidates = colCandidates(sudokuField, j); 
				var candidates = intersection3(row_candidates, field_candidates, col_candidates); 
				if (candidates.size == 0) {
					return false;
				}
				for (let candidate of candidates) {
					var new_sudokuFied = JSON.parse(JSON.stringify(sudokuField)); // deep copy
					new_sudokuFied[i][j] = candidate; 
					var solution = solve_sudoku(new_sudokuFied, i, j);
					if (solution) {
						console.log("yay! solution!");
						return solution;
					}
				}
			}	
		}
	}	
}

function isSolved(sudokuField) {
	// if every row contains every element, sudoku is solved.
	// If user inputs false sudoku, this doesnt work, otherwise its fine
	for (var i = 0; i < 9; i++) {
		if (intersection(new Set(sudokuField[i]), OPTIONS).size != 9) {
			return false;
		}
	}
	return true;
}

function fieldCandidates(sudokuField, subfield_index){
	// returns the remaining numbers for a 3x3 subfield (that are not yet filled in)
	var subFieldArray = [];
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			subFieldArray.push(sudokuField[Math.floor(subfield_index/3)*3+i][Math.floor(subfield_index%3)*3+j]);
		}
	}
	// var subField = new Set([for (i of [0,1,2]) for (j of [0,1,2]) sudokuField[Math.floor(subfield_index/3)*3+i][Math.floor(subfield_index%3)*3+j]]);
	var subField = new Set(subFieldArray);
	return difference(OPTIONS, subField);
}

function rowCandidates(sudokuField, row_index){
	// returns the remaining numbers for a row (that are not yet filled in)
	var row = new Set(sudokuField[row_index]);
	return difference(OPTIONS, row);
}

function colCandidates(sudokuField, col_index){
	// returns the remaining numbers for a column (that are not yet filled in)
	var colArray = [];
	for (var i = 0; i < 9; i++) {
		colArray.push(sudokuField[i][col_index]);
	}
	var col = new Set(colArray);
	//var col = new Set([for (i of [0,1,2,3,4,5,6,7,8]) sudokuField[i][col_index]]);
	return difference(OPTIONS, col); 
}

function difference(setA, setB){
	// returns setA \ setB. Order matters!
	return new Set([...setA].filter(x => !setB.has(x)));
}

function intersection(setA, setB){
	// returns setA ∩ setB 
	return new Set([...setA].filter(x => setB.has(x)));
}

function intersection3(setA, setB, setC){
	// returns setA ∩ setB ∩ setC
	return intersection(setA, intersection(setB, setC));
}


