import React from 'react';
import { X, User, Home, Clock } from 'lucide-react';
import { VoteRecord } from '../types/Vote';

interface VoterListModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollTitle: string;
  voteRecords: VoteRecord[];
}

const VoterListModal: React.FC<VoterListModalProps> = ({ 
  isOpen, 
  onClose, 
  pollTitle, 
  voteRecords 
}) => {
  if (!isOpen) return null;

  const sortedRecords = [...voteRecords].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daftar Pemilih</h2>
            <p className="text-sm text-gray-600 mt-1">{pollTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Total pemilih: {voteRecords.length} warga
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada yang memberikan suara
              </div>
            ) : (
              sortedRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{record.userName}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Home className="h-3 w-3" />
                        <span>Rumah {record.houseNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(record.timestamp).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterListModal;