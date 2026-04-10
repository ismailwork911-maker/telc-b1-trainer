import { Routes, Route } from 'react-router-dom';
import ExamSelector from './components/ExamSelector';
import ListeningModule from './components/ListeningModule';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ExamSelector />} />
      <Route path="/exam/:examId" element={<ListeningModule />} />
    </Routes>
  );
}
