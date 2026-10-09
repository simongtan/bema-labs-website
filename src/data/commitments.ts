// Shared copy: COPY.md "Shared → src/data/commitments.ts". Verbatim; edit only from COPY.md.
// Titles are rendered as headings, so the run-in full stop from COPY.md is dropped.

export interface Commitment {
  title: string;
  body: string;
}

export const commitments: Commitment[] = [
  {
    title: 'People stay in charge',
    body: 'Automation prepares, checks and drafts. Your people approve anything that commits money, materials or safety.',
  },
  {
    title: 'No surprises on scope or price',
    body: 'A written scope, a fixed price and acceptance tests before the build starts. Changes are priced separately, and only go ahead with your approval.',
  },
  {
    title: 'You own what you pay for',
    body: 'Your data and the work built specifically for you are yours, in your accounts where practical, with documentation another developer could pick up.',
  },
  {
    title: 'A straight answer on fit',
    body: "If an existing product or a settings change will do the job, we'll say so, even if it means less work for us.",
  },
];
