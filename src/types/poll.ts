export type PollOption = {
  id: string;
  text: string;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
};

export type PollResults = {
  pollId: string;
  votes: Record<string, number>; // optionId -> count
  votedBy: string[]; // list of voterIds (for now: device/browser id)
  updatedAt: string;
};
