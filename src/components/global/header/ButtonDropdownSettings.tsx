import { DarkMode } from './DarkMode'
import { SoundToggle } from '@/components/SoundToggle'

export default function ButtonDropdownSettings() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>Тема:</div>
        <DarkMode />
      </div>

      <div className="flex justify-between items-center">
        <div>Звук:</div>
        <SoundToggle />
      </div>
    </div>
  )
}
