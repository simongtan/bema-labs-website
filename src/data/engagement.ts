// Shared copy: COPY.md "Shared → src/data/engagement.ts". Verbatim; edit only from COPY.md.
// No prices, ranges or currency (BUSINESS-MODEL-REVIEW §12 has no approval).

export interface EngagementStep {
  id: 'walkthrough' | 'feasibility' | 'build' | 'care';
  title: string;
  tag: string;
  summary: string;
  youGet: string[];
}

export const engagementSteps: EngagementStep[] = [
  {
    id: 'walkthrough',
    title: 'Process walkthrough',
    tag: 'No charge',
    summary:
      'About an hour, on site or by video. We look at how the work is done today and send you a short written summary with a recommended next step.',
    youGet: [
      'About an hour, on site or by video',
      'One real example traced from start to finish',
      'A short written summary and a recommended next step',
      'No obligation',
    ],
  },
  {
    id: 'feasibility',
    title: 'Feasibility assessment',
    tag: 'Fixed fee',
    summary:
      'For problems worth solving where something is uncertain, such as system access, data quality, calculations or licensing. You get findings, a recommended approach and a fixed-price proposal.',
    youGet: [
      'A fixed fee agreed before we start',
      'Checks on access, data, calculations and licensing',
      'Findings and a recommended approach',
      'A fixed-price proposal, if a build makes sense',
    ],
  },
  {
    id: 'build',
    title: 'Fixed-scope build',
    tag: 'Fixed price',
    summary:
      'A defined improvement, built and tested against acceptance criteria agreed up front, with training, documentation and handover included.',
    youGet: [
      'Written scope, exclusions and acceptance tests',
      'A fixed price and payment milestones agreed before work starts',
      'Testing with your real examples, including exceptions',
      'Training, documentation, source and a handover session',
    ],
  },
  {
    id: 'care',
    title: 'Care plan',
    tag: 'Optional, monthly',
    summary:
      "Monitoring, fixes and small changes, sized to what your solution actually needs. Or run it yourselves: it's documented for that.",
    youGet: [
      'Monitoring and fixes for the solution we built',
      'Small changes and periodic reviews, sized to your needs',
      'Support requests acknowledged by the next business day',
      'Written terms, agreed before you start',
    ],
  },
];

export const engagementFootnote =
  "Prices are agreed in writing for your scope before any work starts. If a solution needs extra software licences, we'll tell you before you commit, and the subscriptions stay in your name.";
