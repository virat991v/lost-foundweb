import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import PageTransition from '../components/ui/PageTransition'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}
