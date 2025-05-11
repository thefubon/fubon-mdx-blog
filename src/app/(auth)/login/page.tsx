import type { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Вход в систему',
  description: 'Страница входа в личный кабинет Fubon',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Войти в аккаунт</CardTitle>
          <CardDescription>
            Введите свои данные для входа в панель управления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Войти</Button>
          <p className="text-sm text-center text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 hover:text-primary">
              Вернуться на главную
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 