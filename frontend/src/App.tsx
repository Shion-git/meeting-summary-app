import FileUpload from "./components/FileUpload";
import HistoryPage from "./pages/History";

function App() {
  return (
      <div className="App" style={{ padding: "2rem" }}>
        <h1>会議要約アプリ</h1>
        <FileUpload />
        <HistoryPage />
      </div>
  );
}

export default App;