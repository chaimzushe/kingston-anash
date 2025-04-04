'use client';

import React, { useState, useEffect } from 'react';

// Define the interface for Anash member data
interface AnashMember {
  Lead: string;
  LastName: string;
  Man: string;
  Woman: string;
  Ask: string;
  Pledged: string;
  Gave: string;
  Address: string;
  City: string;
  ST: string;
  Zip: string;
  ManPhone: string;
  WomanPhone: string;
  ManEmail: string;
  WomanEmail: string;
  Home: string;
  [key: string]: string; // Index signature for dynamic access
}

interface CommunityDirectoryProps {
  members: AnashMember[];
}

const CommunityDirectory: React.FC<CommunityDirectoryProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<AnashMember[]>(members);

  // Filter members based on search term
  useEffect(() => {
    let filtered = [...members];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(member => {
        // Check each field that might contain the search term
        return (
          // Name fields
          (member.LastName && member.LastName.toLowerCase().includes(term)) ||
          (member.Man && member.Man.toLowerCase().includes(term)) ||
          (member.Woman && member.Woman.toLowerCase().includes(term)) ||

          // Contact fields
          (member.ManPhone && member.ManPhone.toLowerCase().includes(term)) ||
          (member.WomanPhone && member.WomanPhone.toLowerCase().includes(term)) ||
          (member.ManEmail && member.ManEmail.toLowerCase().includes(term)) ||
          (member.WomanEmail && member.WomanEmail.toLowerCase().includes(term)) ||
          (member.Home && member.Home.toLowerCase().includes(term)) ||

          // Location fields
          (member.Address && member.Address.toLowerCase().includes(term)) ||
          (member.City && member.City.toLowerCase().includes(term)) ||
          (member.ST && member.ST.toLowerCase().includes(term)) ||
          (member.Zip && member.Zip.toLowerCase().includes(term))
        );
      });
    }

    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  return (
    <div className="mb-16">
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="relative w-full max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white text-sm"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMembers.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{member.LastName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {member.Man && <div>{member.Man} (M)</div>}
                      {member.Woman && <div>{member.Woman} (F)</div>}
                    </div>
                    {member.Lead && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lead: {member.Lead}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {member.ManPhone && <div>M: {member.ManPhone}</div>}
                      {member.WomanPhone && <div>F: {member.WomanPhone}</div>}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {member.ManEmail && <div>{member.ManEmail}</div>}
                      {member.WomanEmail && <div>{member.WomanEmail}</div>}
                    </div>
                    {member.Home && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Home: {member.Home}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{member.Address}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {member.City && member.ST && `${member.City}, ${member.ST} ${member.Zip}`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {member.Ask && <span className="mr-2">Ask: {member.Ask}</span>}
                      {member.Pledged && <span className="mr-2">Pledged: {member.Pledged}</span>}
                      {member.Gave && <span>Gave: {member.Gave}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No members found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search to find community members.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityDirectory;
