import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './app/router/index'
import './styles/tailwind.css'

export default function App() {
  return <RouterProvider router={AppRouter} />
}