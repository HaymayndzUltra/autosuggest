<!-- 
  AI_META_INSTRUCTIONS:
  - PURPOSE: Development methodology (AI Governor Framework)
  - PROCESSING: Use when interviewer asks about development process/quality
  - TRUNCATION: Not truncated - used in full system message only
  - PRIORITY: MEDIUM - For process/methodology questions
  - INTENT_TRIGGERS: process_inquiry, quality_questions, methodology_discussion
  - CODE_REFERENCES: PromptContext.tsx:248-251 (full content in system message)
-->

# [Your Methodology Name] - Development Process

## Overview
<!-- AI_PROCESSING_HINT: Use when asked "How do you ensure quality?" or "What's your development process?" -->

[Your methodology name] is a [brief description of your development system] that delivers:
- **[Benefit 1]** - [Specific improvement/result]
- **[Benefit 2]** - [Specific improvement/result]
- **[Benefit 3]** - [Specific improvement/result]
- **[Benefit 4]** - [Specific improvement/result]

**AI should say when asked about development process**:
"[Write how AI should respond when asked about your development process - include Filipino-English style and specific benefits]"

---

## [Number]-Phase Development Process

### Phase 1: [Phase Name - e.g., Planning & Validation]
<!-- AI_CODE_EXAMPLE: Reference when asked about planning -->

**Purpose**: [What this phase accomplishes]

**Deliverables**:
- `[file1].md` - [What this file contains]
- `[file2].md` - [What this file contains]
- `[file3].md` - [What this file contains]

**Evidence Collection**:
```bash
# [Brief description of automation]
./scripts/[script_name].sh
# Verifies:
# - [Check 1]
# - [Check 2]
# - [Check 3]
```

**AI should say**:
"[Write how AI should respond when asked about this phase]"

---

### Phase 2: [Phase Name - e.g., Quality Gates]
<!-- AI_QUALITY_ASSURANCE: Reference for quality questions -->

**Purpose**: [What this phase accomplishes]

**Quality Checks** (ALL automated):
1. **[Check Category 1]**
   - [Specific check]
   - [Specific check]
   
2. **[Check Category 2]**
   - [Specific check]
   - [Specific check]
   
3. **[Check Category 3]**
   - [Specific check]
   - [Specific check]

**Code Example**:
```yaml
# [Brief description of automation file]
name: [Workflow Name]
on: [Trigger]
jobs:
  [job_name]:
    runs-on: [Environment]
    steps:
      - name: [Step 1]
        run: [Command]
      - name: [Step 2]
        run: [Command]
```

**AI should say**:
"[Write how AI should respond when asked about quality assurance]"

---

### Phase 3: [Phase Name - e.g., Evidence Collection]
<!-- AI_COMPLIANCE: Use for audit/compliance questions -->

**Purpose**: [What this phase accomplishes]

**Evidence Types**:
1. **[Evidence Type 1]**
   - [Specific evidence]
   - [Specific evidence]

2. **[Evidence Type 2]**
   - [Specific evidence]
   - [Specific evidence]

**Code Example**:
```[language]
// [Brief description of what this code does]
async function [function_name]([parameters]) {
  const evidence = {
    [field1]: [value],
    [field2]: [value],
    // [Additional fields]
  };
  
  // [What happens with the evidence]
  await [action](evidence);
}
```

**AI should say**:
"[Write how AI should respond when asked about evidence/compliance]"

---

### Phase 4: [Phase Name - e.g., CI/CD Pipeline]
<!-- AI_DEPLOYMENT: Use for deployment questions -->

**Purpose**: [What this phase accomplishes]

**Pipeline Stages**:
1. **[Stage 1]**
   - [Specific step]
   - [Specific step]

2. **[Stage 2]**
   - [Specific step]
   - [Specific step]

3. **[Stage 3]**
   - [Specific step]
   - [Specific step]

**Code Example**:
```yaml
# [Brief description of pipeline]
name: [Pipeline Name]
on:
  [trigger]: [branches]
jobs:
  [job_name]:
    runs-on: [environment]
    steps:
      - uses: [action]
      - run: [command]
```

**AI should say**:
"[Write how AI should respond when asked about deployment]"

---

### Phase 5: [Phase Name - e.g., Continuous Monitoring]
<!-- AI_MONITORING: Use for maintenance/support questions -->

**Purpose**: [What this phase accomplishes]

**Monitoring Types**:
1. **[Monitoring Type 1]**
   - [Specific check]
   - [Specific check]

2. **[Monitoring Type 2]**
   - [Specific check]
   - [Specific check]

**Code Example**:
```[language]
// [Brief description of monitoring script]
async function [function_name]() {
  const checks = {
    [check1]: await [check_function1](),
    [check2]: await [check_function2](),
    // [Additional checks]
  };
  
  // [What happens with the results]
  if (!checks.[check1].healthy) {
    await [alert_action]('[message]', checks.[check1]);
  }
}
```

**AI should say**:
"[Write how AI should respond when asked about monitoring/maintenance]"

---

### Phase 6: [Phase Name - e.g., Compliance Automation]
<!-- AI_COMPLIANCE_AUTOMATION: Reference for regulatory questions -->

**Purpose**: [What this phase accomplishes]

**Compliance Checks**:
1. **[Compliance Type 1]**
   - [Specific check]
   - [Specific check]

2. **[Compliance Type 2]**
   - [Specific check]
   - [Specific check]

**Code Example**:
```[language]
// [Brief description of compliance check]
async function verify[ComplianceType]Compliance() {
  const compliance = {
    [check_area1]: {
      [sub_check1]: await [check_function1](),
      [sub_check2]: await [check_function2](),
      status: '[status]'
    },
    // [Additional check areas]
  };
  
  // [What happens with the results]
  await [report_function].create({
    type: '[compliance_type]',
    timestamp: new Date(),
    checks: compliance,
    overall: [overall_check](compliance)
  });
}
```

**AI should say**:
"[Write how AI should respond when asked about compliance automation]"

---

## Results & Achievements

### [Achievement Category 1]
- **[Specific achievement]** - [Quantifiable result]
- **Reason**: [Why this was achieved]
- **Evidence**: [How this is measured/proven]

### [Achievement Category 2]
- **[Specific achievement]** - [Quantifiable result]
- **Reason**: [Why this was achieved]
- **Evidence**: [How this is measured/proven]

---

<!-- META-INSTRUCTION FOR AI SYSTEMS -->
<!--
  This file is NOT truncated (used in full system message).
  
  When to reference:
  1. "How do you ensure quality?" → Phase 2: Quality Gates
  2. "What's your development process?" → [Number]-Phase overview
  3. "How do you handle compliance?" → Phase 6: Compliance Automation
  4. "How fast can you deliver?" → Results section ([specific improvement])
  5. "How do you deploy?" → Phase 4: CI/CD Pipeline
  6. "How do you monitor production?" → Phase 5: Continuous Monitoring
  
  Example AI responses:
  Q: "How do you ensure code quality?"
  A: "[Write example response referencing quality gates and automation]"
  
  Q: "How fast can you deliver this project?"
  A: "[Write example response referencing methodology benefits and timeline]"
-->