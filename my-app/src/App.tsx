import React from 'react';
import './App.css';
import MainTable from './MainTable';
import JobTrendGraph from './JobTrendGraph';
import YearlyJobTable from './YearlyJobTable'; // Import the YearlyJobTable component

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Data Analysis</h1>
      </header>
      <MainTable />
      <JobTrendGraph /> {/* Render the JobTrendGraph component */}
      <YearlyJobTable year={2022} /> {/* Example: Render YearlyJobTable for year 2022 */}
    </div>
  );
};

export default App;
