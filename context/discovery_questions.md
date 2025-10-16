<!-- 
  AI_META_INSTRUCTIONS:
  - PURPOSE: Strategic questions to ask during discovery calls
  - PROCESSING: Use naturally when information is missing
  - TRUNCATION: Not truncated - used in full system message only
  - PRIORITY: HIGH - Improves conversation flow
  - INTENT_TRIGGERS: question, technical_discussion, experience_inquiry
  - CODE_REFERENCES: PromptContext.tsx:253-257 (full content + special instruction)
-->

# Discovery Questions Database

## Purpose
This file contains strategic questions to ask during discovery calls when information is missing. The AI uses these questions naturally to gather critical information for better interview responses.

**Special AI Instruction**: Use the discovery questions above naturally. After each answer, check if the interviewer already shared the needed details. If not, ask the next most relevant question—never skip critical gaps.

---

## [Question Category 1 - e.g., Project Understanding] (AI Priority: Ask Early)
<!-- AI_USAGE: When interviewer is vague about project scope -->

### [Subcategory 1 - e.g., Business Objectives]
- [Question about business goals]
- [Question about problems being solved]
- [Question about success metrics]

### [Subcategory 2 - e.g., Project Scope]
- [Question about MVP vs future features]
- [Question about critical vs nice-to-have features]
- [Question about timeline expectations]

---

## [Question Category 2 - e.g., Technical Requirements] (AI Priority: After scope clarification)
<!-- AI_USAGE: When tech stack or architecture is unclear -->

### [Subcategory 1 - e.g., Technology Stack]
- [Question about current tech stack]
- [Question about existing system integrations]
- [Question about technology preferences]

### [Subcategory 2 - e.g., Architecture & Performance]
- [Question about scalability requirements]
- [Question about user volume expectations]
- [Question about performance requirements]

### [Subcategory 3 - e.g., Integration Requirements]
- [Question about third-party services]
- [Question about API requirements]
- [Question about data migration needs]

---

## [Question Category 3 - e.g., Business Context] (AI Priority: Timeline/budget clarity)
<!-- AI_USAGE: When timeline or budget is unclear -->

### [Subcategory 1 - e.g., Timeline & Resources]
- [Question about project timeline]
- [Question about budget range]
- [Question about team structure]

### [Subcategory 2 - e.g., Communication & Collaboration]
- [Question about communication preferences]
- [Question about key stakeholders]
- [Question about update frequency]

### [Subcategory 3 - e.g., Business Constraints]
- [Question about regulatory requirements]
- [Question about security requirements]
- [Question about budget flexibility]

---

## [Question Category 4 - e.g., Compliance & Security] (AI Priority: For regulated industries)
<!-- AI_USAGE: Auto-detect compliance keywords in job post -->

### [Subcategory 1 - e.g., Regulatory Requirements]
- [Question about specific compliance types]
- [Question about data protection requirements]
- [Question about audit documentation needs]

### [Subcategory 2 - e.g., Data Handling]
- [Question about sensitive data handling]
- [Question about data retention policies]
- [Question about encryption requirements]

### [Subcategory 3 - e.g., Security Standards]
- [Question about security frameworks]
- [Question about audit requirements]
- [Question about incident response procedures]

---

## [Question Category 5 - e.g., Success Metrics & Maintenance] (AI Priority: Post-launch expectations)
<!-- AI_USAGE: When discussing ongoing support -->

### [Subcategory 1 - e.g., Performance Expectations]
- [Question about performance benchmarks]
- [Question about user engagement metrics]
- [Question about KPIs]

### [Subcategory 2 - e.g., Ongoing Support]
- [Question about maintenance expectations]
- [Question about update handling]
- [Question about disaster recovery]

### [Subcategory 3 - e.g., Future Enhancements]
- [Question about planned features]
- [Question about feature prioritization]
- [Question about scope change handling]

---

## Industry-Specific Questions

### [Industry 1 - e.g., Healthcare] ([Compliance Type - e.g., HIPAA])
- [Industry-specific question 1]
- [Industry-specific question 2]
- [Industry-specific question 3]

### [Industry 2 - e.g., Finance] ([Compliance Type - e.g., SOX/PCI])
- [Industry-specific question 1]
- [Industry-specific question 2]
- [Industry-specific question 3]

### [Industry 3 - e.g., E-commerce] ([Compliance Type - e.g., PCI/GDPR])
- [Industry-specific question 1]
- [Industry-specific question 2]
- [Industry-specific question 3]

---

## Sample Question Flow Examples

### Example 1: [Project Type - e.g., Healthcare Project]
1. "[Question about project type]" ([Question Category])
2. "[Question about compliance]" ([Question Category])
3. "[Question about technical integration]" ([Question Category])
4. "[Question about timeline]" ([Question Category])

### Example 2: [Project Type - e.g., E-commerce Project]
1. "[Question about product type]" ([Question Category])
2. "[Question about payment processing]" ([Question Category])
3. "[Question about traffic expectations]" ([Question Category])
4. "[Question about budget]" ([Question Category])

### Example 3: [Project Type - e.g., SaaS Application]
1. "[Question about problem solving]" ([Question Category])
2. "[Question about architecture]" ([Question Category])
3. "[Question about scalability]" ([Question Category])
4. "[Question about monetization]" ([Question Category])

---

## AI Usage Guidelines

### When to Ask Questions
- **Early in conversation**: [Question Category] questions
- **After scope clarification**: [Question Category] questions
- **When discussing timeline**: [Question Category] questions
- **For regulated industries**: [Question Category] questions
- **Before closing**: [Question Category] questions

### How to Ask Naturally
- Use Filipino-English style: "[Example question in Filipino-English]"
- Be conversational: "[Example conversational question]"
- Show genuine interest: "[Example interested question]"
- Follow up appropriately: "[Example follow-up question]"

### Question Prioritization
1. **Critical gaps**: [Type of information needed for accurate responses]
2. **Technical fit**: [Type of information for skills alignment]
3. **Business fit**: [Type of information for timeline/budget alignment]
4. **Compliance fit**: [Type of information for regulatory requirements]

---

<!-- META-INSTRUCTION FOR AI SYSTEMS -->
<!--
  This file is NOT truncated (used in full system message).
  
  Special instruction from PromptContext.tsx line 256:
  "Use the discovery questions above naturally. After each answer, check if the 
   interviewer already shared the needed details. If not, ask the next most 
   relevant question—never skip critical gaps."
  
  When to reference:
  1. Interviewer is vague about project scope → Use [Question Category] questions
  2. Tech stack unclear → Use [Question Category] questions
  3. Timeline/budget unclear → Use [Question Category] questions
  4. Regulated industry mentioned → Use [Question Category] questions
  5. Discussing ongoing support → Use [Question Category] questions
  
  Example AI usage:
  Q: "[Example vague statement]"
  A: "[Example response with follow-up question]"
  
  Q: "[Example technical statement]"
  A: "[Example response with technical follow-up question]"
-->