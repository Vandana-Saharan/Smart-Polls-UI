import type { Poll, PollResults } from '../types/poll';
import { readJson, writeJson } from './storage';

const RESULTS_KEY = 'smartpolls:results:v1';

type ResultsState = {
  results: Record<string, PollResults>; // pollId -> results
};

function readState(): ResultsState {
  return readJson<ResultsState>(RESULTS_KEY, { results: {} });
}

function writeState(state: ResultsState) {
  writeJson(RESULTS_KEY, state);
}

export function getResults(pollId: string): PollResults | null {
  const state = readState();
  return state.results[pollId] ?? null;
}

export function ensureResults(poll: Poll): PollResults {
  const state = readState();
  const existing = state.results[poll.id];
  if (existing) return existing;

  const votes: Record<string, number> = {};
  for (const opt of poll.options) votes[opt.id] = 0;

  const created: PollResults = {
    pollId: poll.id,
    votes,
    votedBy: [],
    updatedAt: new Date().toISOString(),
  };

  state.results[poll.id] = created;
  writeState(state);
  return created;
}

export function submitVote(args: { poll: Poll; optionId: string; voterId: string }) {
  const { poll, optionId, voterId } = args;

  const state = readState();
  const current = state.results[poll.id] ?? ensureResults(poll);

  // anti-duplicate
  if (current.votedBy.includes(voterId)) {
    return { ok: false as const, reason: 'ALREADY_VOTED' as const };
  }

  // ensure option exists
  if (!(optionId in current.votes)) {
    return { ok: false as const, reason: 'INVALID_OPTION' as const };
  }

  current.votes[optionId] = (current.votes[optionId] ?? 0) + 1;
  current.votedBy.push(voterId);
  current.updatedAt = new Date().toISOString();

  state.results[poll.id] = current;
  writeState(state);

  return { ok: true as const };
}
export function deleteResults(pollId: string) {
  const state = readState();
  delete state.results[pollId];
  writeState(state);
}
