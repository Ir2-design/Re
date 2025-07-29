import React, { useState } from 'react';
import { Poll, VoteOption } from '../types/Vote';
import { X, Check } from 'lucide-react';

interface VoteModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitVote: (pollId: string, optionIds: string[]) => void;
  userHasVoted?: boolean;
}

const VoteModal: React.FC<VoteModalProps> = ({ poll, isOpen, onClose, onSubmitVote, userHasVoted }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !poll) return null;

  const handleOptionSelect = (optionId: string) => {
    if (poll.allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onSubmitVote(poll.id, selectedOptions);
    setIsSubmitting(false);
    setSelectedOptions([]);
    onClose();
  };

  const getPercentage = (option: VoteOption) => {
    return poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Detail Voting</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll.title}</h3>
            <p className="text-gray-600 mb-4">{poll.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Total suara: {poll.totalVotes}</span>
              <span>Berakhir: {new Date(poll.endDate).toLocaleDateString('id-ID')}</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-4">
              {poll.status === 'ended' ? 'Hasil Voting:' : 'Pilihan Anda:'}
              {poll.allowMultiple && poll.status === 'active' && !userHasVoted && (
                <span className="text-sm font-normal text-gray-500 ml-2">(Boleh pilih lebih dari satu)</span>
              )}
              {userHasVoted && poll.status === 'active' && (
                <span className="text-sm font-normal text-green-600 ml-2">✓ Anda sudah memberikan suara</span>
              )}
            </h4>
            
            <div className="space-y-3">
              {poll.options.map((option) => {
                const percentage = getPercentage(option);
                const isSelected = selectedOptions.includes(option.id);
                
                return (
                  <div key={option.id} className="relative">
                    {poll.status === 'active' && !userHasVoted ? (
                      <button
                        onClick={() => handleOptionSelect(option.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{option.text}</span>
                          {isSelected && <Check className="h-5 w-5 text-blue-600" />}
                        </div>
                      </button>
                    ) : (
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{option.text}</span>
                          <span className="text-sm text-gray-600">{option.votes} suara</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {poll.status === 'active' && !userHasVoted && (
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0 || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Suara'}
              </button>
            </div>
          )}

          {userHasVoted && poll.status === 'active' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-800 font-medium mb-1">✓ Terima kasih sudah berpartisipasi!</div>
              <div className="text-green-600 text-sm">Anda sudah memberikan suara untuk voting ini</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteModal;