import styled from "styled-components"

export const DashBoardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  font-family: 'Open Sans';
  background: rgb(0,212,255);
background: radial-gradient(circle, rgba(0,212,255,1) 0%, rgba(255,255,255,0) 17%);
`
export const ColorTitleDiv = styled.div`
  font-size: 22px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 2px;
`

export const selectInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 10px;
  border-radius: 5px;
`

export const SearchInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 10px;
  border-radius: 5px;
  font-size: 1.5rem;

  &::placeholder {
    font-size: 1.5rem;
  }
`
export const SelectButton = styled.button`
  background-color: #1db954;
  padding: 1rem;
  border: 2px solid;
  border-radius: 8px;
  font-size: 20px;
  margin-top: 10px;
`

export const ColorButton = styled.button`
  border: 2px solid;
  border-radius: 10px;
`

export const Container = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #191414;
`

export const ResultsContainer = styled.div`
  flex-grow: 1;
  margin: 3rem 0;
  overflow-y: auto;
  overflow-x: auto;
  background-color: black;
`
export const LoadingWord = styled.div`
  text-align: center;
  font-size: 20px;
  width: 100%;
`

export const TitleDiv = styled.div`
  text-align: center;
  font-size: 40px;
  width: 100%;
  margin-bottom: 133px;
`

export const LyricsContainer = styled.div`
  position: relative; /* Set the parent container position to relative */
  display: flex; /* Use flex layout */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  height: 350px;
  width: 350px;
  border-radius: 10px;
  margin-bottom: 10px;
  //margin-top: 25px;
  margin-top: 55px;
  // border: 10px black;
  // border-style: inset;
`
export const TopDiv = styled.div`
  position: absolute; /* Use absolute positioning */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  top: 0; /* Position the div at the top */
  left: 0; /* Align the div to the left edge of LyricsContainer */
  width: 100%; /* Set the width to 100% to match LyricsContainer's width */
  height: 70px; /* Set the height to 50px */
  font-size: 20px;
  text-align: center;
`

export const TopContainer = styled.div`
  height: 20vh;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 60px;
`

export const PlayerContainer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
`