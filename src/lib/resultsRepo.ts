import type { PollResults } from '../types/poll';
import { apiGet, apiPost } from './api';

type PollResultsResponse = {
  pollId: string;
  votes: Record<string, number>;
};

type VoteRequest = {
  optionId: string;
  voterId: string;
};

type VoteResponse = {
  ok: boolean;
  message: string;
};

export async function getResults(pollId: string): Promise<PollResults> {
  const res = await apiGet<PollResultsResponse>(`/api/polls/${encodeURIComponent(pollId)}/results`);
  // Backend doesn’t track votedBy / updatedAt in this DTO, but UI only needs votes.
  return {
    pollId: res.pollId,
    votes: res.votes,
    votedBy: [],
    updatedAt: new Date().toISOString(),
  };
}

export async function submitVote(pollId: string, payload: VoteRequest): Promise<{
  ok: boolean;
  reason?: 'ALREADY_VOTED' | 'INVALID_OPTION' | 'POLL_NOT_FOUND' | 'UNKNOWN';
}> {
  const res = await apiPost<VoteRequest, VoteResponse>(
    `/api/polls/${encodeURIComponent(pollId)}/vote`,
    payload,
  );

  if (!res.ok) {
    const reason =
      (res.message as
        | 'ALREADY_VOTED'
        | 'INVALID_OPTION'
        | 'POLL_NOT_FOUND'
        | 'UNKNOWN') ?? 'UNKNOWN';
    return { ok: false, reason };
  }

  return { ok: true };
}

