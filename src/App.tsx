import { BrowserRouter } from "react-router-dom";
import { LayoutApp } from "./layouts/LayoutApp"
import { RoutesApp } from "./RoutesApp"
import { FeedbackProvider } from "./hooks/FeedbackProvider"

function App() {
  return (
    <BrowserRouter>
      <FeedbackProvider>
        <LayoutApp>
          <RoutesApp />
        </LayoutApp>
      </FeedbackProvider>
    </BrowserRouter>
  )
}

export default App
