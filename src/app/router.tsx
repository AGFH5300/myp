import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { AdminPaperFormPage } from '../features/admin/AdminPaperFormPage';
import { AdminPapersPage } from '../features/admin/AdminPapersPage';
import { AdminQuestionEditPage } from '../features/admin/AdminQuestionEditPage';
import { AdminSessionsPage } from '../features/admin/AdminSessionsPage';
import { AdminSubjectsPage } from '../features/admin/AdminSubjectsPage';
import { AdminTopicsPage } from '../features/admin/AdminTopicsPage';
import { AttemptsPage } from '../features/attempts/AttemptsPage';
import { AuthPage } from '../features/auth/AuthPage';
import { AdminRoute, OnboardingGate, ProtectedRoute } from '../features/auth/ProtectedRoute';
import { BookmarksPage } from '../features/bookmarks/BookmarksPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LandingPage } from '../features/dashboard/LandingPage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { PaperDetailPage } from '../features/papers/PaperDetailPage';
import { PapersPage } from '../features/papers/PapersPage';
import { QuestionPage } from '../features/questions/QuestionPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth', element: <AuthPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <OnboardingGate />,
        children: [
          {
            element: <AppShell />,
            children: [
              { path: '/onboarding', element: <OnboardingPage /> },
              { path: '/dashboard', element: <DashboardPage /> },
              { path: '/papers', element: <PapersPage /> },
              { path: '/papers/:paperId', element: <PaperDetailPage /> },
              { path: '/questions/:questionId', element: <QuestionPage /> },
              { path: '/bookmarks', element: <BookmarksPage /> },
              { path: '/attempts', element: <AttemptsPage /> },
              {
                element: <AdminRoute />,
                children: [
                  { path: '/admin', element: <AdminDashboardPage /> },
                  { path: '/admin/subjects', element: <AdminSubjectsPage /> },
                  { path: '/admin/sessions', element: <AdminSessionsPage /> },
                  { path: '/admin/papers', element: <AdminPapersPage /> },
                  { path: '/admin/papers/new', element: <AdminPaperFormPage /> },
                  { path: '/admin/papers/:paperId/edit', element: <AdminPaperFormPage /> },
                  { path: '/admin/questions/:questionId/edit', element: <AdminQuestionEditPage /> },
                  { path: '/admin/topics', element: <AdminTopicsPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '/onboarding', element: <OnboardingPage /> },
    ],
  },
]);
