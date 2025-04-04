import React from 'react';
import { getAnashData } from '../../../lib/debugUtils';
import { PageHeader } from '../../../components/layout';

export default function AnashDataPage() {
  // Get the data from anash.xlsx
  const data = getAnashData();
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Anash.xlsx Data"
          subtitle="Raw data from the anash.xlsx file"
        />
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300">
              Total records: <span className="font-medium">{data.length}</span>
            </p>
            {data.length > 0 && (
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Fields available: <span className="font-medium">{Object.keys(data[0]).join(', ')}</span>
              </p>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Raw Data</h2>
          <div className="overflow-x-auto">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm overflow-auto max-h-[600px]">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
