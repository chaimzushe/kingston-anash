'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter members based on search term
  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    // Use a small timeout to show loading state and prevent UI freezing on large datasets
    const timer = setTimeout(() => {
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
      setIsLoading(false);
    }, 300); // 300ms delay for better UX

    return () => clearTimeout(timer);
  }, [searchTerm, members]);

  return (
    <div className="mb-16">
      {/* Sticky search bar for mobile */}
      <div className="md:hidden sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md p-3 mb-4 left-0 right-0 mx-0">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search members..."
          showCount={true}
          totalCount={members.length}
          filteredCount={filteredMembers.length}
        />
      </div>

      {/* Desktop search bar */}
      <div className="hidden md:block mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="max-w-md mx-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by name, phone, email, address..."
            showCount={true}
            totalCount={members.length}
            filteredCount={filteredMembers.length}
          />
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div>
          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
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

          {/* Mobile view - Cards */}
          <div className="md:hidden space-y-4">
            {filteredMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{member.LastName}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {member.Man && <div className="truncate">{member.Man} (M)</div>}
                    {member.Woman && <div className="truncate">{member.Woman} (F)</div>}
                  </div>
                  {member.Lead && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">Lead: {member.Lead}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Contact section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</h4>
                    <div className="text-sm">
                      {member.ManPhone && (
                        <div className="flex items-center mb-1">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          <span className="text-gray-900 dark:text-white truncate">{member.Man}: {member.ManPhone}</span>
                        </div>
                      )}
                      {member.WomanPhone && (
                        <div className="flex items-center mb-1">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          <span className="text-gray-900 dark:text-white truncate">{member.Woman}: {member.WomanPhone}</span>
                        </div>
                      )}
                      {member.ManEmail && (
                        <div className="flex items-center mb-1">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-gray-900 dark:text-white truncate">{member.ManEmail}</span>
                        </div>
                      )}
                      {member.WomanEmail && (
                        <div className="flex items-center mb-1">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-gray-900 dark:text-white truncate">{member.WomanEmail}</span>
                        </div>
                      )}
                      {member.Home && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                          </svg>
                          <span className="text-gray-900 dark:text-white truncate">{member.Home}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location section */}
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</h4>
                    <div className="text-sm">
                      {member.Address && (
                        <div className="flex items-start mb-1">
                          <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span className="text-gray-900 dark:text-white break-words">
                            <span className="block truncate">{member.Address}</span>
                            {member.City && member.ST && <span className="block truncate">{member.City}, {member.ST} {member.Zip}</span>}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial section */}
                  {(member.Ask || member.Pledged || member.Gave) && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Financial</h4>
                      <div className="text-sm grid grid-cols-3 gap-2">
                        {member.Ask && (
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Ask</span>
                            <div className="text-gray-900 dark:text-white truncate">{member.Ask}</div>
                          </div>
                        )}
                        {member.Pledged && (
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Pledged</span>
                            <div className="text-gray-900 dark:text-white truncate">{member.Pledged}</div>
                          </div>
                        )}
                        {member.Gave && (
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Gave</span>
                            <div className="text-gray-900 dark:text-white truncate">{member.Gave}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Searching...</p>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No members found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any community members matching your search criteria. Try adjusting your search terms or clear the search to see all members.
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Scroll to top button - mobile only */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="md:hidden fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-200 z-20"
          aria-label="Scroll to top"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default CommunityDirectory;
