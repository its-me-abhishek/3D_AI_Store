import Canvas from "./canvas"
import Home from "./views/Home"
import Customizer from "./views/Customizer"

function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Customizer />
    </main>
  )
}

export default App
