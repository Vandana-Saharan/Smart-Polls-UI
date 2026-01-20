import { nanoid } from 'nanoid';

import type { Poll } from '../types/poll';
import { readJson, writeJson } from './storage';

const STORAGE_KEY = 'smartpolls:pools:v1'; // versioned key (best practice)

type PollsState = {
  polls: Record<string, Poll>;
};

function readState(): PollsState {
  return readJson<PollsState>(STORAGE_KEY, { polls: {} });
}

function writeState(state: PollsState) {
  writeJson(STORAGE_KEY, state);
}

export function createPoll(input: { question: string; options: string[] }): Poll {
  const id = nanoid(10);

  const poll: Poll = {
    id,
    question: input.question.trim(),
    options: input.options.map((text) => ({
      id: nanoid(8),
      text: text.trim(),
    })),
    createdAt: new Date().toISOString(),
  };

  const state = readState();
  state.polls[poll.id] = poll;
  writeState(state);

  return poll;
}

export function getPoll(pollId: string): Poll | null {
  const state = readState();
  return state.polls[pollId] ?? null;
}

export function listPolls(): Poll[] {
  const state = readState();
  return Object.values(state.polls).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function deletePoll(pollId: string) {
  const state = readState();
  delete state.polls[pollId];
  writeState(state);
}
