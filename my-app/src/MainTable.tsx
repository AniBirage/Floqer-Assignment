import React, { useState, useEffect } from 'react';

import { Table } from 'antd';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { ColumnType } from 'antd/es/table';

import './App.css';



interface JobData {

  work_year: number;

  totalJobs: number;

  totalSalaryUSD: number;

}



const MainTable: React.FC = () => {

  const [data, setData] = useState<JobData[]>([]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [jobTitles, setJobTitles] = useState<{ [key: string]: number }>({});



  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await fetch('/salaries.csv');

        if (!response.ok) {

          throw new Error('Network response was not ok');

        }



        const csvData = await response.text();

        const rows = csvData.split('\n').slice(1); // Skip header row

        const groupedData: { [key: number]: JobData } = {};

        const allYears: number[] = [];



        const titles: { [key: string]: number } = {};



        rows.forEach(row => {

          const columns = row.split(',');

          const workYear = parseInt(columns[0]);

          allYears.push(workYear);



          const jobTitle = columns[3];



          if (workYear === selectedYear) {

            titles[jobTitle] = (titles[jobTitle] || 0) + 1;

          }



          const totalJobs = parseInt(columns[4]); // Assuming total number of jobs is in the 5th column

          const totalSalaryUSD = parseFloat(columns[6]); // Assuming total salary in USD is in the 7th column



          // Check if totalJobs is a valid number and not NaN

          if (!isNaN(totalJobs)) {

            if (groupedData[workYear]) {

              groupedData[workYear].totalJobs += 1; // Increment the totalJobs count

              groupedData[workYear].totalSalaryUSD += totalSalaryUSD;

            } else {

              groupedData[workYear] = {

                work_year: workYear,

                totalJobs: 1, // Initialize the totalJobs count to 1

                totalSalaryUSD: totalSalaryUSD

              };

            }

          }

        });



        // Convert grouped data to array

        const jobData = Object.values(groupedData);



        setData(jobData);

        setJobTitles(titles);

        setLoading(false);

      } catch (error) {

        console.error('Error fetching or parsing data:', error);

        setLoading(false);

      }

    };



    fetchData();

  }, [selectedYear]); // Add selectedYear as a dependency to re-fetch data when it changes



  const handleRowClick = (record: JobData) => {

    setSelectedYear(record.work_year);

  };



  const columns: ColumnType<JobData>[] = [

    {

      title: 'Work Year',

      dataIndex: 'work_year',

      key: 'work_year',

      sorter: (a, b) => a.work_year - b.work_year,

    },

    {

      title: 'Number of Total Jobs',

      dataIndex: 'totalJobs',

      key: 'totalJobs',

      sorter: (a, b) => a.totalJobs - b.totalJobs,

    },

    {

      title: 'Total Salary (USD)',

      dataIndex: 'totalSalaryUSD',

      key: 'totalSalaryUSD',

      sorter: (a, b) => a.totalSalaryUSD - b.totalSalaryUSD,

      render: (value) => `$${value.toLocaleString()}`,

    },

  ];



  const JobTitleTable: React.FC = () => {

    const dataSource = Object.entries(jobTitles).map(([title, count]) => ({ title, count }));

    const titleColumns: ColumnType<{ title: string; count: number }>[] = [

      {

        title: 'Job Title',

        dataIndex: 'title',

        key: 'title',

      },

      {

        title: 'Count',

        dataIndex: 'count',

        key: 'count',

      },

    ];



    return (

      <div>

        <h2>Job Titles for {selectedYear}</h2>

        <Table dataSource={dataSource} columns={titleColumns} />

      </div>

    );

  };



  const allYearsData = data.map(({ work_year, totalJobs }) => ({ work_year, totalJobs }));



  return (

    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>

      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Main Table</h1>

      {loading ? (

        <p>Loading...</p>

      ) : (

        <>

          <Table<JobData>

            columns={columns}

            dataSource={data}

            rowKey="work_year"

            onRow={(record) => ({

              onClick: () => handleRowClick(record),

            })}

            style={{ marginBottom: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)' }}

          />

          {selectedYear && (

            <>

              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Yearly Trends</h2>

              <LineChart width={800} height={400} data={allYearsData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="work_year" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line type="monotone" dataKey="totalJobs" stroke="red" strokeWidth={3} />

              </LineChart>

              <JobTitleTable />

            </>

          )}

        </>

      )}

    </div>

  );

};



export default MainTable;