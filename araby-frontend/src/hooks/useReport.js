import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export const useStudentReport = (studentId) => {
    return useQuery({
        queryKey: ['student-report', studentId],
        queryFn: async () => {
            const { data } = await api.get(`/reports/students/${studentId}`)
            return data
        },
        enabled: !!studentId
    })
}
