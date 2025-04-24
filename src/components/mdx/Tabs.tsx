// src/components/mdx/Tabs.tsx
'use client'

import React, { useState } from 'react'

// Интерфейс для свойств компонента Tab
interface TabProps {
  label: string
  children: React.ReactNode
}

// Интерфейс для свойств компонента Tabs
interface TabsProps {
  children: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>
}

export function Tab({ children }: TabProps) {
  return <div>{children}</div>
}

export function Tabs({ children }: TabsProps) {
  // Приводим дочерние элементы к массиву и уточняем тип
  const tabs = React.Children.toArray(
    children
  ) as React.ReactElement<TabProps>[]
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="tabs-container mb-6">
      <div className="flex border-b">
        {tabs.map((tab, index) => {
          // Проверка на наличие свойства label
          if (!tab.props || typeof tab.props.label !== 'string') {
            console.warn(
              `Tab at index ${index} does not have a valid label property`
            )
            return null
          }

          return (
            <button
              key={index}
              className={`py-2 px-4 font-medium ${
                activeTab === index
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(index)}>
              {tab.props.label}
            </button>
          )
        })}
      </div>
      <div className="p-4 border border-t-0 rounded-b-lg bg-white">
        {tabs[activeTab]}
      </div>
    </div>
  )
}
