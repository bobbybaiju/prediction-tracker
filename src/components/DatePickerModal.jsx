import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns'

export const DatePickerModal = ({ value, onChange, minDate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date())

  const today = startOfDay(new Date())
  const minimumDate = minDate ? startOfDay(new Date(minDate)) : today

  const handleDateClick = (date) => {
    onChange(format(date, 'yyyy-MM-dd'))
    setIsOpen(false)
  }

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-1 hover:bg-dark-border rounded transition-fast"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="font-semibold">
        {format(currentMonth, 'MMMM yyyy')}
      </span>
      <button
        type="button"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-1 hover:bg-dark-border rounded transition-fast"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )

  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const isDisabled = isBefore(cloneDay, minimumDate)
        const isSelected = value && isSameDay(cloneDay, new Date(value))
        const isCurrentMonth = isSameMonth(cloneDay, monthStart)
        const isToday = isSameDay(cloneDay, today)

        days.push(
          <button
            key={day.toString()}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && handleDateClick(cloneDay)}
            className={`
              p-2 text-sm rounded transition-fast
              ${!isCurrentMonth ? 'text-gray-600' : 'text-white'}
              ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-dark-border cursor-pointer'}
              ${isSelected ? 'bg-white text-black hover:bg-gray-200' : ''}
              ${isToday && !isSelected ? 'border border-gray-600' : ''}
            `}
          >
            {format(cloneDay, 'd')}
          </button>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }

    return <div>{rows}</div>
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-dark-bg border border-dark-border rounded px-4 py-2.5 text-left transition-fast focus:outline-none focus:border-gray-600 flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {value ? format(new Date(value), 'MMMM d, yyyy') : 'Select a date'}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 bg-dark-card border border-dark-border rounded-lg p-4 shadow-xl w-[300px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Select resolution date</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-dark-border rounded transition-fast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
        </>
      )}
    </div>
  )
}
