# STATE.JSON TEMPLATE

```json
{
  "timestamp": "2024-10-12T15:30:00Z",
  "project_name": "Project Name",
  "phase": "planning|implementation|testing|done",
  "step_number": 42,
  "current_task": {
    "id": "task-42",
    "description": "Implement user login endpoint",
    "file": "src/auth/login.ts",
    "progress": "60%",
    "status": "in_progress"
  },
  "completed_tasks": [
    "setup-project",
    "create-database-schema",
    "implement-user-model"
  ],
  "next_tasks": [
    "add-jwt-refresh",
    "implement-rate-limiting",
    "write-auth-tests"
  ],
  "critical_state": {
    "database": "PostgreSQL, schema created, migrations run",
    "auth_strategy": "JWT with refresh tokens",
    "api_style": "RESTful",
    "testing": "Jest configured"
  },
  "key_decisions": [
    "Using JWT (not sessions) for stateless API",
    "bcrypt with 10 rounds for password hashing",
    "PostgreSQL for ACID compliance"
  ],
  "blockers": [],
  "last_action": "Added JWT token generation logic to loginHandler",
  "context_snapshot": {
    "important_vars": {
      "JWT_SECRET": "in .env file",
      "DB_URL": "postgresql://localhost:5432/projectdb"
    },
    "important_files": [
      "src/auth/login.ts",
      "src/models/User.ts",
      "src/database/schema.sql"
    ],
    "important_functions": [
      "loginHandler (src/auth/login.ts:30)",
      "generateTokens (src/auth/login.ts:45)"
    ]
  }
}
```

## USAGE INSTRUCTIONS

### Update After EVERY Step
1. Increment step_number
2. Update current_task with new progress
3. Move completed tasks to completed_tasks array
4. Update last_action with what you just did
5. Update context_snapshot if important info changed

### Critical Fields to Always Update
- **timestamp**: Current time
- **step_number**: Increment each step
- **current_task**: What you're working on now
- **last_action**: What you just completed
- **next_tasks**: What's coming up

### Context Snapshot Fields
- **important_vars**: Environment variables, config values
- **important_files**: Key files you're working with
- **important_functions**: Specific functions and their locations

### Recovery Fields
- **critical_state**: High-level project state
- **key_decisions**: Architectural choices made
- **blockers**: Any issues preventing progress

## EXAMPLE UPDATES

### After Completing a Task
```json
{
  "step_number": 43,
  "current_task": {
    "id": "task-43",
    "description": "Add JWT refresh token logic",
    "file": "src/auth/login.ts",
    "progress": "0%",
    "status": "in_progress"
  },
  "completed_tasks": [
    "setup-project",
    "create-database-schema", 
    "implement-user-model",
    "implement-user-login"
  ],
  "last_action": "Completed loginHandler with JWT access token generation"
}
```

### When Moving to New File
```json
{
  "current_task": {
    "id": "task-44",
    "description": "Create refresh token endpoint",
    "file": "src/auth/refresh.ts",
    "progress": "0%",
    "status": "in_progress"
  },
  "context_snapshot": {
    "important_files": [
      "src/auth/login.ts",
      "src/auth/refresh.ts",
      "src/models/User.ts"
    ]
  }
}
```

### When Adding Blocker
```json
{
  "blockers": [
    {
      "task_id": "task-45",
      "description": "Need to install express-rate-limit package",
      "type": "dependency",
      "created_at": "2024-10-12T16:00:00Z"
    }
  ]
}
```

### When Removing Blocker
```json
{
  "blockers": [],
  "last_action": "Installed express-rate-limit and implemented rate limiting"
}
```

