import { Navigate, createBrowserRouter } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { EbooksPage } from './pages/EbooksPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/inicio', element: <LandingPage /> },
  { path: '/ebooks', element: <EbooksPage /> },
  { path: '/materiais', element: <EbooksPage /> },
  // Qualquer rota desconhecida redireciona para a página inicial
  { path: '*', element: <Navigate to="/" replace /> },
])
