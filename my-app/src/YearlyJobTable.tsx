import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { parse } from 'papaparse'; // Import Papaparse for CSV parsing

interface JobData {
  job_title: string;
  totalJobs: number;
}

interface Props {
  year: number;
}

const YearlyJobTable: React.FC<Props> = ({ year }) => {
  const [data, setData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(',/salaries.csv'); // Fetch CSV file
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const csvData = await response.text(); // Get CSV text
        const parsedData = parse(csvData, { header: true }); // Parse CSV using Papaparse

        // Filter data for the selected year
        const filteredData = parsedData.data.filter((row: any) => parseInt(row.work_year) === year);

        // Aggregate job titles and count total jobs for the selected year
        const aggregatedData: { [key: string]: number } = {};
        filteredData.forEach((row: any) => {
          const jobTitle = row.job_title;
          if (aggregatedData[jobTitle]) {
            aggregatedData[jobTitle]++;
          } else {
            aggregatedData[jobTitle] = 1;
          }
        });

        // Convert aggregated data to array of objects
        const formattedData: JobData[] = Object.keys(aggregatedData).map(jobTitle => ({
          job_title: jobTitle,
          totalJobs: aggregatedData[jobTitle]
        }));

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'job_title',
      key: 'job_title',
    },
    {
      title: 'Total Jobs',
      dataIndex: 'totalJobs',
      key: 'totalJobs',
    },
  ];

  return (
    <div>
      <h2>{`Jobs in ${year}`}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table dataSource={data} columns={columns} />
      )}
    </div>
  );
};

export default YearlyJobTable;
