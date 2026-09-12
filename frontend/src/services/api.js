import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});


// =====================================
// PROJECTS
// =====================================

export const getProjects = async () => {
  const response = await api.get("/api/projects");
  return response.data;
};

export const getProject = async (id) => {
  const response = await api.get(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (project) => {
  const response = await api.post("/api/projects", project);
  return response.data;
};

export const updateProject = async (id, project) => {
  const response = await api.put(
    `/api/projects/${id}`,
    project
  );
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(
    `/api/projects/${id}`
  );
  return response.data;
};


// =====================================
// REQUIREMENTS
// =====================================

export const getRequirements = async () => {
  const response = await api.get(
    "/api/requirements"
  );
  return response.data;
};

export const getRequirement = async (id) => {
  const response = await api.get(
    `/api/requirements/${id}`
  );
  return response.data;
};

export const createRequirement = async (requirement) => {
  const response = await api.post(
    "/api/requirements",
    requirement
  );
  return response.data;
};

export const updateRequirement = async (
  id,
  requirement
) => {
  const response = await api.put(
    `/api/requirements/${id}`,
    requirement
  );
  return response.data;
};

export const deleteRequirement = async (id) => {
  const response = await api.delete(
    `/api/requirements/${id}`
  );
  return response.data;
};


// =====================================
// TASKS
// =====================================

export const getTasks = async () => {
  const response = await api.get(
    "/api/tasks"
  );
  return response.data;
};

export const getTask = async (id) => {
  const response = await api.get(
    `/api/tasks/${id}`
  );
  return response.data;
};

export const createTask = async (task) => {
  const response = await api.post(
    "/api/tasks",
    task
  );
  return response.data;
};

export const updateTask = async (
  id,
  task
) => {
  const response = await api.put(
    `/api/tasks/${id}`,
    task
  );
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(
    `/api/tasks/${id}`
  );
  return response.data;
};


// =====================================
// USERS
// =====================================

export const getUsers = async () => {
  const response = await api.get(
    "/api/users"
  );
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(
    `/api/users/${id}`
  );
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post(
    "/api/users",
    user
  );
  return response.data;
};

export const updateUser = async (
  id,
  user
) => {
  const response = await api.put(
    `/api/users/${id}`,
    user
  );
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(
    `/api/users/${id}`
  );
  return response.data;
};


// =====================================
// BUGS
// =====================================

export const getBugs = async () => {
  const response = await api.get(
    "/api/bugs"
  );
  return response.data;
};

export const getBug = async (id) => {
  const response = await api.get(
    `/api/bugs/${id}`
  );
  return response.data;
};

export const createBug = async (bug) => {
  const response = await api.post(
    "/api/bugs",
    bug
  );
  return response.data;
};

export const updateBug = async (
  id,
  bug
) => {
  const response = await api.put(
    `/api/bugs/${id}`,
    bug
  );
  return response.data;
};

export const deleteBug = async (id) => {
  const response = await api.delete(
    `/api/bugs/${id}`
  );
  return response.data;
};


// =====================================
// TEST CASES
// =====================================

export const getTestCases = async () => {
  const response = await api.get(
    "/api/test-cases"
  );
  return response.data;
};

export const getTestCase = async (id) => {
  const response = await api.get(
    `/api/test-cases/${id}`
  );
  return response.data;
};

export const createTestCase = async (
  testCase
) => {
  const response = await api.post(
    "/api/test-cases",
    testCase
  );
  return response.data;
};

export const updateTestCase = async (
  id,
  testCase
) => {
  const response = await api.put(
    `/api/test-cases/${id}`,
    testCase
  );
  return response.data;
};

export const deleteTestCase = async (
  id
) => {
  const response = await api.delete(
    `/api/test-cases/${id}`
  );
  return response.data;
};


// =====================================
// REPOSITORY
// =====================================

export const getRepositories = async () => {
  const response = await api.get(
    "/api/repositories"
  );
  return response.data;
};

export const createRepository = async (repository) => {
  const response = await api.post(
    "/api/repositories",
    repository
  );
  return response.data;
};

export const updateRepository = async (
  id,
  repository
) => {
  const response = await api.put(
    `/api/repositories/${id}`,
    repository
  );
  return response.data;
};

export const deleteRepository = async (id) => {
  const response = await api.delete(
    `/api/repositories/${id}`
  );
  return response.data;
};

// =====================================
// CODE COMMITS
// =====================================

export const getCodeCommits = async () => {
  const response = await api.get(
    "/api/code-commits"
  );
  return response.data;
};

export const getCodeCommit = async (id) => {
  const response = await api.get(
    `/api/code-commits/${id}`
  );
  return response.data;
};

export const createCodeCommit = async (
  commit
) => {
  const response = await api.post(
    "/api/code-commits",
    commit
  );
  return response.data;
};

export const updateCodeCommit = async (
  id,
  commit
) => {
  const response = await api.put(
    `/api/code-commits/${id}`,
    commit
  );
  return response.data;
};

export const deleteCodeCommit = async (
  id
) => {
  const response = await api.delete(
    `/api/code-commits/${id}`
  );
  return response.data;
};


// =====================================
// DEPLOYMENTS
// =====================================

export const getDeployments = async () => {
  const response = await api.get(
    "/api/deployments"
  );
  return response.data;
};

export const getDeployment = async (id) => {
  const response = await api.get(
    `/api/deployments/${id}`
  );
  return response.data;
};

export const createDeployment = async (
  deployment
) => {
  const response = await api.post(
    "/api/deployments",
    deployment
  );
  return response.data;
};

export const updateDeployment = async (
  id,
  deployment
) => {
  const response = await api.put(
    `/api/deployments/${id}`,
    deployment
  );
  return response.data;
};

export const deleteDeployment = async (
  id
) => {
  const response = await api.delete(
    `/api/deployments/${id}`
  );
  return response.data;
};


export default api;