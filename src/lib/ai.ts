import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
});

/** Current Groq chat model — override with GROQ_MODEL in .env */
export const GROQ_MODEL =
  process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
