<!-- 
  AI_META_INSTRUCTIONS:
  - PURPOSE: Professional resume for AI-powered interview suggestions
  - PROCESSING: Extract technical skills, match to job requirements
  - TRUNCATION: First 400 chars contain core identity + critical skills
  - PRIORITY: CRITICAL - Used in every real-time suggestion (300ms)
  - INTENT_TRIGGERS: experience_inquiry, technical_discussion, skill_matching
  - CODE_REFERENCES: suggestionPromptBuilder.ts:33-36, reasoningEngine.ts:254-256
-->

# [YOUR NAME] - [YOUR TITLE]

**Core Identity**: [Brief professional identity - e.g., "Full-stack developer specializing in web applications"]  
**Tech Stack**: [Primary technologies - e.g., "React, Node.js, PostgreSQL, TypeScript"]  
**Industries**: [Your industry experience - e.g., "Healthcare (HIPAA), Finance (SOX), E-commerce"]

**Contact**: [Your Email] | [Your Phone] | [LinkedIn] | [GitHub]

---

## Professional Summary
<!-- AI_PROCESSING_HINT: Use for "tell me about yourself" questions -->
<!-- PUT HERE: 2-3 sentences about your professional background and unique value proposition -->

[Write 2-3 sentences about your professional background, years of experience, and what makes you unique. This will be used when AI answers "tell me about yourself" questions.]

---

## Technical Skills
<!-- AI_PROCESSING: Match to job requirements -->
<!-- AI_PRIORITY: High - First checked for skill alignment -->
<!-- TRUNCATION_TARGET: Critical skills in first 200 chars -->

### Frontend Development
<!-- AI_MATCH_FIRST: Primary skills for requirement matching -->
- **[Technology 1]**: [Years of experience] - [Specific expertise]
- **[Technology 2]**: [Years of experience] - [Specific expertise]
- **[Technology 3]**: [Years of experience] - [Specific expertise]

### Backend Development
- **[Technology 1]**: [Years of experience] - [Specific expertise]
- **[Technology 2]**: [Years of experience] - [Specific expertise]
- **[Technology 3]**: [Years of experience] - [Specific expertise]

### Databases & Data
- **[Database 1]**: [Years of experience] - [Specific expertise]
- **[Database 2]**: [Years of experience] - [Specific expertise]

### DevOps & Infrastructure
- **[Tool 1]**: [Years of experience] - [Specific expertise]
- **[Tool 2]**: [Years of experience] - [Specific expertise]

### Compliance & Regulatory
<!-- AI_COMPLIANCE_DETECTION: Mention when job requires regulatory adherence -->
- **[Compliance Type]**: [Experience level] - [Specific implementation knowledge]
- **[Compliance Type]**: [Experience level] - [Specific implementation knowledge]

---

## Professional Experience

### [Job Title] | [Company Name]
**Duration**: [Start Date] - [End Date] ([Total Years])

#### [Project Name] ([Industry/Compliance Type])
<!-- AI_MATCH_KEYWORDS: [List technologies used] -->
<!-- AI_CODE_EXAMPLE: Reference for [type of questions] -->

- **Tech Stack**: [Technologies used]
- **Scale**: [Number of users, data volume, etc.]
- **Compliance**: [Any compliance requirements]
- **Features**:
  - [Feature 1]
  - [Feature 2]
  - [Feature 3]
- **Achievement**: [Quantifiable result - e.g., "Zero critical bugs in 6 months production"]

**AI should say when asked about [type of experience]**:
"[Write how AI should respond when asked about this experience - include Filipino-English style and specific details]"

---

## [Section Name - e.g., Education/Certifications/Projects]
<!-- Add more sections as needed -->

[Add your education, certifications, notable projects, etc.]

---

<!-- META-INSTRUCTION FOR AI SYSTEMS -->
<!--
  When this resume is truncated to 400 chars for real-time suggestions:
  
  Expected Output:
  "[Your Name] - [Your Title]
   Core Identity: [Brief professional identity]
   Tech Stack: [Primary technologies] | Industries: [Your industries]
   Professional Summary: [First sentence of summary]..."
   
  This gives AI:
  - Role identity
  - Experience level
  - Core tech stack
  - Industry experience
  - Unique methodology/value prop
  
  AI can then match:
  - Job requires [tech]? ✓ Check experience
  - Job requires [compliance]? ✓ Check industry experience
  - Job requires quality? ✓ Check methodology
-->