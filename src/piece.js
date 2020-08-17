/**
 * Checks the board to see if the space is clear
 */

class Piece {
	constructor(player, location) {
		this.player = player;
		this.name = "";
		this.imgURL = null;
		this.location = location;
		this.checkBoard = (board, space, validSpaces) => {
			const row = space[0];
			const col = space[1];

			//check if it is out of limits
			if (row < 0 || row > 7 || col < 0 || col > 7) return;

			const piece = board[row][col];

			//check if there no piece in the space
			if (!piece) {
				validSpaces.push(space);
				return true;
			}
			// there is an attackable piece
			if (piece && piece.player !== this.player) {
				validSpaces.push(space);
				return false;
			}

			return false;
		};
	}
}

class King extends Piece {
	constructor(player, location) {
		super(player, location);
		this.name = "Ki";
		this.imgURL = this.player ? "img/kl.png" : "img/kd.png";
		this.getValidSpaces = (board) => {
			const row = this.location[0];
			const col = this.location[1];

			let validSpaces = [];

			for (let r = -1; r < 2; r++) {
				for (let c = -1; c < 2; c++) {
					if (c === 0 && r === 0) continue;
					this.checkBoard(board, [row + r, col + c], validSpaces);
				}
			}

			return validSpaces;
		};
	}
}

class Queen extends Piece {
	constructor(player, location) {
		super(player, location);
		this.name = "Q";
		this.imgURL = this.player ? "img/ql.png" : "img/qd.png";
		this.getValidSpaces = (board) => {
			const row = this.location[0];
			const col = this.location[1];

			let validSpaces = [];

			for (let r = -1; r < 2; r++) {
				for (let c = -1; c < 2; c++) {
					if (c === 0 && r === 0) continue;
					for (let i = 1; i < 9; i++) {
						if (
							!this.checkBoard(board, [i * r + row, i * c + col], validSpaces)
						)
							break;
					}
				}
			}

			return validSpaces;
		};
	}
}

class Rook extends Piece {
	constructor(player, location) {
		super(player, location);
		this.name = "R";
		this.imgURL = this.player ? "img/rl.png" : "img/rd.png";
		this.getValidSpaces = (board) => {
			const row = this.location[0];
			const col = this.location[1];

			let validSpaces = [];

			[-1, 1].forEach((i) => {
				for (let j = 1; j < 9; j++)
					if (!this.checkBoard(board, [j * i + row, col], validSpaces)) break;

				for (let j = 1; j < 9; j++)
					if (!this.checkBoard(board, [row, j * i + col], validSpaces)) break;
			});

			return validSpaces;
		};
	}
}

class Bishop extends Piece {
	constructor(player, location) {
		super(player, location);
		this.name = "B";
		this.imgURL = this.player ? "img/bl.png" : "img/bd.png";
		this.getValidSpaces = (board) => {
			const row = this.location[0];
			const col = this.location[1];

			let validSpaces = [];

			[-1, 1].forEach((i) => {
				for (let j = 1; j < 9; j++)
					if (!this.checkBoard(board, [j * i + row, j * i + col], validSpaces))
						break;

				for (let j = 1; j < 9; j++)
					if (!this.checkBoard(board, [j * i + row, j * -i + col], validSpaces))
						break;
			});

			return validSpaces;
		};
	}
}

class Knight extends Piece {
	constructor(player, location) {
		super(player, location);
		this.name = "Kn";
		this.imgURL = this.player ? "img/nl.png" : "img/nd.png";
		this.getValidSpaces = (board) => {
			const row = this.location[0];
			const col = this.location[1];
			let validSpaces = [];

			[-2, 2].forEach((i) => {
				this.checkBoard(board, [row + i, col + 1], validSpaces);
				this.checkBoard(board, [row + i, col - 1], validSpaces);

				this.checkBoard(board, [row + 1, col + i], validSpaces);
				this.checkBoard(board, [row - 1, col + i], validSpaces);
			});

			return validSpaces;
		};
	}
}

class Pawn extends Piece {
	constructor(player, location) {
		super(player, location);
		this.name = "P";
		this.imgURL = this.player ? "img/pl.png" : "img/pd.png";
		this.firstMove = true;
		this.getValidSpaces = (board) => {
			const row = this.location[0];
			const col = this.location[1];

			let validSpaces = [];
			let direction;
			if (this.player) direction = -1;
			else direction = 1;

			// check moving forward
			let end = 1;
			if (this.firstMove) end = 2;

			for (let i = 1; i <= end; i++) {
				//check if the square has someone on it already
				if (board[direction * i + row][col]) break;
				if (!this.checkBoard(board, [direction * i + row, col], validSpaces))
					break;
			}

			//check attacking moves
			[-1, 1].forEach((c) => {
				const piece = board[row + direction][col + c];
				if (piece && piece.player !== this.player)
					validSpaces.push([row + direction, col + c]);
			});
			return validSpaces;
		};
	}
}

module.exports = { King, Queen, Rook, Bishop, Knight, Pawn };
