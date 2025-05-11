'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoginButton from "@/components/auth/LoginButton"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const { status } = useSession()

  // If the user is already logged in, redirect to dashboard
  if (status === 'authenticated') {
    redirect('/dashboard')
  }

  return (
    <div className="container flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
          <CardDescription>
            Выберите способ входа в панель управления
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <LoginButton 
            provider="google" 
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border hover:bg-gray-50"
          >
            <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
            Войти с Google
          </LoginButton>
          
          <LoginButton 
            provider="vk" 
            className="w-full flex items-center justify-center gap-2 bg-[#0077FF] hover:bg-[#0066CC] text-white"
          >
            <Image src="/vk-logo.svg" alt="VK" width={20} height={20} className="w-5 h-5" />
            Войти через ВКонтакте
          </LoginButton>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
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