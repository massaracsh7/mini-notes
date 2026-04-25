import 'dotenv/config';
import { PostStatus, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const posts = [
  {
    title: 'AI is best used as a thinking partner, not a replacement',
    slug: 'ai-thinking-partner-not-replacement',
    excerpt:
      'The strongest AI workflows appear when a person keeps judgment, direction, and taste.',
    contentMarkdown: `
# AI is best used as a thinking partner, not a replacement

The most useful way to work with AI is not to ask it to "do everything," but to let it expand your thinking.

## What AI does well

- It generates first drafts quickly
- It helps compare options
- It summarizes large bodies of text
- It can keep momentum when you feel stuck

## What humans still need to own

- Defining the real problem
- Choosing what matters
- Understanding social context
- Deciding what is acceptable, ethical, or useful

When teams expect AI to replace judgment, quality often drops. When teams use AI to widen perspective and reduce friction, quality usually improves.

## A practical habit

Before accepting an AI answer, ask:

1. What assumption is hidden here?
2. What would fail in the real world?
3. What would an expert challenge?

AI becomes more valuable when we use it to sharpen our own reasoning rather than outsource it.
    `.trim(),
  },
  {
    title: 'Good prompts start with clear context, not clever wording',
    slug: 'good-prompts-start-with-context',
    excerpt:
      'Prompt quality improves more from grounded context and constraints than from magical phrasing.',
    contentMarkdown: `
# Good prompts start with clear context, not clever wording

People often search for the perfect prompt formula. In practice, the biggest improvement usually comes from context.

## A strong prompt usually includes

- The goal
- The audience
- The format
- The constraints
- The definition of success

For example, this is weak:

\`\`\`text
Write a post about AI.
\`\`\`

This is much stronger:

\`\`\`text
Write a 500-word post for product designers about how AI changes early-stage research.
Use plain language, include two real workflow examples, and avoid hype.
\`\`\`

## Why context matters

AI predicts likely continuations. The more grounded your context is, the more useful the continuation becomes.

Good prompting is less about magic words and more about giving the model enough signal to be meaningfully helpful.
    `.trim(),
  },
  {
    title: 'The hidden skill in AI work is verification',
    slug: 'hidden-skill-in-ai-work-is-verification',
    excerpt:
      'The real differentiator is not producing answers quickly, but checking them with discipline.',
    contentMarkdown: `
# The hidden skill in AI work is verification

AI can produce impressive output fast. That speed creates a new responsibility: verification.

## Why verification matters

AI output can be:

- Fluent but wrong
- Reasonable but outdated
- Structured but incomplete
- Confident without evidence

If teams only reward speed, they accidentally reward fragile work.

## A simple verification loop

1. Check factual claims
2. Check dates and versions
3. Check edge cases
4. Check whether the answer actually matches the task

This is especially important in:

- API integration
- legal content
- financial analysis
- medical information
- production code

The future of AI work belongs to people who can move quickly **and** verify carefully.
    `.trim(),
  },
  {
    title: 'Small AI automations often beat giant AI transformations',
    slug: 'small-ai-automations-beat-giant-transformations',
    excerpt:
      'Many organizations get more value from small repeatable automations than from grand AI initiatives.',
    contentMarkdown: `
# Small AI automations often beat giant AI transformations

Big AI strategies sound exciting, but many teams get better results from solving small repetitive problems.

## Examples of useful small wins

- Turning meeting notes into action items
- Drafting release notes from commits
- Tagging support requests by theme
- Summarizing long research interviews
- Converting rough bullet points into internal docs

## Why small automations work

- They are easier to test
- They have clear time savings
- They fit naturally into existing workflows
- They create trust through visible value

Large transformations often fail because they demand too much organizational change at once.

Small automations, by contrast, create momentum. Once people see repeated value, adoption grows more naturally.
    `.trim(),
  },
  {
    title: 'AI literacy should include limits, not just capabilities',
    slug: 'ai-literacy-should-include-limits',
    excerpt: 'A mature understanding of AI includes uncertainty, tradeoffs, and failure modes.',
    contentMarkdown: `
# AI literacy should include limits, not just capabilities

Most conversations about AI literacy focus on what tools can do. That is only half the picture.

Real literacy also includes:

- knowing when a model may hallucinate
- understanding privacy risks
- recognizing bias in outputs
- seeing when automation removes needed human judgment

## A healthier mental model

AI is not a mind. It is not a colleague with lived experience. It is a system that predicts and transforms patterns from data.

That makes it powerful, but also limited.

## Questions every team should ask

1. What data should never be sent to this tool?
2. What decisions must stay human?
3. What kind of mistakes would be costly here?
4. How will we review the output?

The more normal AI becomes, the more important calm, practical literacy becomes too.
    `.trim(),
  },
];

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: {
      email: 'admin@example.com',
    },
    update: {
      passwordHash,
      role: 'admin',
    },
    create: {
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
    },
  });

  for (const post of posts) {
    await prisma.post.upsert({
      where: {
        slug: post.slug,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        contentMarkdown: post.contentMarkdown,
        status: PostStatus.published,
        publishedAt: new Date(),
      },
      create: {
        ...post,
        status: PostStatus.published,
        publishedAt: new Date(),
      },
    });
  }

  console.log('Admin created:', user.email);
  console.log(`AI posts ready: ${posts.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
