import React, { useState, useEffect } from 'react';
import { Plus, LogIn } from 'lucide-react';
import Header from './components/Header';
import FilterTabs from './components/FilterTabs';
import PollCard from './components/PollCard';
import VoteModal from './components/VoteModal';
import CreatePollModal from './components/CreatePollModal';
import LoginModal from './components/LoginModal';
import VoterListModal from './components/VoterListModal';
import RegistrationModal from './components/RegistrationModal';
import { mockPolls } from './data/mockData';
import { mockUsers } from './data/mockUsers';
import { Poll, UserVote, VoteRecord } from './types/Vote';
import { User, AuthState, RegistrationData } from './types/Auth';

function App() {
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isVoterListModalOpen, setIsVoterListModalOpen] = useState(false);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const filteredPolls = polls.filter(poll => 
    activeFilter === 'all' || poll.category === activeFilter
  );

  const handleVote = (poll: Poll) => {
    if (!authState.isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    
    setSelectedPoll(poll);
    setIsVoteModalOpen(true);
  };

  const handleLogin = (user: User) => {
    setAuthState({
      user,
      isAuthenticated: true
    });
  };

  const handleRegister = (registrationData: RegistrationData) => {
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: registrationData.name,
      email: registrationData.email,
      houseNumber: registrationData.houseNumber,
      rt: registrationData.rt,
      rw: registrationData.rw,
      role: 'resident'
    };
    
    // Add to users list
    setUsers(prev => [...prev, newUser]);
    
    // Auto login after registration
    setAuthState({
      user: newUser,
      isAuthenticated: true
    });
    
    // Show success message
    alert(`Selamat datang ${newUser.name}! Registrasi berhasil dan Anda sudah login.`);
  };

  const handleLogout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    setUserVotes([]);
  };

  const handleViewVoters = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsVoterListModalOpen(true);
  };

  const userHasVoted = (pollId: string) => {
    return userVotes.some(vote => vote.pollId === pollId && vote.userId === authState.user?.id);
  };

  const getPollVoteRecords = (pollId: string) => {
    return voteRecords.filter(record => record.pollId === pollId);
  };
  const handleSubmitVote = (pollId: string, optionIds: string[]) => {
    if (!authState.user) return;
    
    // Update poll votes
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id !== pollId) return poll;
        
        const updatedOptions = poll.options.map(option => {
          if (optionIds.includes(option.id)) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });
        
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1
        };
      })
    );

    // Record user vote
    const newVote: UserVote = {
      pollId,
      userId: authState.user.id,
      userName: authState.user.name,
      optionIds,
      timestamp: new Date().toISOString()
    };
    setUserVotes(prev => [...prev, newVote]);

    // Record detailed vote record
    const newVoteRecord: VoteRecord = {
      id: Date.now().toString(),
      pollId,
      userId: authState.user.id,
      userName: authState.user.name,
      houseNumber: authState.user.houseNumber,
      optionIds,
      timestamp: new Date().toISOString()
    };
    setVoteRecords(prev => [...prev, newVoteRecord]);

    // Show success message (in a real app, this would be a toast)
    alert('Suara Anda berhasil disimpan!');
  };

  const handleCreatePoll = (pollData: any) => {
    if (!authState.isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    
    const newPoll: Poll = {
      id: Date.now().toString(),
      title: pollData.title,
      description: pollData.description,
      category: pollData.category,
      options: pollData.options.map((text: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        text,
        votes: 0
      })),
      startDate: new Date().toISOString().split('T')[0],
      endDate: pollData.endDate,
      totalVotes: 0,
      status: 'active',
      createdBy: authState.user?.name || 'Warga Cluster',
      allowMultiple: pollData.allowMultiple
    };
    
    setPolls(prev => [newPoll, ...prev]);
    alert('Voting baru berhasil dibuat!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={authState.user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forum Voting Warga
            </h1>
            <p className="text-gray-600">
              Partisipasi aktif warga dalam pengambilan keputusan cluster
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {!authState.isAuthenticated && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Buat Voting</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <FilterTabs 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onVote={handleVote}
              onViewVoters={authState.user?.role === 'admin' || authState.user?.role === 'rt_head' || authState.user?.role === 'rw_head' ? handleViewVoters : undefined}
              userHasVoted={userHasVoted(poll.id)}
            />
          ))}
        </div>

        {filteredPolls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Tidak ada voting</div>
            <p className="text-gray-500">
              Belum ada voting untuk kategori ini.
            </p>
          </div>
        )}
      </main>

      <VoteModal
        poll={selectedPoll}
        isOpen={isVoteModalOpen}
        onClose={() => {
          setIsVoteModalOpen(false);
          setSelectedPoll(null);
        }}
        onSubmitVote={handleSubmitVote}
        userHasVoted={selectedPoll ? userHasVoted(selectedPoll.id) : false}
      />

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePoll={handleCreatePoll}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegistrationModalOpen(true);
        }}
      />

      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setIsRegistrationModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <VoterListModal
        isOpen={isVoterListModalOpen}
        onClose={() => {
          setIsVoterListModalOpen(false);
          setSelectedPoll(null);
        }}
        pollTitle={selectedPoll?.title || ''}
        voteRecords={selectedPoll ? getPollVoteRecords(selectedPoll.id) : []}
      />
    </div>
  );
}

export default App;