// src/components/mdx/Table.tsx
'use client'

import React, { useRef, useEffect } from 'react'

interface TableProps {
  children: React.ReactNode
  caption?: string
  striped?: boolean
  bordered?: boolean
}

// Определяем типы для HTML элементов таблицы
type TableHTMLElement = React.ReactElement<React.HTMLAttributes<HTMLElement>>
type TheadHTMLElement = React.ReactElement<
  React.HTMLAttributes<HTMLTableSectionElement>
>
type TbodyHTMLElement = React.ReactElement<
  React.HTMLAttributes<HTMLTableSectionElement>
>
type TrHTMLElement = React.ReactElement<
  React.HTMLAttributes<HTMLTableRowElement>
>
type ThHTMLElement = React.ReactElement<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>
>
type TdHTMLElement = React.ReactElement<
  React.TdHTMLAttributes<HTMLTableCellElement>
>

export default function Table({
  children,
  caption,
  striped = true,
  bordered = true,
}: TableProps) {
  // Создаем ссылку на таблицу, используя TableHTMLElement
  const tableRef = useRef<HTMLTableElement>(null)

  // Используем TableHTMLElement в функции, которая обрабатывает элемент таблицы
  const processTableElement = (element: TableHTMLElement) => {
    // Здесь может быть дополнительная логика обработки таблицы
    return element
  }

  // Демонстрируем использование с useEffect
  useEffect(() => {
    if (tableRef.current) {
      // Пример: добавляем обработчик событий для таблицы
      const table = tableRef.current

      const handleTableClick = (e: MouseEvent) => {
        console.log('Table clicked:', e.target)
      }

      table.addEventListener('click', handleTableClick)

      return () => {
        table.removeEventListener('click', handleTableClick)
      }
    }
  }, [])

  return (
    <div
      className={`my-6 overflow-x-auto rounded-lg ${
        bordered ? 'border border-gray-200' : ''
      }`}>
      <table
        ref={tableRef}
        className="min-w-full divide-y divide-gray-200">
        {caption && (
          <caption className="p-2 text-sm text-gray-600 bg-gray-50 border-b">
            {caption}
          </caption>
        )}
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child

          // Демонстрация использования функции processTableElement
          if (React.isValidElement(child) && typeof child.type === 'string') {
            processTableElement(child as TableHTMLElement)
          }

          // Обработка thead
          if (child.type === 'thead') {
            const theadElement = child as TheadHTMLElement
            return React.cloneElement(theadElement, {
              className: 'bg-gray-50',
              children: React.Children.map(
                theadElement.props.children,
                (trChild) => {
                  if (!React.isValidElement(trChild)) return trChild
                  if (trChild.type === 'tr') {
                    const trElement = trChild as TrHTMLElement
                    return React.cloneElement(trElement, {
                      className: 'border-b',
                      children: React.Children.map(
                        trElement.props.children,
                        (thChild) => {
                          if (!React.isValidElement(thChild)) return thChild
                          if (thChild.type === 'th') {
                            const thElement = thChild as ThHTMLElement
                            return React.cloneElement(thElement, {
                              className:
                                'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                            })
                          }
                          return thChild
                        }
                      ),
                    })
                  }
                  return trChild
                }
              ),
            })
          }

          // Обработка tbody
          if (child.type === 'tbody') {
            const tbodyElement = child as TbodyHTMLElement
            return React.cloneElement(tbodyElement, {
              className: 'bg-white divide-y divide-gray-200',
              children: React.Children.map(
                tbodyElement.props.children,
                (trChild, trIndex) => {
                  if (!React.isValidElement(trChild)) return trChild
                  if (trChild.type === 'tr') {
                    const trElement = trChild as TrHTMLElement
                    return React.cloneElement(trElement, {
                      className: striped && trIndex % 2 ? 'bg-gray-50' : '',
                      children: React.Children.map(
                        trElement.props.children,
                        (tdChild) => {
                          if (!React.isValidElement(tdChild)) return tdChild
                          if (tdChild.type === 'td') {
                            const tdElement = tdChild as TdHTMLElement
                            return React.cloneElement(tdElement, {
                              className:
                                'px-4 py-2 whitespace-nowrap text-sm text-gray-700',
                            })
                          }
                          return tdChild
                        }
                      ),
                    })
                  }
                  return trChild
                }
              ),
            })
          }

          return child
        })}
      </table>
    </div>
  )
}
