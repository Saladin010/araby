# Dashboard Components

Comprehensive dashboard system for Araby tutoring management application.

## Quick Start

```jsx
import { useTeacherDashboard } from '../hooks/useDashboardData'
import { StatCard, RevenueChart, QuickAction } from '../components/dashboard'

function MyDashboard() {
  const { data, isLoading } = useTeacherDashboard()
  
  return (
    <div>
      <StatCard
        title="إجمالي الطلاب"
        value={data?.stats.totalStudents}
        icon={Users}
        color="primary"
      />
      <RevenueChart data={data?.revenueData} loading={isLoading} />
    </div>
  )
}
```

## Components

- **StatCard** - Animated statistics card with trends
- **QuickAction** - Gradient action buttons
- **EmptyState** - Empty data placeholder
- **RevenueChart** - Monthly revenue area chart
- **AttendanceChart** - Attendance donut chart
- **WeeklyAttendanceChart** - Weekly bar chart
- **UpcomingSessions** - Sessions list
- **RecentPayments** - Payments table

## Hooks

- `useTeacherDashboard()` - Teacher data
- `useAssistantDashboard()` - Assistant data
- `useStudentDashboard()` - Student data

## Utilities

- `formatDate()`, `formatTime()`, `formatCurrency()`
- `getGreeting()`, `getRelativeTime()`
- `useCountUp()` - Counter animation

## Next Steps

1. Replace mock data with API calls in `useDashboardData.js`
2. Add routes to your router
3. Test with real user accounts

See [walkthrough.md](file:///C:/Users/ZALL/.gemini/antigravity/brain/639347e6-cde9-4ec3-a887-54bb9df9bd2b/walkthrough.md) for full documentation.
