// src/data/navbar.ts (без JSX)
export type MenuItem = {
  name: string
  link: string
  iconName?: string // Используем строковые идентификаторы вместо React компонентов
}

export const menuItems: MenuItem[] = [
  { name: 'Работа', link: '/work', iconName: 'Rabbit' },
  { name: 'Блог', link: '/blog', iconName: 'LayoutDashboard' },
  { name: 'Музыка', link: '/music', iconName: 'FileMusic' },
]
