# Todo List

This file tracks the remaining tasks for the Dadaocheng Exploration Mission project.

## High Priority

- [ ] **Deploy to Zeabur**
  - [ ] Successfully deploy the `dadaocheng-website` (frontend) service.
  - [ ] Successfully deploy the `dadaocheng-backend` (backend) service.
  - [ ] Configure environment variables for both services (e.g., `VITE_API_BASE_URL`).

- [ ] **Integrate Supabase**
  - [ ] **Backend**: 
    - [ ] Replace local SQLite database with Supabase PostgreSQL.
    - [ ] Update database connection string in the backend configuration.
    - [ ] Install `supabase` and `psycopg2-binary` packages.
  - [ ] **File Storage**:
    - [ ] Replace local file upload logic with Supabase Storage.
    - [ ] Modify the `UploadedFile` model to store the file URL instead of a local path.
    - [ ] Update the upload endpoint to use the Supabase client for file uploads.
  - [ ] **Environment Variables**:
    - [ ] Set up `SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_BUCKET_NAME` in the backend environment.

## Medium Priority

- [ ] **Database Migration**
  - [ ] Create a script or manually migrate existing data from `app.db` to the new Supabase database, if necessary.

- [ ] **Refine User Manual**
  - [ ] Update `website_user_manual.md` to reflect the features of the deployed application.

## Low Priority

- [ ] **Code Cleanup**
  - [ ] Remove unused code related to local file storage (`get_upload_folder`, `download_file` endpoint).
