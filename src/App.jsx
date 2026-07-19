import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider }       from './context/ToastContext'
import { GeolocationProvider } from './context/GeolocationContext'
import { SearchProvider }      from './context/SearchContext'
import { AuthProvider }        from './context/AuthContext'
import ClientLayout            from './components/layout/ClientLayout'
import ClinicLayout            from './components/layout/ClinicLayout'
import ProtectedRoute          from './components/layout/ProtectedRoute'
import Spinner                 from './components/ui/Spinner'

const SearchPage            = lazy(() => import('./features/client-portal/SearchPage'))
const MapPage               = lazy(() => import('./features/client-portal/MapPage'))
const HoldRequestSheet      = lazy(() => import('./features/client-portal/HoldRequestSheet'))
const HoldPendingPage       = lazy(() => import('./features/client-portal/HoldPendingPage'))
const SubstitutePage        = lazy(() => import('./features/client-portal/SubstitutePage'))

const LoginPage             = lazy(() => import('./features/clinic-auth/LoginPage'))

const DashboardPage         = lazy(() => import('./features/clinic-dashboard/DashboardPage'))
const InventoryPage         = lazy(() => import('./features/clinic-dashboard/InventoryPage'))
const HoldRequestsPage      = lazy(() => import('./features/clinic-dashboard/HoldRequestsPage'))
const StockAlertsPage       = lazy(() => import('./features/clinic-dashboard/StockAlertsPage'))
const SettingsPage          = lazy(() => import('./features/clinic-settings/SettingsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <GeolocationProvider>
            <SearchProvider>
              <Suspense fallback={<Spinner fullScreen />}>
                <Routes>

                  {/* Client Portal */}
                  <Route element={<ClientLayout />}>
                    <Route path="/"              element={<SearchPage />} />
                    <Route path="/map"            element={<MapPage />} />
                    <Route path="/substitutes"    element={<SubstitutePage />} />
                    <Route path="/hold/new"       element={<HoldRequestSheet />} />
                    <Route path="/hold/:requestId" element={<HoldPendingPage />} />
                  </Route>

                  {/* Clinic Portal */}
                  <Route path="/login" element={<LoginPage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route element={<ClinicLayout />}>
                      <Route path="/dashboard"           element={<DashboardPage />} />
                      <Route path="/dashboard/inventory"  element={<InventoryPage />} />
                      <Route path="/dashboard/holds"      element={<HoldRequestsPage />} />
                      <Route path="/dashboard/alerts"     element={<StockAlertsPage />} />
                      <Route path="/dashboard/settings"   element={<SettingsPage />} />
                    </Route>
                  </Route>

                </Routes>
              </Suspense>
            </SearchProvider>
          </GeolocationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}