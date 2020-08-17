import React from "react";
import styled from "styled-components";
import Board from "./Components/Board";
import NavigationBar from "./Components/NavigationBar";

const Styled = styled.div``;

function App() {
	return (
		<Styled>
			<NavigationBar />
			<Board />
		</Styled>
	);
}

export default App;
