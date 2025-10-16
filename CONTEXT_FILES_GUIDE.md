# Context Files Architecture & Meta-Instruction Guide

> **Purpose**: Comprehensive documentation explaining how AI systems process context files for interview assistance, including code examples and meta-instruction alignment for other AI systems.

---

## Table of Contents

- [System Architecture Overview](#system-architecture-overview)
- [AI Processing Pipeline](#ai-processing-pipeline)
- [File-by-File Breakdown](#file-by-file-breakdown)
- [Code Integration Examples](#code-integration-examples)
- [Meta-Instruction Conventions](#meta-instruction-conventions)
- [Template Guidelines](#template-guidelines)

---

## System Architecture Overview

### How Context Files Flow Through the System

```
┌──────────────────────┐
│  Context Files       │
│  (context/*.md)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  PromptContext.tsx   │  ← Loads files via IPC
│  loadContextFromFiles()│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  AI Processing (3 Parallel Paths)   │
├──────────────────────────────────────┤
│  1. suggestionPromptBuilder.ts       │  ← Real-time suggestions (300-400 chars)
│  2. reasoningEngine.ts               │  ← Intent detection (300-500 chars)
│  3. buildSystemMessage()             │  ← Full context (complete files)
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────┐
│  OpenAI GPT-4 API    │  ← Generates interview responses
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  User Interface      │  ← Displays suggestions in 300ms
└──────────────────────┘
```

### Code Reference Points

**File Loading** (`src/contexts/PromptContext.tsx` lines 302-313):
```typescript
const loadContextFromFiles = useCallback(async () => {
  try {
    const contextFiles = await window.electronAPI.loadContextFiles();
    if (contextFiles?.data) {
      setContextData({
        resume: contextFiles.data.resume || '',
        jobPost: contextFiles.data.jobPost || '',
        discoveryQuestions: contextFiles.data.discoveryQuestions || '',
        skillsKnowledge: contextFiles.data.skillsKnowledge || '',
        workflowMethod: contextFiles.data.workflowMethod || '',
      });
    }
  } catch (err) {
    console.error('Failed to load context files:', err);
  }
}, []);
```

---

## AI Processing Pipeline

### Step-by-Step Code Flow

#### Step 1: File Loading via IPC Handler

**Location**: `src/index.ts` (IPC handler for context files)

```typescript
ipcMain.handle('load-context-files', async () => {
  try {
    const contextDir = path.join(__dirname, '../context');
    const resume = await fs.readFile(path.join(contextDir, 'resume.md'), 'utf-8');
    const jobPost = await fs.readFile(path.join(contextDir, 'current_job.md'), 'utf-8');
    const discoveryQuestions = await fs.readFile(path.join(contextDir, 'discovery_questions.md'), 'utf-8');
    const skillsKnowledge = await fs.readFile(path.join(contextDir, 'skills_knowledge.md'), 'utf-8');
    const workflowMethod = await fs.readFile(path.join(contextDir, 'workflow_method.md'), 'utf-8');
    
    return {
      success: true,
      data: { resume, jobPost, discoveryQuestions, skillsKnowledge, workflowMethod }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

#### Step 2: Truncation for Real-Time Suggestions

**Location**: `src/utils/suggestionPromptBuilder.ts` lines 33-41

```typescript
// Add essential context
if (contextData.resume) {
  parts.push(`\n=== YOUR PROFILE ===`);
  parts.push(this.truncateText(contextData.resume, 400));  // 400 chars
}

if (contextData.jobPost) {
  parts.push(`\n=== JOB REQUIREMENTS ===`);
  parts.push(this.truncateText(contextData.jobPost, 300));  // 300 chars
}
```

**Truncation Strategy**:
- `resume.md`: 200-500 chars (depending on use case)
- `current_job.md`: 150-300 chars
- Other files: Full content in system message, truncated in real-time

#### Step 3: Full Context in System Message

**Location**: `src/contexts/PromptContext.tsx` lines 233-256

```typescript
// Add context data if available
if (contextData.resume) {
  parts.push('=== CANDIDATE PROFILE (YOUR RESUME) ===');
  parts.push(contextData.resume);  // FULL CONTENT
}

if (contextData.jobPost) {
  parts.push('=== CURRENT JOB POST ===');
  parts.push(contextData.jobPost);  // FULL CONTENT
}

if (contextData.skillsKnowledge) {
  parts.push('=== YOUR SKILLS & KNOWLEDGE ===');
  parts.push(contextData.skillsKnowledge);  // FULL CONTENT
}

if (contextData.workflowMethod) {
  parts.push('=== YOUR DEVELOPMENT METHODOLOGY ===');
  parts.push(contextData.workflowMethod);  // FULL CONTENT
}

if (contextData.discoveryQuestions) {
  parts.push('=== DISCOVERY QUESTIONS TO ASK WHEN INFORMATION IS MISSING ===');
  parts.push(contextData.discoveryQuestions);  // FULL CONTENT
  parts.push('Use the discovery questions above naturally...');
}
```

---

## File-by-File Breakdown

### 1. `context/resume.md`

**Purpose**: Professional resume and experience database for AI-powered suggestions

**Usage Locations**:
1. `suggestionPromptBuilder.ts` (lines 33-36): Truncated to 400 chars
2. `reasoningEngine.ts` (lines 254-256): Truncated to 500 chars
3. `PromptContext.tsx` (lines 233-236): Full content

**Effectiveness Rating**: ⭐⭐⭐⭐⭐ **CRITICAL** (Used 3x)

**AI Processing Example**:

```typescript
// Real-time suggestion (300ms response time)
const resumeSnippet = truncateText(resume, 400);
// Result: "Full-Stack Developer with 5+ years experience.
//          Skills: React, Node.js, PostgreSQL. 
//          Healthcare HIPAA compliance projects..."
```

**Meta-Instruction Annotations** (Add to file):

```markdown
<!-- AI_PROCESSING_HINT: Extract technical skills for requirement matching -->
<!-- AI_PRIORITY: High - Used in every real-time suggestion -->
<!-- TRUNCATION_TARGET: First 400 chars should contain critical info -->

## Technical Skills
<!-- AI_SKILL_EXTRACTION: Match to job requirements -->
- Frontend: React (5+ years), Angular, Next.js, TypeScript
- Backend: Node.js, Django, FastAPI, NestJS
- Databases: PostgreSQL, MongoDB
```

---

### 2. `context/current_job.md`

**Purpose**: Job posting analysis with requirements, strategy, and discovery questions

**Usage Locations**:
1. `suggestionPromptBuilder.ts` (lines 38-41): Truncated to 300 chars
2. `reasoningEngine.ts` (lines 258-260): Truncated to 300 chars
3. `PromptContext.tsx` (lines 238-241): Full content

**Effectiveness Rating**: ⭐⭐⭐⭐⭐ **CRITICAL** (Used 3x)

**AI Processing Example**:

```typescript
// Interview question: "Tell me about your experience with microservices"

// WITHOUT current_job.md:
AI: "I have experience with microservices architecture..." (Generic)

// WITH current_job.md (knows job requires Node.js microservices):
AI: "Ah, sa Project X ko ginawa yun - three microservices using Node.js and Docker.
     Aligned din yan sa requirement ninyo for distributed systems, diba?"
```

**Meta-Instruction Annotations**:

```markdown
<!-- AI_PROCESSING_HINT: Match user skills to job requirements -->
<!-- AI_CONTEXT_AWARE: Use tech stack for specific examples -->
<!-- TRUNCATION_TARGET: First 300 chars = job title, key requirements, tech stack -->

# Job Analysis: Senior React Developer

## Key Requirements
<!-- AI_REQUIREMENT_MATCHING: Extract for skill alignment -->
- React (5+ years) ← AI matches to resume
- Node.js backend ← AI knows to mention Node.js projects
- HIPAA compliance ← AI prioritizes healthcare experience
```

---

### 3. `context/skills_knowledge.md`

**Purpose**: Comprehensive technical skills database with compliance expertise

**Usage Locations**:
1. `PromptContext.tsx` (lines 243-246): Full content in system message

**Effectiveness Rating**: ⭐⭐⭐⭐ **HIGH** (Supplements resume)

**AI Processing Example**:

```markdown
<!-- AI_PROCESSING_HINT: Categorize by priority for quick lookup -->
<!-- AI_COMPLIANCE_KEYWORDS: HIPAA, SOX, PCI, GDPR, SOC2 -->

## Primary Skills (AI Priority: Highest)
<!-- AI_MATCH_FIRST: These are go-to skills for requirements -->
- React ecosystem: Hooks, Context API, Redux, Next.js
- Node.js: Express, NestJS, FastAPI migration experience
- Databases: PostgreSQL optimization, MongoDB aggregation

## Compliance Expertise (AI Priority: High for regulated industries)
<!-- AI_COMPLIANCE_DETECTION: Mention when job requires regulatory adherence -->
- **HIPAA**: Patient data encryption, audit trails, role-based access
- **SOX**: Financial reporting controls, documentation, change management
- **PCI**: Payment tokenization, secure card handling, PCI-DSS Level 1
```

---

### 4. `context/workflow_method.md`

**Purpose**: Development methodology (AI Governor Framework)

**Usage Locations**:
1. `PromptContext.tsx` (lines 248-251): Full content in system message

**Effectiveness Rating**: ⭐⭐⭐ **MEDIUM** (For process questions)

**AI Processing Example**:

```markdown
<!-- AI_PROCESSING_HINT: Use when interviewer asks about development process -->
<!-- AI_METHODOLOGY_KEYWORDS: quality, testing, deployment, automation -->

# AI Governor Framework

## 6-Phase Development Process
<!-- AI_PROCESS_EXPLANATION: Reference when asked "How do you ensure quality?" -->

1. **Planning & Validation** (Evidence: `planning.md`)
   - Code: Structured planning with acceptance criteria
   - AI should mention: "I use structured planning with evidence at each step"

2. **Quality Gates** (Evidence: `quality_gates.md`)
   - Code: 50+ automation scripts for validation
   - AI should mention: "Automated validation catches issues before merge"

3. **Zero Critical Bugs Achievement**
   - Code: Continuous monitoring, health checks
   - AI should mention: "Zero critical bugs in first 3 months production"
```

---

### 5. `context/discovery_questions.md`

**Purpose**: Strategic questions to ask during discovery calls

**Usage Locations**:
1. `PromptContext.tsx` (lines 253-257): Full content + special instruction

**Effectiveness Rating**: ⭐⭐⭐⭐ **HIGH** (Improves conversation flow)

**AI Processing Example**:

```markdown
<!-- AI_PROCESSING_HINT: Use naturally when information is missing -->
<!-- AI_INTENT_DETECTION: Question, technical_discussion, experience_inquiry -->

## Project Understanding (AI Priority: Ask early)
<!-- AI_USAGE: When interviewer is vague about project scope -->
- What are the main business objectives for this project?
- What specific problems does this project aim to solve?
- Who are the primary users and what are their pain points?

## Technical Requirements (AI Priority: After scope clarification)
<!-- AI_USAGE: When tech stack or architecture is unclear -->
- What is your current technology stack and why did you choose it?
- Are there any existing systems we need to integrate with?
- What are your scalability and performance requirements?

## Compliance & Security (AI Priority: For regulated industries)
<!-- AI_USAGE: Auto-detect HIPAA/SOX/PCI keywords in job post -->
- Are there any regulatory requirements (HIPAA, SOX, PCI, GDPR)?
- What are your data protection and privacy requirements?
```

**Special Instruction** (`PromptContext.tsx` line 256):
```typescript
parts.push('Use the discovery questions above naturally. After each answer, check if the interviewer already shared the needed details. If not, ask the next most relevant question—never skip critical gaps.');
```

---

## Code Integration Examples

### Example 1: Real-Time Suggestion Flow (300ms)

**Scenario**: Interviewer asks "Tell me about your React experience"

**Code Flow**:

1. **Transcript** (from Local ASR): "Tell me about your React experience"

2. **Intent Detection** (`reasoningEngine.ts` lines 180-220):
```typescript
private extractIntent(transcript: string): string {
  const text = transcript.toLowerCase().trim();
  
  if (text.includes('experience') || text.includes('background')) {
    return 'experience_inquiry';  // ← Detected intent
  }
  // ... other intents
}
```

3. **Prompt Building** (`suggestionPromptBuilder.ts`):
```typescript
// Resume snippet (400 chars)
const resumeContext = "Full-Stack Developer with 5+ years experience. React (Hooks, Context, Redux), Node.js backend, PostgreSQL. Healthcare HIPAA projects: patient portal (10K users), telehealth system...";

// Job post snippet (300 chars)
const jobContext = "Senior React Developer for Healthcare SaaS. Must have: React 5+ years, Node.js, HIPAA compliance. Tech stack: React, TypeScript, PostgreSQL. Timeline: 3 months MVP...";

// Final prompt
const prompt = `
CRITICAL: Generate EXACTLY ONE sentence suggestion.
=== YOUR PROFILE ===
${resumeContext}

=== JOB REQUIREMENTS ===
${jobContext}

=== CURRENT SITUATION ===
Detected Intent: experience_inquiry
Client Statement: "Tell me about your React experience"

Generate your ONE sentence response:
`;
```

4. **AI Response** (within 300ms):
```
"Ah, I have 5+ years of React experience - mostly sa healthcare projects with HIPAA compliance, 
like yung patient portal ko na may 10K users using React Hooks and TypeScript."
```

**Result**: Context-aware, job-aligned, mentions HIPAA (from both resume and job post)

---

### Example 2: System Message with Full Context

**Scenario**: User enables Auto-GPT mode for complete interview assistance

**Code Flow** (`PromptContext.tsx` lines 224-257):

```typescript
const buildSystemMessage = (): string => {
  const parts: string[] = [];
  
  parts.push('CRITICAL: You MUST follow these instructions exactly.');
  
  // FULL CONTENT - No truncation
  parts.push('=== CANDIDATE PROFILE (YOUR RESUME) ===');
  parts.push(contextData.resume);  // 2000+ chars
  
  parts.push('=== CURRENT JOB POST ===');
  parts.push(contextData.jobPost);  // 1500+ chars
  
  parts.push('=== YOUR SKILLS & KNOWLEDGE ===');
  parts.push(contextData.skillsKnowledge);  // 1000+ chars
  
  parts.push('=== YOUR DEVELOPMENT METHODOLOGY ===');
  parts.push(contextData.workflowMethod);  // 800+ chars
  
  parts.push('=== DISCOVERY QUESTIONS ===');
  parts.push(contextData.discoveryQuestions);  // 500+ chars
  parts.push('Use the discovery questions above naturally...');
  
  return parts.join('\n');  // Total: ~6000 chars
};
```

**Effect**: AI has **complete context** for comprehensive interview assistance

---

## Meta-Instruction Conventions

### Purpose of Meta-Instructions

Meta-instructions are **HTML comments** or **markdown annotations** that guide AI processing **without appearing in user-facing output**.

### Standard Conventions

#### 1. Processing Hints
```markdown
<!-- AI_PROCESSING_HINT: Extract technical skills for requirement matching -->
```
**Purpose**: Tells AI **what to extract** from this section

#### 2. Priority Markers
```markdown
<!-- AI_PRIORITY: High - Used in every real-time suggestion -->
```
**Purpose**: Tells AI **importance level** for token budget allocation

#### 3. Truncation Targets
```markdown
<!-- TRUNCATION_TARGET: First 400 chars should contain critical info -->
```
**Purpose**: Tells AI content writers **where to place** most important info

#### 4. Context-Aware Tags
```markdown
<!-- AI_CONTEXT_AWARE: Use tech stack for specific examples -->
```
**Purpose**: Tells AI **how to use** this data in responses

#### 5. Intent Detection
```markdown
<!-- AI_INTENT_DETECTION: question, technical_discussion, experience_inquiry -->
```
**Purpose**: Tells AI **when to reference** this section

#### 6. Compliance Keywords
```markdown
<!-- AI_COMPLIANCE_KEYWORDS: HIPAA, SOX, PCI, GDPR, SOC2 -->
```
**Purpose**: Tells AI **industry-specific** terms to recognize

---

### Meta-Instruction Template

```markdown
<!-- 
  AI_META_INSTRUCTIONS:
  - PURPOSE: [What this file provides]
  - PROCESSING: [How AI should extract data]
  - TRUNCATION: [First N chars contain critical info]
  - PRIORITY: [High/Medium/Low for token budget]
  - INTENT_TRIGGERS: [When to reference this data]
  - CODE_REFERENCES: [Where in codebase this is used]
-->
```

---

## Template Guidelines

### Structure for AI-Friendly Context Files

#### 1. Critical Info First (Truncation-Aware)

**BAD** (Important info buried):
```markdown
# My Resume

I'm a passionate developer who loves coding and solving problems.
I enjoy working with teams and learning new technologies.

## Technical Skills
- React, Node.js, PostgreSQL...
```

**GOOD** (Critical info in first 300 chars):
```markdown
<!-- TRUNCATION_TARGET: First 300 chars -->
# Full-Stack Developer | 5+ Years Experience

**Core Stack**: React, Node.js, PostgreSQL | **Industries**: Healthcare (HIPAA), Finance (SOX)

## Technical Skills
- React (5+ years): Hooks, Context, Redux, Next.js
- Node.js: Express, NestJS, microservices
- Databases: PostgreSQL optimization, MongoDB
```

---

#### 2. AI Processing Annotations

```markdown
## Projects
<!-- AI_PROCESSING: Match project tech stack to job requirements -->
<!-- AI_PRIORITY: High - Use for "tell me about your experience" questions -->

### Healthcare Patient Portal (HIPAA Compliant)
<!-- AI_MATCH_KEYWORDS: React, Node.js, PostgreSQL, HIPAA, healthcare -->
- **Tech Stack**: React + TypeScript, Node.js, PostgreSQL
- **Scale**: 10,000+ active users
- **Compliance**: HIPAA audit trails, encryption at rest/transit
- **Achievement**: Zero critical bugs in 3 months production
```

---

#### 3. Code Example Integration

**Include sample code** to help AI understand **what to reference**:

```markdown
## AI Governor Framework

### Quality Gates Implementation
<!-- AI_CODE_EXAMPLE: Reference when asked about quality assurance -->

```bash
# Pre-commit validation script
npm run lint
npm run test
npm run type-check
npm run security-scan
```

**AI should say**: "I use automated quality gates - linting, testing, type-checking, and security scans all run before every commit."

---

#### 4. Filipino Language Support

**Include bilingual examples** for Barok English style:

```markdown
## Technical Discussion Phrases
<!-- AI_LANGUAGE_STYLE: Filipino-English hybrid (Barok English) -->

**Question**: "How do you handle errors?"
**Response**: "Ah, sa error handling ko, may centralized logging ako tapos may retry mechanism for transient failures. Ganun ginagawa ko para resilient yung system."

**Translation Notes for AI**:
- "sa error handling ko" = "in my error handling"
- "tapos" = "then" (casual connector)
- "Ganun ginagawa ko" = "That's how I do it"
- "para resilient yung system" = "so the system is resilient"
```

---

## Token Optimization Strategies

### Understanding Token Budgets

**GPT-4 Context Window**: ~8K tokens (~32K chars)

**Budget Allocation**:
```
System Message:      2000 tokens (~8000 chars)
  ↳ Resume:           400 chars (truncated)
  ↳ Job Post:         300 chars (truncated)
  ↳ Behavior Rules:   300 chars (truncated)
  ↳ Language Guide:   200 chars (truncated)
  ↳ Response Style:   200 chars (truncated)
  
Conversation History: 3000 tokens (~12000 chars)
Current Question:     500 tokens (~2000 chars)
Response Budget:      2500 tokens (~10000 chars)
```

### Truncation Strategy Code

**Location**: `src/utils/suggestionPromptBuilder.ts` lines 127-138

```typescript
private static truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // Preserve word boundaries (don't split mid-word)
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
```

**Meta-Instruction for Content Writers**:
```markdown
<!-- TRUNCATION_STRATEGY: Word boundary preservation -->
<!-- WRITE_CONTENT: Put critical info before truncation point -->
<!-- EXAMPLE: If maxLength=400, ensure first 400 chars are self-contained -->
```

---

## Real-World Before/After Examples

### Example 1: Generic vs Context-Aware

**Interview Question**: "How do you handle database performance?"

**WITHOUT Context Files** (Generic AI):
```
"I optimize database queries by adding indexes, analyzing query execution plans, 
and implementing caching strategies where appropriate."
```

**WITH Context Files** (resume.md + current_job.md):
```
"Ah, sa previous healthcare project ko with PostgreSQL, nag-implement ako ng 
proper indexing strategy - composite indexes for patient search queries, 
partial indexes for active records lang. Bumilis ng 60% yung query time. 
Aligned din yan sa requirement ninyo for high-performance PostgreSQL, diba?"
```

**Analysis**:
- ✅ Mentions **specific project** (from resume.md)
- ✅ References **PostgreSQL** (from current_job.md tech stack)
- ✅ Uses **Barok English** (from language_guide.md)
- ✅ Shows **quantifiable result** (60% improvement)
- ✅ **Matches job requirement** explicitly

---

### Example 2: Compliance-Aware Responses

**Interview Question**: "How do you ensure data security?"

**WITHOUT Context Files**:
```
"I implement encryption, access controls, and follow security best practices."
```

**WITH Context Files** (skills_knowledge.md knows HIPAA + job requires healthcare):
```
"Sa healthcare projects ko, I follow HIPAA compliance strictly - encryption at rest 
and in transit, role-based access control with audit trails, at may automated 
compliance checks sa CI/CD pipeline. Lahat ng patient data access documented 
for audit purposes. Yan yung kailangan for HIPAA-compliant systems, diba?"
```

**Analysis**:
- ✅ **HIPAA-specific** (detected from skills_knowledge.md)
- ✅ **Industry context** (healthcare from current_job.md)
- ✅ **Concrete implementation** (RBAC, audit trails, CI/CD)
- ✅ **Conversational tone** (Barok English)

---

## Verification Checklist

### File Path Verification

Expected paths from `PromptContext.tsx` lines 203-213:

```typescript
const contextStatus = {
  resume: { path: 'context/resume.md' },
  jobPost: { path: 'context/current_job.md' },
  discoveryQuestions: { path: 'context/discovery_questions.md' },
  skillsKnowledge: { path: 'context/skills_knowledge.md' },
  workflowMethod: { path: 'context/workflow_method.md' },
};

const promptStatus = {
  behaviorRules: { path: 'prompts/behavior_rules.md' },
  languageGuide: { path: 'prompts/language_guide.md' },
  responseStyle: { path: 'prompts/response_style.md' },
};
```

### Integration Points Verification

1. **IPC Handler**: `src/index.ts` (load-context-files, load-prompt-files)
2. **Context Provider**: `src/contexts/PromptContext.tsx` (loadContextFromFiles)
3. **Suggestion Builder**: `src/utils/suggestionPromptBuilder.ts` (buildBriefPrompt)
4. **Reasoning Engine**: `src/utils/reasoningEngine.ts` (buildPrompt)
5. **System Message**: `PromptContext.tsx` (buildSystemMessage)

### Content Verification

- [ ] All files contain meta-instruction annotations
- [ ] Critical info in first 300-500 chars (truncation-aware)
- [ ] Code examples included for AI reference
- [ ] Filipino-English bilingual examples (for Barok English)
- [ ] Compliance keywords annotated (HIPAA, SOX, PCI, etc.)
- [ ] Intent-based categorization for discovery questions
- [ ] Tech stack explicitly listed for requirement matching

---

## Summary

### Key Takeaways for AI Systems

1. **Context files are processed 3 ways**:
   - Real-time suggestions: 300-500 chars (truncated)
   - Intent detection: 300-500 chars (truncated)
   - System message: Full content (all 5 files)

2. **Resume + Job Post are CRITICAL** (used 3x each)

3. **Truncation is word-boundary aware** (preserves meaning)

4. **Meta-instructions guide AI processing** (without user-facing output)

5. **Filipino-English support** via language_guide.md + keyword detection

6. **Compliance-aware** via annotated keywords (HIPAA, SOX, PCI)

7. **Code examples** help AI reference concrete implementations

### For Content Writers

- **Put critical info first** (first 300-500 chars)
- **Add meta-instruction comments** for AI guidance
- **Include code examples** for concrete references
- **Use compliance keywords** explicitly (HIPAA, SOX, PCI)
- **Provide bilingual examples** for Barok English support
- **Categorize by intent** (question, technical, experience, problem-solving)

### For AI Systems Reading This Guide

When processing context files:
1. **Check meta-instructions** first for processing hints
2. **Respect truncation targets** (first N chars are critical)
3. **Match skills to job requirements** explicitly
4. **Use Barok English style** (Filipino-English hybrid)
5. **Mention compliance** when industry requires it
6. **Reference code examples** for concrete credibility
7. **Ask discovery questions** naturally when info is missing

---

**Author**: nohairblingbling  
**Version**: 1.0.0  
**Last Updated**: 2025-01-16

For implementation details, see `src/contexts/PromptContext.tsx`, `src/utils/suggestionPromptBuilder.ts`, and `src/utils/reasoningEngine.ts`.
