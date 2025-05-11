import React from 'react'
import { BriefcaseBusiness, FileText, Music } from 'lucide-react'

export type MenuItem = {
  name: string
  link: string
  icon: React.ReactNode
}

export const menuItems: MenuItem[] = [
  { 
    name: 'Работа', 
    link: '/work', 
    icon: <BriefcaseBusiness className="w-full h-full" />
  },
  { 
    name: 'Блог', 
    link: '/blog',
    icon: <FileText className="w-full h-full" /> 
  },
  { 
    name: 'Музыка', 
    link: '/music',
    icon: <Music className="w-full h-full" />
  },
]
