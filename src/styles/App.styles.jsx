import styled from "styled-components"
const dashboardBackground1 = 'url(' + require('../backgrounds/cloudBackground1.jpg') + ')'

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: ${dashboardBackground1};
  background-size: cover
`