import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import CreatePollPage from '../../pages/CreatePoll/CreatePollPage';
import DashboardPage from '../../pages/Dashboard/DashboardPage';
import HomePage from '../../pages/Home/HomePage';
import ResultsPage from '../../pages/Results/ResultsPage';
import VotePage from '../../pages/Vote/VotePage';
import NotFoundPage from '../../pages/NotFound/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> }, // "/" route
      { path: 'create', element: <CreatePollPage /> }, // "/create"
      { path: 'dashboard', element: <DashboardPage /> }, // "/dashboard"
      { path: 'poll/:pollId', element: <VotePage /> }, // "/poll/123"
      { path: 'poll/:pollId/results', element: <ResultsPage /> }, // "/poll/123/results"
      { path: '*', element: <NotFoundPage /> },
      // fallback
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
