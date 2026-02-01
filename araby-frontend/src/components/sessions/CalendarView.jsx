import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ar } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarView.css'

const locales = { ar }

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }), // Saturday
    getDay,
    locales,
})

// Arabic messages for calendar
const messages = {
    allDay: 'طوال اليوم',
    previous: 'السابق',
    next: 'التالي',
    today: 'اليوم',
    month: 'شهر',
    week: 'أسبوع',
    day: 'يوم',
    agenda: 'جدول الأعمال',
    date: 'التاريخ',
    time: 'الوقت',
    event: 'حدث',
    noEventsInRange: 'لا توجد حصص في هذا النطاق',
    showMore: (total) => `+${total} المزيد`,
}

/**
 * CalendarView Component
 * Displays sessions in a calendar format
 */
const CalendarView = ({ sessions = [], onSelectEvent, onSelectSlot, loading }) => {
    // Convert sessions to calendar events
    const events = sessions.map((session) => ({
        id: session.id,
        title: session.title,
        start: new Date(session.startTime),
        end: new Date(session.endTime),
        resource: session,
    }))

    // Event style getter
    const eventStyleGetter = (event) => {
        const session = event.resource
        const isPrivate = session.type === 1 || session.type === 'Private'

        const style = {
            backgroundColor: isPrivate ? '#2386C8' : '#10B981',
            borderRadius: '6px',
            opacity: 0.9,
            color: 'white',
            border: '0px',
            display: 'block',
            padding: '4px 8px',
        }

        return { style }
    }

    // Custom toolbar
    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            toolbar.onNavigate('PREV')
        }

        const goToNext = () => {
            toolbar.onNavigate('NEXT')
        }

        const goToToday = () => {
            toolbar.onNavigate('TODAY')
        }

        const label = () => {
            const date = toolbar.date
            return format(date, 'MMMM yyyy', { locale: ar })
        }

        return (
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={goToToday}>
                        اليوم
                    </button>
                    <button type="button" onClick={goToBack}>
                        السابق
                    </button>
                    <button type="button" onClick={goToNext}>
                        التالي
                    </button>
                </span>
                <span className="rbc-toolbar-label">{label()}</span>
                <span className="rbc-btn-group">
                    <button
                        type="button"
                        className={toolbar.view === 'month' ? 'rbc-active' : ''}
                        onClick={() => toolbar.onView('month')}
                    >
                        شهر
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === 'week' ? 'rbc-active' : ''}
                        onClick={() => toolbar.onView('week')}
                    >
                        أسبوع
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === 'day' ? 'rbc-active' : ''}
                        onClick={() => toolbar.onView('day')}
                    >
                        يوم
                    </button>
                </span>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="card p-6">
                <div className="animate-pulse">
                    <div className="h-8 w-1/3 bg-background rounded mb-4" />
                    <div className="h-96 bg-background rounded" />
                </div>
            </div>
        )
    }

    return (
        <div className="card p-6 calendar-container" dir="rtl">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                messages={messages}
                culture="ar"
                rtl={true}
                onSelectEvent={(event) => onSelectEvent(event.resource)}
                onSelectSlot={onSelectSlot}
                selectable
                eventPropGetter={eventStyleGetter}
                components={{
                    toolbar: CustomToolbar,
                }}
            />
        </div>
    )
}

export default CalendarView
