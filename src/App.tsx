import Header from "./components/Header/Header";
import Rules from "./components/Rules/Rules";
import Game from "./components/Game/Game";

import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Header />
      <Rules />
      <Game />
    </div>
  );
}
