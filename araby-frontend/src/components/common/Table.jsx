import PropTypes from 'prop-types'

const Table = ({
    columns,
    data,
    striped = false,
    hoverable = true,
    stickyHeader = false,
    className = '',
}) => {
    return (
        <div className={`w-full overflow-x-auto ${className}`}>
            {/* Desktop Table */}
            <table className="hidden md:table w-full">
                <thead className={`bg-background border-b border-border ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-right text-sm font-semibold text-text-primary"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-8 text-center text-text-muted"
                            >
                                لا توجد بيانات
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`
                  border-b border-border last:border-0
                  ${striped && rowIndex % 2 === 0 ? 'bg-background/50' : ''}
                  ${hoverable ? 'hover:bg-background transition-colors' : ''}
                `}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 text-sm text-text-primary"
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row, rowIndex)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {data.length === 0 ? (
                    <div className="text-center py-8 text-text-muted">
                        لا توجد بيانات
                    </div>
                ) : (
                    data.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="bg-surface border border-border rounded-lg p-4 space-y-3"
                        >
                            {columns.map((column, colIndex) => (
                                <div key={colIndex} className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-text-secondary">
                                        {column.label}
                                    </span>
                                    <span className="text-sm text-text-primary text-left">
                                        {column.render
                                            ? column.render(row[column.key], row, rowIndex)
                                            : row[column.key]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    striped: PropTypes.bool,
    hoverable: PropTypes.bool,
    stickyHeader: PropTypes.bool,
    className: PropTypes.string,
}

export default Table
