import React, { Component } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import Piece from "../piece";

const Styled = styled.div`
	.board {
		border: 5px solid;
	}

	.cell {
		width: 100px;
		height: 100px;
	}

	.black {
		background-color: olivedrab;
	}
	.white {
		background-color: darkseagreen;
	}
	.high {
		background-color: lightcoral;
	}
	.square {
		width: 50px;
		height: 50px;
		border: 1px solid black;
	}
`;

class Board extends Component {
	constructor() {
		//generate the style board
		super();
		this.state = {
			board: [
				[
					new Piece.Rook(0, [0, 0]),
					new Piece.Knight(0, [0, 1]),
					new Piece.Bishop(0, [0, 2]),
					new Piece.Queen(0, [0, 3]),
					new Piece.King(0, [0, 4]),
					new Piece.Bishop(0, [0, 5]),
					new Piece.Knight(0, [0, 6]),
					new Piece.Rook(0, [0, 7]),
				],
				[...Array(8).keys()].map((i) => new Piece.Pawn(0, [1, i])),

				new Array(8).fill(null),
				new Array(8).fill(null),
				new Array(8).fill(null),
				new Array(8).fill(null),

				[...Array(8).keys()].map((i) => new Piece.Pawn(1, [6, i])),
				[
					new Piece.Rook(1, [7, 0]),
					new Piece.Knight(1, [7, 1]),
					new Piece.Bishop(1, [7, 2]),
					new Piece.Queen(1, [7, 3]),
					new Piece.King(1, [7, 4]),
					new Piece.Bishop(1, [7, 5]),
					new Piece.Knight(1, [7, 6]),
					new Piece.Rook(1, [7, 7]),
				],
			],

			turn: 1,
			currentSelected: null,
			styleBoard: this.generateStyleBoard(),
		};
	}

	generateStyleBoard() {
		let styleBoard = [];
		let isBlack = true;
		for (let row = 0; row < 8; row++) {
			isBlack = !isBlack;
			let row = [];
			for (let col = 0; col < 8; col++) {
				if (isBlack) {
					if (col % 2 === 0) row.push("black");
					else row.push("white");
				} else {
					if (col % 2 === 0) row.push("white");
					else row.push("black");
				}
			}
			styleBoard.push(row);
		}
		return styleBoard;
	}

	render() {
		//takes a 2 length target array and 2 length value array and checks if they are equal
		const checkContains = (targetArray, value) => {
			if (!targetArray) return false;
			for (let i = 0; i < targetArray.length; i++) {
				let locationA = targetArray[i];
				if (locationA[0] === value[0] && locationA[1] === value[1]) return true;
			}
			return false;
		};
		const rows = [];

		//determine the style board
		for (const [indexRow, row] of this.state.board.entries()) {
			let singleRow = [];
			for (const [indexCol, entry] of row.entries()) {
				const piece = this.state.board[indexRow][indexCol];
				const currentLocation = [indexRow, indexCol];

				singleRow.push(
					<td
						onClick={() => {
							this.setState({ styleBoard: this.generateStyleBoard() }, () => {
								let styleBoard = this.state.styleBoard;
								let board = this.state.board;
								const currentSelected = this.state.currentSelected;

								console.log(this.state.turn, piece);
								if (piece && this.state.turn == piece.player) {
									console.log(this.state.turn, piece.player);

									let validSpaces = entry.getValidSpaces(this.state.board);
									validSpaces.forEach((space) => {
										styleBoard[space[0]][space[1]] = "high";
									});
									this.setState({
										styleBoard,
										currentSelected: { piece, validSpaces },
									});
								} else {
									if (
										currentSelected &&
										checkContains(currentSelected.validSpaces, currentLocation)
									) {
										let currentSelectedPiece = currentSelected.piece;
										let pieceLocation = currentSelectedPiece.location;

										//update the piece location
										currentSelectedPiece.location = currentLocation;

										//update the state of the board
										board[currentLocation[0]][
											currentLocation[1]
										] = currentSelectedPiece;
										board[pieceLocation[0]][pieceLocation[1]] = null;

										//if the current piece is a pawn we need to update firstmove
										if (
											(currentSelectedPiece.name =
												"P" && currentSelectedPiece.firstMove)
										)
											currentSelected.piece.firstMove = false;

										//set the turn to the other player
										const turn = !this.state.turn;
										console.log(turn);
										this.setState({ board, currentSelected: null, turn });
									}
								}
							});
						}}
						className={`cell ${this.state.styleBoard[indexRow][indexCol]}`}
						key={`${indexCol}-"${indexRow}`}
					>
						{piece ? (
							<img
								alt="piece"
								src={require(`../${piece.imgURL}`)}
								className="piece"
							></img>
						) : (
							""
						)}
					</td>
				);
			}
			rows.push(<tr key={indexRow}>{singleRow}</tr>);
		}

		//determine the turn
		let turnColor = "black";
		if (this.state.turn) turnColor = "white";

		return (
			<Styled>
				<Container className="mt-4">
					<Row>
						<Col md={10}>
							<table className="mx-auto text-center board">
								<tbody>{rows}</tbody>
							</table>
						</Col>
						<Col md={2}>
							Turn:
							<div className="square" style={{ background: turnColor }}></div>
						</Col>
					</Row>
				</Container>
			</Styled>
		);
	}
}

export default Board;
