// src/components/global/header/index.tsx
import SoundWrapper from '@/components/SoundWrapper'
import { MenuProvider } from '@/contexts/LogoProvider'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import { ButtonDropdown } from './ButtonDropdown'
import { WaveButton } from '@/components/wave-button'
import { AtSign } from 'lucide-react'


export default function Header() {
  return (
    <MenuProvider>
      <header className="px-[var(--padding-x)] sticky top-0 z-50">
        <div className="flex justify-between items-center gap-x-4 h-[clamp(80px,10vw,140px)]">
          <div>
            <Logo />
          </div>

          <div className="inline-flex justify-end items-center gap-x-2 md:gap-x-4 static md:relative">
            <SoundWrapper>
              <WaveButton
                size="lg"
                pulseWhenIdle={true}
                showTrackName={true}
              />
            </SoundWrapper>

            <SoundWrapper>
              <ButtonContact
                href="mailto:hello@fubon.ru"
                className="hidden md:inline-block"
                aria-label="Отправить Email">
                <div className="flex items-center gap-x-2">
                  <AtSign />
                  <span>Почта</span>
                </div>
              </ButtonContact>
            </SoundWrapper>

            <ButtonDropdown />
          </div>
        </div>
      </header>
    </MenuProvider>
  )
}
