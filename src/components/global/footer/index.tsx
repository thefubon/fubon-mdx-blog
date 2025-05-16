import { MiniPlayer } from "@/components/audio/mini-player";
import BottomTabBar from "./BottomTabBar";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div
        className="relative h-[400px]"
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
        <div className="relative h-[calc(100vh+400px)] -top-[100vh]">
          <footer className="py-6 bg-muted h-[400px] sticky top-[calc(100vh-400px)]">
            <div className="max-w-7xl mx-auto px-4 text-center text-foreground">
              &copy; 2004-{new Date().getFullYear()} Fubon. |{' '}
              <Link href="/login">Войти</Link> |{' '}
              <Link href="/dashboard">Профиль</Link>
            </div>
          </footer>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30">
        <MiniPlayer />
        <BottomTabBar />
      </div>
    </>
  )
}
