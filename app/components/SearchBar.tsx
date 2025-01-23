import React, { useState } from 'react';
import { cn } from '@coinbase/onchainkit/theme';
import { X, Search } from 'lucide-react';
import { FCUser } from '../types';

type SearchProps = {
  className?: string;
  users?: FCUser[];
  setUsers: React.Dispatch<React.SetStateAction<FCUser[]>>;
};

const SearchBar = ({ className, setUsers, users }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<FCUser>>([]);
  //const [selectedUsers, setSelectedUsers] = useState<Array<FCUser>>([]);
  //const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (term:  string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }
    
    //setIsLoading(true);
    try {
      const response = await fetch(`/api/fc-search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      //setIsLoading(false);
    }
  };

  const addUser = (user: FCUser) => {
    if (users && !users.find((u: FCUser) => u.username === user.username)) {
      setUsers([...users, user]);
    }
    setSearchResults([]);
    setSearchTerm('');
  };

  const removeUser = (username: string) => {
    setUsers(users?.filter(u => u.username !== username) ?? []);
  };

  return (
  <div className={cn('flex w-full flex-col md:flex md:w-1/2', className)}>
    <div className="w-full max-w-2xl mx-auto p-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="border border-[#5788FA]/50 bg-black flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full px-4 py-2 bg-transparent text-[#5788FA] placeholder-[#5788FA] outline-none"
            placeholder="Search usernames..."
          />
          <Search className="w-6 h-6 text-[#5788FA] mr-4" />
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute w-full mt-1 border border-[#5788FA]/50 bg-black z-10">
            {searchResults.map((user: FCUser) => (
              <div
                key={user.username}
                onClick={() => addUser(user)}
                className="px-4 py-2 hover:bg-blue-900 cursor-pointer text-[#5788FA]"
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Users */}
      <div className="space-y-2">
        {users?.map((user: FCUser) => (
          <div
            key={user.username}
            className="flex justify-between items-center border border-[#5788FA] px-4 py-2 bg-black text-[#5788FA]"
          >
            <span>{user.username}</span>
            <button
              onClick={() => removeUser(user.username)}
              className="hover:text-[#5788FA]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default SearchBar;
