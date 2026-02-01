import api from './api'

/**
 * Fee Type Service - API calls for fee type management
 */
const feeTypeService = {
    /**
     * Get all fee types
     */
    getFeeTypes: async () => {
        const { data } = await api.get('/fee-types')
        return data
    },

    /**
     * Get fee type by ID
     */
    getFeeTypeById: async (id) => {
        const { data } = await api.get(`/fee-types/${id}`)
        return data
    },

    /**
     * Create new fee type
     */
    createFeeType: async (feeTypeData) => {
        const { data } = await api.post('/fee-types', {
            name: feeTypeData.name,
            amount: feeTypeData.amount,
            frequency: feeTypeData.frequency, // 1=Monthly, 2=Weekly, 3=Annual, 4=OneTime
            autoAssign: feeTypeData.autoAssign || false,
            selectedGroupIds: feeTypeData.selectedGroupIds || []
        })
        return data
    },

    /**
     * Update fee type
     */
    updateFeeType: async (id, feeTypeData) => {
        const { data } = await api.put(`/fee-types/${id}`, {
            name: feeTypeData.name,
            amount: feeTypeData.amount,
            frequency: feeTypeData.frequency
        })
        return data
    },

    /**
     * Delete fee type
     */
    deleteFeeType: async (id) => {
        const { data } = await api.delete(`/fee-types/${id}`)
        return data
    },

    /**
     * Assign groups to fee type
     */
    assignGroups: async (id, groupIds, autoAssignToMembers = true) => {
        const { data } = await api.post(`/fee-types/${id}/groups`, {
            groupIds,
            autoAssignToMembers
        })
        return data
    }
}

export default feeTypeService
