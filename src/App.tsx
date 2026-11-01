import { BrowserRouter } from "react-router-dom";
import { LayoutApp } from "./layouts/LayoutApp"
import { RoutesApp } from "./RoutesApp"
import { FeedbackProvider } from "./hooks/FeedbackProvider"
import { AuthProvider } from "./hooks/AuthProvider"

function App() {
  return (
    <BrowserRouter>
      <FeedbackProvider>
        <AuthProvider>
          <LayoutApp>
            <RoutesApp />
          </LayoutApp>
        </AuthProvider>
      </FeedbackProvider>
    </BrowserRouter>
  )
}

export default App
