# RESUME.MD TEMPLATE

```markdown
# RECOVERY & RESUME INSTRUCTIONS

## Current State Summary
- **Phase**: Implementation (60% complete)
- **Working on**: User authentication system
- **Current file**: src/auth/login.ts
- **Last completed**: JWT token generation
- **Step number**: 25

## Project Structure
```
src/
  ├── auth/
  │   ├── register.ts ✓ (working)
  │   ├── login.ts ⟳ (in progress - 60%)
  │   ├── refresh.ts ✓ (working)
  │   └── middleware.ts ✓ (working)
  ├── models/
  │   └── User.ts ✓ (working)
  ├── database/
  │   └── schema.sql ✓ (applied)
  └── tests/
      └── auth.test.ts ✓ (working)
```

## What's Working
✓ User registration endpoint (/api/register)
✓ Password hashing (bcrypt, 10 rounds)
✓ JWT token generation
✓ User model with validation
✓ Database connection and schema
✓ Refresh token endpoint (/api/refresh)
✓ JWT verification middleware

## What's In Progress
⟳ Login endpoint (60% done)
  - Token generation: DONE
  - Refresh token logic: DONE
  - Rate limiting: TODO (next step)
  - Error handling: DONE

## What's Next (Priority Order)
1. Add rate limiting middleware to auth endpoints (5 attempts per 15 min)
2. Implement logout endpoint (/api/logout)
3. Write integration tests for complete auth flow
4. Add input validation for all auth endpoints
5. Implement password reset functionality

## Critical Context to Remember
- JWT access token expires in 1 hour
- Refresh token expires in 7 days
- Tokens stored in httpOnly cookies
- Rate limiting per IP address
- Using PostgreSQL (not MongoDB)
- API is RESTful (not GraphQL)
- Database name: projectdb
- JWT secret in .env as JWT_SECRET

## Exact Next Steps to Resume
1. Open src/auth/login.ts
2. Find the loginHandler function (around line 30)
3. After JWT token generation (line 45)
4. Add rate limiting middleware using express-rate-limit
5. Configure: 5 attempts per 15 minutes per IP
6. Test the rate limiting works
7. Update state.json when done
8. Move to next task (logout endpoint)

## Dependencies & Environment
- Node.js 18.x
- TypeScript 5.x
- PostgreSQL 15.x running on localhost:5432
- Database name: projectdb
- JWT secret in .env as JWT_SECRET
- All dependencies installed (see package.json)
- express-rate-limit package needs to be installed

## Known Issues
- None currently

## Files Modified in This Session
1. src/auth/register.ts
2. src/auth/login.ts
3. src/auth/refresh.ts
4. src/models/User.ts
5. src/database/schema.sql
6. src/auth/middleware.ts
7. src/tests/auth.test.ts

## Key Functions and Locations
- loginHandler: src/auth/login.ts:30
- generateTokens: src/auth/login.ts:45
- verifyToken: src/auth/middleware.ts:15
- registerHandler: src/auth/register.ts:25
- refreshHandler: src/auth/refresh.ts:20

## Database Schema Status
- users table: ✓ created
- sessions table: ✓ created
- migrations: ✓ applied
- indexes: ✓ created

## Test Status
- Unit tests: ✓ passing
- Integration tests: ⟳ in progress
- Auth flow tests: ✓ passing
- Rate limiting tests: TODO

## Environment Variables Required
```
JWT_SECRET=your-secret-key-here
DB_URL=postgresql://localhost:5432/projectdb
PORT=3000
NODE_ENV=development
```

## Package Dependencies Status
- express: ✓ installed
- pg: ✓ installed
- bcrypt: ✓ installed
- jsonwebtoken: ✓ installed
- express-rate-limit: TODO (needs installation)
- jest: ✓ installed
- supertest: ✓ installed

## Recovery Checklist
If you're resuming after context loss:
- [ ] Read state.json to get current step
- [ ] Read this resume.md file
- [ ] Check progress.md for recent actions
- [ ] Verify database is running
- [ ] Check .env file has required variables
- [ ] Run tests to verify current state
- [ ] Continue from "Exact Next Steps" above

## Quick Commands
```bash
# Start database
pg_ctl start

# Run tests
npm test

# Start development server
npm run dev

# Check database connection
psql projectdb -c "SELECT version();"
```

## Emergency Contacts
If you encounter blocking issues:
1. Check error logs in console
2. Verify all dependencies installed
3. Check database connection
4. Validate .env file
5. Run tests to identify issues
6. Document issue in state.json if unresolved
```

## USAGE INSTRUCTIONS

### Update Every 10 Steps
1. Update "Current State Summary" section
2. Update "What's Working" with completed features
3. Update "What's In Progress" with current task
4. Update "What's Next" with upcoming tasks
5. Update "Files Modified" list
6. Update "Key Functions and Locations"
7. Update "Exact Next Steps" with specific instructions

### Recovery Protocol
When AI needs to resume:
1. Read this file first
2. Follow "Recovery Checklist"
3. Execute "Exact Next Steps"
4. Update state.json when continuing

### Critical Sections to Always Update
- **Current State Summary**: Where you are now
- **What's Working**: Completed features
- **What's In Progress**: Current task details
- **Exact Next Steps**: Specific instructions to continue
- **Files Modified**: Track all changes
- **Known Issues**: Any blockers or problems

### Emergency Information
Always include:
- Database connection details
- Required environment variables
- Key file locations
- Critical function names and line numbers
- Package dependencies status
- Test status
- Quick commands for verification

