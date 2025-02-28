import React, { useEffect, useState } from 'react';

export default function Reports() {
  const [reportData, setReportData] = useState(null); // State to hold the API response
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchReportData = async () => {
      const authToken = localStorage.getItem('authToken'); // Get authToken from local storage

      try {
        const response = await fetch('http://localhost:3001/api/report/geminireport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authToken': authToken, // Pass authToken in the headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }

        const data = await response.json();
        setReportData(data); // Set the report data to state
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Failed to load report data'); // Set error message
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading state
  }

  if (error) {
    return <p>{error}</p>; // Show error message if any
  }

  if (!reportData) {
    return <p>No data available</p>; // Show this if no report data is available
  }

  return (
    <div className='bg-white p-3'>
      <h2>Reports</h2>
      <div
        dangerouslySetInnerHTML={{ __html: reportData.analysis }}
      />
    </div>
  );
}
