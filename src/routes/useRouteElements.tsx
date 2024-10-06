import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from '~/contexts/AppProvider'
import AdminLayout from '~/layouts/AdminLayout/AdminLayout'
import MainLayout from '~/layouts/MainLayout'
import RegisterLayout from '~/layouts/RegisterLayout'
import DashBoard from '~/pages/DashBoard'
import ForgotPassword from '~/pages/ForgotPassword'
import Home from '~/pages/Home/Home'
import Login from '~/pages/Login'
import ManageBuilding from '~/pages/ManageBuilding'
import ManageRoom from '~/pages/ManageRoom'
import Oauth from '~/pages/OAuth/Oauth'
import OrderDetail from '~/pages/OrderDetail'
import Register from '~/pages/Register'
import RoomDetails from '~/pages/RoomDetails/RoomDetails'

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute() {
  const { isAuth } = useContext(AppContext)
  return isAuth ? <Outlet /> : <Navigate to='/login' />
}

// eslint-disable-next-line react-refresh/only-export-components
function RejectedRoute() {
  const { isAuth } = useContext(AppContext)
  return !isAuth ? <Outlet /> : <Navigate to='/' />
}
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
          path: '/room-details/:id',
          element: <RoomDetails />
        }
      ]
    },
    {
      path: '',
      element: <AdminLayout />,
      children: [
        {
          path: '/admin',
          element: <DashBoard />
        },
        {
          path: '/admin/rooms',
          element: <ManageRoom />
        },
        {
          path: '/admin/buildings',
          element: <ManageBuilding />
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: '/login',
              element: <Login />
            },
            {
              path: '/register',
              element: <Register />
            },
            {
              path: '/login/oauth',
              element: <Oauth />
            },
            {
              path: '/forgot-password',
              element: <ForgotPassword />
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              path: '/order-detail/:step?',
              element: <OrderDetail />
            }
          ]
        }
      ]
    }
  ])
  return routeElements
}
