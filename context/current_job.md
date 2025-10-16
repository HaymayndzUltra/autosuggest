<!-- 
  AI_META_INSTRUCTIONS:
  - PURPOSE: Job posting analysis with requirements and strategy
  - PROCESSING: Match user skills to job requirements, use tech stack for examples
  - TRUNCATION: First 300 chars = job title, key requirements, tech stack
  - PRIORITY: CRITICAL - Used in every real-time suggestion (300ms)
  - INTENT_TRIGGERS: question, technical_discussion, requirement_matching
  - CODE_REFERENCES: suggestionPromptBuilder.ts:38-41, reasoningEngine.ts:258-260
-->

# Job Analysis: [Position Title]

<!-- TRUNCATION_TARGET: First 300 chars - Critical job info -->

**Company**: [Company Name]  
**Position**: [Job Title]  
**Industry**: [Healthcare/Finance/E-commerce/SaaS/Enterprise]  
**Location**: [Remote/Hybrid/On-site]  
**Timeline**: [Expected duration - e.g., "3 months MVP, ongoing support"]  
**Budget**: [If known - e.g., "$15k-20k for MVP"]

---

## Job Overview
<!-- AI_PROCESSING_HINT: Extract key info for context-aware responses -->

[Write a brief description of the project and company. What are they building? Why does it matter? This helps AI understand the business context.]

---

## Key Requirements
<!-- AI_REQUIREMENT_MATCHING: Extract for skill alignment -->

### Must-Have Skills (AI Priority: Highest)
<!-- AI matches these to resume.md skills -->
- [Technology 1] ([Experience level required])
- [Technology 2] ([Experience level required])
- [Technology 3] ([Experience level required])
- [Compliance/Industry requirement]

### Nice-to-Have Skills
- [Technology 1] ([Why it's beneficial])
- [Technology 2] ([Why it's beneficial])
- [Technology 3] ([Why it's beneficial])

### Soft Skills
- [Skill 1] ([Why important])
- [Skill 2] ([Why important])

---

## Project Scope
<!-- AI_CONTEXT_AWARE: Use for specific examples -->

### Main Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]

### Key Features
1. **[Feature Category 1]**
   - [Specific feature]
   - [Specific feature]
2. **[Feature Category 2]**
   - [Specific feature]
   - [Specific feature]

### Compliance Requirements
<!-- AI_COMPLIANCE_DETECTION: Mention when discussing security/data -->
- [Compliance Type]: [Specific requirements]
- [Compliance Type]: [Specific requirements]

### Scale & Performance
- [Number] active users
- [Data volume] records
- [Uptime] SLA
- [Performance] requirements

---

## Tech Stack Requirements
<!-- AI_TECH_STACK_MATCHING: Use in technical discussions -->

### Frontend
- [Technology 1] ([Version/Specifics])
- [Technology 2] ([Version/Specifics])
- [Technology 3] ([Version/Specifics])

### Backend
- [Technology 1] ([Version/Specifics])
- [Technology 2] ([Version/Specifics])
- [Technology 3] ([Version/Specifics])

### Infrastructure
- [Technology 1] ([Specific services])
- [Technology 2] ([Specific services])
- [Technology 3] ([Specific services])

### Security & Compliance
- [Security requirement 1]
- [Security requirement 2]
- [Compliance requirement 1]

---

## My Approach/Strategy
<!-- AI_VALUE_PROPOSITION: Use when asked "Why should we hire you?" -->

### Skills to Highlight
1. **[Skill 1]** - [Why it matches their needs]
2. **[Skill 2]** - [Why it matches their needs]
3. **[Skill 3]** - [Why it matches their needs]

### Value Proposition
<!-- AI_PITCH: Use in opening/closing statements -->

[Write your custom pitch tailored to this specific job. How do your skills directly solve their problems? What unique value do you bring?]

### Competitive Advantages
1. **[Advantage 1]** - [Why it matters for this project]
2. **[Advantage 2]** - [Why it matters for this project]
3. **[Advantage 3]** - [Why it matters for this project]

---

## Discovery Questions to Ask
<!-- AI_USAGE: Ask naturally when information is missing -->

### Project Understanding (AI Priority: Ask early)
- [Question about business objectives]
- [Question about user pain points]
- [Question about success metrics]

### Technical Requirements (AI Priority: After scope clarification)
- [Question about tech stack]
- [Question about integrations]
- [Question about performance requirements]

### Business Context (AI Priority: Timeline/budget clarity)
- [Question about timeline]
- [Question about budget]
- [Question about team structure]

### Compliance & Security (AI Priority: For regulated industries)
- [Question about compliance requirements]
- [Question about security standards]
- [Question about audit needs]

---

## Red Flags / Concerns
<!-- AI_RISK_ASSESSMENT: Mention if relevant during negotiation -->

### [Concern Category 1]
- [Specific concern] - [Risk level] - [Mitigation strategy]

### [Concern Category 2]
- [Specific concern] - [Risk level] - [Mitigation strategy]

---

## Interview Strategy
<!-- AI_TALKING_POINTS: Use in conversation flow -->

### Opening Statement
[Write your confident introduction highlighting relevant experience and expressing interest in their specific project]

### Key Talking Points
1. **[Point 1]**: [How to discuss this]
2. **[Point 2]**: [How to discuss this]
3. **[Point 3]**: [How to discuss this]

### Questions to Ask (Prioritized)
1. [Most important question]
2. [Second most important question]
3. [Third most important question]

### Closing Statement
[Write your closing statement summarizing key value points and suggesting next steps]

---

<!-- META-INSTRUCTION FOR AI SYSTEMS -->
<!--
  When this file is truncated to 300 chars for real-time suggestions:
  
  Expected Output:
  "Job Analysis: [Position Title]
   Company: [Company] | Position: [Job Title]
   Industry: [Industry] | Timeline: [Timeline]
   Key Requirements: [Tech 1], [Tech 2], [Compliance]..."
   
  This gives AI:
  - Job context (industry, compliance requirements)
  - Required tech stack
  - Timeline constraints
  - Compliance focus
  
  AI can then:
  - Mention relevant experience from resume ✓
  - Reference required technologies ✓
  - Discuss compliance expertise ✓
  - Address timeline with methodology ✓
-->