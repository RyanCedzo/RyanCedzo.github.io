import React from "react"
import ReactDOM from "react-dom"
import { createRoot } from 'react-dom/client';
import App from "./App"
import GlobalStyles from "./styles/globalStyles.styles"

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <>
    <GlobalStyles />
    <App />
  </>
)
