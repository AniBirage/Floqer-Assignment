// components/JobTrendGraph.tsx

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { parse } from 'papaparse'; // Import Papaparse for CSV parsing

interface JobData {
  work_year: number;
  totalJobs: number;
}

const JobTrendGraph: React.FC = () => {
  const [data, setData] = useState<JobData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./salaries.csv'); // Fetch CSV file
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const csvData = await response.text(); // Get CSV text
        const parsedData = parse(csvData, { header: true }); // Parse CSV using Papaparse

        // Extract and format the data
        const formattedData: JobData[] = parsedData.data.map((row: any) => ({
          work_year: parseInt(row.work_year),
          totalJobs: parseInt(row.totalJobs)
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Yearly Trends</h2>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="work_year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalJobs" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default JobTrendGraph;
