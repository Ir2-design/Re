import React, { useState } from 'react';
import { X, Users, Download, Search, Filter, Calendar, Home, User } from 'lucide-react';
import { VoteRecord } from '../types/Vote';

interface VoterTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allVoteRecords: VoteRecord[];
  polls: any[];
}

const VoterTrackingModal: React.FC<VoterTrackingModalProps> = ({ 
  isOpen, 
  onClose, 
  allVoteRecords,
  polls 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoll, setSelectedPoll] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'time' | 'house'>('time');

  if (!isOpen) return null;

  // Filter dan sort data
  const filteredRecords = allVoteRecords
    .filter(record => {
      const matchesSearch = record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.houseNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPoll = selectedPoll === 'all' || record.pollId === selectedPoll;
      return matchesSearch && matchesPoll;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.userName.localeCompare(b.userName);
        case 'house':
          return a.houseNumber.localeCompare(b.houseNumber);
        case 'time':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  // Statistik
  const uniqueVoters = new Set(allVoteRecords.map(r => r.userId)).size;
  const totalVotes = allVoteRecords.length;

  const exportToCSV = () => {
    const headers = ['No', 'Nama', 'Rumah', 'Voting', 'Waktu'];
    const csvData = filteredRecords.map((record, index) => {
      const poll = polls.find(p => p.id === record.pollId);
      return [
        index + 1,
        record.userName,
        record.houseNumber,
        poll?.title || 'Unknown',
        new Date(record.timestamp).toLocaleString('id-ID')
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `data-pemilih-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Data Partisipasi Pemilih</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Rekap lengkap warga yang telah berpartisipasi dalam voting
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Statistik */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{uniqueVoters}</div>
              <div className="text-sm text-gray-600">Warga Berpartisipasi</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{totalVotes}</div>
              <div className="text-sm text-gray-600">Total Suara</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{polls.length}</div>
              <div className="text-sm text-gray-600">Total Voting</div>
            </div>
          </div>
        </div>

        {/* Filter dan Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau nomor rumah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedPoll}
                onChange={(e) => setSelectedPoll(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Voting</option>
                {polls.map(poll => (
                  <option key={poll.id} value={poll.id}>{poll.title}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'time' | 'house')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="time">Urutkan: Waktu</option>
                <option value="name">Urutkan: Nama</option>
                <option value="house">Urutkan: Rumah</option>
              </select>

              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Nama Warga</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Home className="h-4 w-4" />
                    <span>Rumah</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Waktu</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pilihan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || selectedPoll !== 'all' 
                      ? 'Tidak ada data yang sesuai dengan filter'
                      : 'Belum ada data partisipasi'
                    }
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => {
                  const poll = polls.find(p => p.id === record.pollId);
                  const selectedOptions = poll?.options.filter(opt => 
                    record.optionIds.includes(opt.id)
                  ) || [];

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.houseNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {poll?.title || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.timestamp).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {selectedOptions.map(opt => opt.text).join(', ')}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer dengan info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Menampilkan {filteredRecords.length} dari {totalVotes} data
            </span>
            <span>
              Data diperbarui secara real-time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterTrackingModal;