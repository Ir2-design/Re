export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'facility' | 'event' | 'maintenance' | 'general';
  options: VoteOption[];
  startDate: string;
  endDate: string;
  totalVotes: number;
  status: 'active' | 'ended' | 'upcoming';
  createdBy: string;
  allowMultiple: boolean;
}

export interface UserVote {
  pollId: string;
  userId: string;
  userName: string;
  optionIds: string[];
  timestamp: string;
}

export interface VoteRecord {
  id: string;
  pollId: string;
  userId: string;
  userName: string;
  houseNumber: string;
  optionIds: string[];
  timestamp: string;
}