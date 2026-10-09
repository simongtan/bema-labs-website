// Shared copy: COPY.md "Shared → src/data/process.ts". Verbatim; edit only from COPY.md.

export interface ProcessStep {
  n: number;
  title: string;
  body: string;
  outputs: string[];
}

export const processSteps: ProcessStep[] = [
  {
    n: 1,
    title: 'Walk the process',
    body: 'We follow one real piece of work from start to finish, including an awkward case, so the solution handles exceptions as well as the easy path.',
    outputs: [
      'Notes on the current steps, systems and handovers',
      'The problem described in your words',
      'A recommended next step: build, assess first, or leave it alone',
    ],
  },
  {
    n: 2,
    title: 'Agree the scope',
    body: "A written scope with exclusions, your inputs, acceptance tests, a fixed price and a support period. Nothing is built until it's agreed.",
    outputs: [
      "What's included and what isn't",
      "What we'll need from your people, and when",
      'Acceptance tests',
      'A fixed price, payment milestones and target dates',
      'Who owns what, who has access, and the support period',
    ],
  },
  {
    n: 3,
    title: 'Build and test',
    body: 'Built in your environment where practical, and tested with real examples, including the messy ones.',
    outputs: [
      'Versioned work you can see progressing',
      'Tests covering normal and exception cases',
      "Clear errors when something can't be processed",
    ],
  },
  {
    n: 4,
    title: 'Accept and hand over',
    body: "You test it against the agreed criteria. You get training, documentation and the source, so it doesn't depend on us.",
    outputs: [
      'A test record against the agreed criteria',
      'Training for the people who use and run it',
      'Source, configuration, documentation and a handover session',
    ],
  },
  {
    n: 5,
    title: 'Run and improve',
    body: 'An optional care plan keeps it monitored and current. Further improvements are scoped and agreed separately.',
    outputs: [
      'Monitoring and fixes, if you choose a care plan',
      "A check of how it's being used against the starting point",
      'New improvements scoped and priced separately',
    ],
  },
];
