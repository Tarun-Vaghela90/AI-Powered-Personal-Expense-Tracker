import React, { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(); // Ref to the content we want to export

  useEffect(() => {
    const fetchReportData = async () => {
      const authToken = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:3001/api/report/geminireport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authToken': authToken,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }

        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin:       0.5,
      filename:     'Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-white">{error}</p>;
  if (!reportData) return <p className="text-white">No data available</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reports</h2>
        <button
          onClick={handleDownloadPDF}
          className="mb-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Download as PDF
        </button>
        <div
          ref={reportRef}
          className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200"
        >
          <div dangerouslySetInnerHTML={{ __html: reportData.analysis }} />
        </div>
      </div>
    </div>
  );
}
