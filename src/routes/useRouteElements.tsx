import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from '~/contexts/AppProvider'
import AdminLayout from '~/layouts/AdminLayout/AdminLayout'
import MainLayout from '~/layouts/MainLayout'
import RegisterLayout from '~/layouts/RegisterLayout'
import OrderAmenityDetail from '~/pages/Amenity'
import DashBoard from '~/pages/DashBoard'
import EditBooking from '~/pages/EditBooking'
import ForgotPassword from '~/pages/ForgotPassword'
import HistoryOrders from '~/pages/HistoryOrders'
import Home from '~/pages/Home/Home'
import Login from '~/pages/Login'
import ManageAmenity from '~/pages/ManageAmenity'
import { Confirmed } from '~/pages/ManageAmenityOrders/Confirmed'
import ManageAmenityOrders from '~/pages/ManageAmenityOrders/ManageAmenityOrders'
import ManageBuilding from '~/pages/ManageBuilding'
import ManageOrder from '~/pages/ManageOrder/ManageOrder'
import ManageRoom from '~/pages/ManageRoom'
import ManageRoomType from '~/pages/ManageRoomType'
import ManageUser from '~/pages/ManageUser'
import Oauth from '~/pages/OAuth/Oauth'
import OrderDetail from '~/pages/OrderDetail'
import RefreshToken from '~/pages/RefreshToken/RefreshToken'
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
        },
        {
          path: '/refresh-token',
          element: <RefreshToken />
        }
      ]
    },
    {
      path: '',
      element: <AdminLayout />,
      children: [
        {
          path: '/admin/dashboard',
          element: <DashBoard />
        },
        {
          path: '/admin/rooms',
          element: <ManageRoom />
        },
        {
          path: '/admin/buildings',
          element: <ManageBuilding />
        },
        {
          path: '/admin/users',
          element: <ManageUser />
        },
        {
          path: '/admin/orders',
          element: <ManageOrder />
        },
        {
          path: '/admin/amenities',
          element: <ManageAmenity />
        },
        {
          path: '/admin/room-types',
          element: <ManageRoomType />
        },
        {
          path: '/admin/amenity-orders',
          element: <ManageAmenityOrders />
        },
        {
          path: '/admin/amenity-orders/payment',
          element: <Confirmed />
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
            },
            {
              path: '/history-orders',
              element: <HistoryOrders />
            },
            {
              path: '/order-amenity-detail/:step?',
              element: <OrderAmenityDetail />
            },
            {
              path: '/edit-booking',
              element: <EditBooking />
            }
          ]
        }
      ]
    }
  ])
  return routeElements
}
