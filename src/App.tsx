import { Toaster } from "sonner";
import { Router } from "./router";


function App() {
  return (
    <>
      <Router />
      <Toaster position="bottom-right" richColors />
    </>
  )
  
}

export default App
