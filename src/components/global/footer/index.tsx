import { MiniPlayer } from "@/components/mini-player";
import BottomTabBar from "./BottomTabBar";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-foreground">
          &copy; 2004-{new Date().getFullYear()} Fubon. <Link href="/login">Войти</Link>
        </div>
      </footer>

      <div className="sticky bottom-0 z-30">
        <MiniPlayer />
        <BottomTabBar />
      </div>
    </>
  )
}
