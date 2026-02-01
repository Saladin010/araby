import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import PropTypes from 'prop-types'

const Dropdown = ({
    trigger,
    items,
    className = '',
}) => {
    return (
        <Menu as="div" className={`relative inline-block text-right ${className}`}>
            <Menu.Button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-background transition-colors">
                {trigger}
                <ChevronDown size={16} className="text-text-muted" />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-lg bg-surface shadow-lg border border-border focus:outline-none z-10">
                    <div className="py-1">
                        {items.map((item, index) => (
                            <Fragment key={index}>
                                {item.divider ? (
                                    <div className="my-1 border-t border-border" />
                                ) : (
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={item.onClick}
                                                className={`
                          ${active ? 'bg-background' : ''}
                          group flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors
                          ${item.danger ? 'text-error' : 'text-text-primary'}
                        `}
                                            >
                                                {item.icon && <span>{item.icon}</span>}
                                                <span>{item.label}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

Dropdown.propTypes = {
    trigger: PropTypes.node.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.node,
            divider: PropTypes.bool,
            danger: PropTypes.bool,
        })
    ).isRequired,
    className: PropTypes.string,
}

export default Dropdown
