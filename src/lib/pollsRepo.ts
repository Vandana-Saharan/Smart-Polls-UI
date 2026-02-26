import type { Poll, PollOption } from '../types/poll';
import { apiDelete, apiGet, apiPost } from './api';

type PollResponse = {
  id: string;
  question: string;
  createdAt: string;
  options: {
    id: string;
    text: string;
  }[];
};

function mapPollResponse(p: PollResponse): Poll {
  return {
    id: p.id,
    question: p.question,
    createdAt: p.createdAt,
    options: p.options.map(
      (o): PollOption => ({
        id: o.id,
        text: o.text,
      }),
    ),
  };
}

export async function createPoll(input: { question: string; options: string[] }): Promise<Poll> {
  const payload = {
    question: input.question.trim(),
    options: input.options.map((text) => text.trim()),
  };

  const res = await apiPost<typeof payload, PollResponse>('/api/polls', payload);
  return mapPollResponse(res);
}

export async function getPoll(pollId: string): Promise<Poll> {
  const res = await apiGet<PollResponse>(`/api/polls/${encodeURIComponent(pollId)}`);
  return mapPollResponse(res);
}

export async function listPolls(): Promise<Poll[]> {
  const res = await apiGet<PollResponse[]>('/api/polls');
  return res.map(mapPollResponse).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deletePoll(pollId: string): Promise<void> {
  await apiDelete(`/api/polls/${encodeURIComponent(pollId)}`);
}

