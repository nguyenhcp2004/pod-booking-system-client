import { useRoutes } from 'react-router-dom'
import MainLayout from '~/layouts/MainLayout'
import Home from '~/pages/Home/Home'
import RoomDetail from '~/pages/RoomDetail/RoomDetail'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: '',
          index: true,
          element: <Home />
        },
        {
          path: '/room-detail',
          element: <RoomDetail />
        }
      ]
    }
  ])
  return routeElements
}
