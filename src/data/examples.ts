// Shared copy: COPY.md "Shared → src/data/examples.ts". Verbatim; edit only from COPY.md.
// These are illustrative patterns, not client projects. IllustrativeExample.astro always labels them.

export interface Example {
  id: 'order-intake' | 'supplier-documents' | 'approvals' | 'weekly-report';
  title: string;
  situation: string[];
  build: string[];
  people: string;
  test: string;
}

export const exampleLabel = 'Illustrative example';
export const exampleNote = 'A typical pattern, not a client project.';
export const exampleSectionLabels = {
  situation: 'The situation',
  build: "What we'd build",
  people: 'What stays with people',
  test: "How we'd judge it worked",
} as const;

export const examples: Example[] = [
  {
    id: 'order-intake',
    title: 'Order intake without the re-typing',
    situation: [
      'Orders arrive by email, phone and the occasional photo of a handwritten note.',
      'One person re-types each order into the main system and a planning spreadsheet.',
      'Missing details surface later, when someone has to stop work and chase them.',
      "Changes after entry are tracked in that person's head.",
    ],
    build: [
      'Orders come in through one simple form or a monitored inbox.',
      'Required details are checked on arrival, and gaps are flagged straight away.',
      'A draft entry is prepared for a person to review, correct and approve.',
      'Approved orders go into the system of record through a supported import.',
      'Changed or incomplete orders appear on one shared list.',
    ],
    people:
      "Approving orders, quantities and anything that commits money or materials. The automation drafts and checks; it doesn't decide.",
    test: 'Acceptance tests agreed before the build. The agreed order types are captured correctly, nothing is submitted without approval, errors are visible, and your people can run it without us.',
  },
  {
    id: 'supplier-documents',
    title: 'Supplier paperwork, read and checked',
    situation: [
      'Supplier invoices and delivery dockets arrive as PDFs and are keyed into the accounting system by hand.',
      'Mismatches with the purchase order are sometimes found only after payment.',
    ],
    build: [
      'AI-assisted extraction drafts each entry from the document.',
      "Each draft is matched to its purchase order. Anything that doesn't match, or that the extraction isn't confident about, is flagged.",
      "Approved entries are posted through the accounting system's supported import.",
    ],
    people:
      "Someone reviews every draft before it's posted. Mismatches go to a person, not a guess.",
    test: 'A set of real past documents, including poor scans and part deliveries, is either processed correctly or clearly flagged for review.',
  },
  {
    id: 'approvals',
    title: "Approvals that don't stall",
    situation: [
      'Purchase requests and job sign-offs are emailed around.',
      "Nobody can easily tell what's waiting, on whom, or since when.",
    ],
    build: [
      'A simple request form in Microsoft 365.',
      'Routing to the right approver based on agreed rules, with reminders.',
      'A record of every request and decision.',
    ],
    people: 'Approvers still decide. The flow only routes, reminds and records.',
    test: 'Each request type reaches the right approver, reminders arrive on schedule, and the record shows who approved what and when.',
  },
  {
    id: 'weekly-report',
    title: 'The weekly report that builds itself',
    situation: [
      'Each week someone combines exports from several systems into a spreadsheet by hand.',
      'Different people define the same figure in different ways.',
    ],
    build: [
      'A dashboard that refreshes from the source systems on a schedule.',
      'A written definition for every figure.',
      'An exceptions list for late, changed or incomplete work.',
    ],
    people:
      'Managers still interpret the numbers and decide what to do. The dashboard removes the copy and paste.',
    test: 'Figures reconcile with the source systems for an agreed sample period, and refreshes run without manual steps.',
  },
];

export function getExample(id: Example['id']): Example {
  const found = examples.find((e) => e.id === id);
  if (!found) throw new Error(`Unknown example id: ${id}`);
  return found;
}
