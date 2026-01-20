import { nanoid } from 'nanoid';

import { readJson, writeJson } from './storage';

const VOTER_KEY = 'smartpolls:voterId:v1';

export function getVoterId(): string {
  const existing = readJson<string | null>(VOTER_KEY, null);
  if (existing) return existing;

  const newId = nanoid(16);
  writeJson(VOTER_KEY, newId);
  return newId;
}
