import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Requirements from "./pages/Requirements";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Repository from "./pages/Repository";
import CodeCommits from "./pages/CodeCommits";
import TestCases from "./pages/TestCases";
import Bugs from "./pages/Bugs";
import Deployment from "./pages/Deployment";

import "./App.css";

function AppLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE - PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* PROJECTS */}
        <Route
          path="/projects"
          element={
            <ProtectedLayout>
              <Projects />
            </ProtectedLayout>
          }
        />

        {/* REQUIREMENTS */}
        <Route
          path="/requirements"
          element={
            <ProtectedLayout>
              <Requirements />
            </ProtectedLayout>
          }
        />

        {/* TASKS */}
        <Route
          path="/tasks"
          element={
            <ProtectedLayout>
              <Tasks />
            </ProtectedLayout>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <ProtectedLayout>
              <Users />
            </ProtectedLayout>
          }
        />

        {/* REPOSITORY */}
        <Route
          path="/repository"
          element={
            <ProtectedLayout>
              <Repository />
            </ProtectedLayout>
          }
        />

        {/* CODE COMMITS */}
        <Route
          path="/code-commits"
          element={
            <ProtectedLayout>
              <CodeCommits />
            </ProtectedLayout>
          }
        />

        {/* TEST CASES */}
        <Route
          path="/test-cases"
          element={
            <ProtectedLayout>
              <TestCases />
            </ProtectedLayout>
          }
        />

        {/* BUGS */}
        <Route
          path="/bugs"
          element={
            <ProtectedLayout>
              <Bugs />
            </ProtectedLayout>
          }
        />

        {/* DEPLOYMENTS */}
        <Route
          path="/deployments"
          element={
            <ProtectedLayout>
              <Deployment />
            </ProtectedLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;