import React from 'react';
import { Poll } from '../types/Vote';
import { Calendar, User, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';

interface PollCardProps {
  poll: Poll;
  onVote: (poll: Poll) => void;
  onViewVoters?: (poll: Poll) => void;
  userHasVoted?: boolean;
}

const categoryColors = {
  security: 'bg-red-100 text-red-800 border-red-200',
  facility: 'bg-green-100 text-green-800 border-green-200',
  event: 'bg-purple-100 text-purple-800 border-purple-200',
  maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
  general: 'bg-blue-100 text-blue-800 border-blue-200'
};

const statusConfig = {
  active: { icon: Clock, color: 'text-green-600', text: 'Sedang Berlangsung' },
  ended: { icon: CheckCircle, color: 'text-gray-600', text: 'Telah Berakhir' },
  upcoming: { icon: AlertCircle, color: 'text-blue-600', text: 'Akan Dimulai' }
};

const PollCard: React.FC<PollCardProps> = ({ poll, onVote, onViewVoters, userHasVoted }) => {
  const StatusIcon = statusConfig[poll.status].icon;
  
  const getWinningOption = () => {
    return poll.options.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[poll.category]}`}>
            {poll.category.charAt(0).toUpperCase() + poll.category.slice(1)}
          </span>
          <div className="flex items-center space-x-1">
            <StatusIcon className={`h-4 w-4 ${statusConfig[poll.status].color}`} />
            <span className={`text-sm font-medium ${statusConfig[poll.status].color}`}>
              {statusConfig[poll.status].text}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{poll.description}</p>

      <div className="space-y-2 mb-4">
        {poll.options.slice(0, 2).map((option) => {
          const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
          return (
            <div key={option.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 flex-1 mr-3">{option.text}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{option.votes}</span>
              </div>
            </div>
          );
        })}
        {poll.options.length > 2 && (
          <p className="text-xs text-gray-500">+{poll.options.length - 2} opsi lainnya</p>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{poll.createdBy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Berakhir: {new Date(poll.endDate).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
        <span className="font-medium">{poll.totalVotes} suara</span>
      </div>

      {onViewVoters && poll.totalVotes > 0 && (
        <button
          onClick={() => onViewVoters(poll)}
          className="w-full mb-3 py-2 px-4 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Users className="h-4 w-4" />
          <span>Lihat Daftar Pemilih ({poll.totalVotes})</span>
        </button>
      )}

      {poll.status === 'ended' && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Hasil Terpilih:</span> {getWinningOption().text}
          </p>
        </div>
      )}

      <button 
        onClick={() => onVote(poll)}
        disabled={poll.status === 'upcoming'}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors relative ${
          poll.status === 'active' 
            ? userHasVoted
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            : poll.status === 'ended'
            ? 'bg-gray-100 text-gray-600 cursor-default'
            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
        }`}
      >
        {poll.status === 'active' ? 
         (userHasVoted ? '✓ Sudah Vote' : 'Vote Sekarang') : 
         poll.status === 'ended' ? 'Lihat Detail' : 'Belum Dimulai'}
      </button>
    </div>
  );
};

export default PollCard;