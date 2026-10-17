import { BrowserRouter } from "react-router-dom";
import { LayoutApp } from "./layouts/LayoutApp"
import { RoutesApp } from "./RoutesApp"

function App() {
  return (
    <BrowserRouter>
      <LayoutApp>
        <RoutesApp />
      </LayoutApp>
    </BrowserRouter>
  )
}

export default App
