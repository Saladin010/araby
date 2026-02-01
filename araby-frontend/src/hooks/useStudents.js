import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import studentService from '../services/studentService'
import toast from 'react-hot-toast'

/**
 * Hook to fetch students list with filters and pagination
 */
export const useStudents = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: ['students', filters],
        queryFn: () => studentService.getStudents(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to fetch both students and assistants combined
 * Note: Assistants can only see students, Teachers can see both
 */
export const useAllUsers = (roleFilter = 'all', currentUserRole = null, options = {}) => {
    return useQuery({
        queryKey: ['allUsers', roleFilter, currentUserRole],
        queryFn: async () => {
            // Determine what to fetch based on user role and filter
            const isTeacher = currentUserRole === 1; // Role 1 = Teacher
            const isAssistant = currentUserRole === 2; // Role 2 = Assistant

            let students = []
            let assistants = []

            // Always fetch students
            const studentsPromise = studentService.getStudents()

            // Only fetch assistants if user is Teacher AND (filter is 'all' or 'assistant')
            const shouldFetchAssistants = isTeacher && (roleFilter === 'all' || roleFilter === 'assistant')
            const assistantsPromise = shouldFetchAssistants
                ? studentService.getAssistants()
                : Promise.resolve([])

            // Fetch in parallel
            const [fetchedStudents, fetchedAssistants] = await Promise.all([
                studentsPromise,
                assistantsPromise
            ])

            students = fetchedStudents
            assistants = fetchedAssistants

            // Combine and filter based on role filter
            let combined = []

            if (roleFilter === 'all') {
                combined = [...students, ...assistants]
            } else if (roleFilter === 'student') {
                combined = students
            } else if (roleFilter === 'assistant') {
                // Only show if user is Teacher
                combined = isTeacher ? assistants : []
            }

            return combined
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to fetch single student details
 */
export const useStudentDetails = (id, options = {}) => {
    return useQuery({
        queryKey: ['student', id],
        queryFn: () => studentService.getStudentById(id),
        enabled: !!id,
        ...options,
    })
}

/**
 * Hook to create new student
 */
export const useCreateStudent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentService.createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
            toast.success('تم إضافة الطالب بنجاح')
        },
        onError: (error) => {
            console.error('Create student error:', error)

            // Extract detailed error message
            let errorMessage = 'حدث خطأ أثناء إضافة الطالب'

            if (error.response?.data) {
                const data = error.response.data

                // Check for validation errors
                if (data.errors) {
                    const errors = Object.values(data.errors).flat()
                    errorMessage = errors.join(', ')
                } else if (data.message) {
                    errorMessage = data.message
                } else if (typeof data === 'string') {
                    errorMessage = data
                }
            }

            toast.error(errorMessage)
        },
    })
}

/**
 * Hook to create new assistant
 */
export const useCreateAssistant = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentService.createAssistant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
            toast.success('تم إضافة المساعد بنجاح')
        },
        onError: (error) => {
            console.error('Create assistant error:', error)

            // Extract detailed error message
            let errorMessage = 'حدث خطأ أثناء إضافة المساعد'

            if (error.response?.data) {
                const data = error.response.data

                // Check for validation errors
                if (data.errors) {
                    const errors = Object.values(data.errors).flat()
                    errorMessage = errors.join(', ')
                } else if (data.message) {
                    errorMessage = data.message
                } else if (typeof data === 'string') {
                    errorMessage = data
                }
            }

            toast.error(errorMessage)
        },
    })
}

/**
 * Hook to update student
 */
export const useUpdateStudent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => studentService.updateStudent(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
            queryClient.invalidateQueries({ queryKey: ['student', variables.id] })
            toast.success('تم تحديث بيانات الطالب بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث البيانات')
        },
    })
}

/**
 * Hook to delete student
 */
export const useDeleteStudent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentService.deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
            toast.success('تم حذف الطالب بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف الطالب')
        },
    })
}

/**
 * Hook to toggle student active status
 */
export const useToggleStudentStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentService.toggleStudentStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
            toast.success('تم تحديث حالة الطالب بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة')
        },
    })
}

/**
 * Hook to get student credentials
 */
export const useStudentCredentials = (id) => {
    return useQuery({
        queryKey: ['studentCredentials', id],
        queryFn: () => studentService.getStudentCredentials(id),
        enabled: false, // Only fetch when explicitly called
    })
}

/**
 * Hook to reset student password
 */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ id, newPassword }) => studentService.resetPassword(id, newPassword),
        onSuccess: () => {
            toast.success('تم تغيير كلمة المرور بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور')
        },
    })
}
