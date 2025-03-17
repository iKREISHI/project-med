import { ThemeProvider } from "../6_shared/Header/ThemeContext.tsx";
import {RouterComponent} from "./routes/_index.tsx";

function App() {

  return (
    <ThemeProvider>
      <RouterComponent/>
    </ThemeProvider>
  )
}

export default App
