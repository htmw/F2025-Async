import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import BasicButtons from "./components/ContinueButton";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <HeroSection />
      <BasicButtons />
      <Footer />
    </>
  );
}

export default App;
