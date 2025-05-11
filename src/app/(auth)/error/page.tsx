'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  
  let errorTitle = 'Ошибка аутентификации'
  let errorMessage = 'Произошла ошибка при попытке входа в систему. Пожалуйста, попробуйте снова.'
  
  // Different error messages based on the error type
  if (error === 'OAuthSignin') {
    errorMessage = 'Ошибка при начале процесса OAuth.'
  } else if (error === 'OAuthCallback') {
    errorMessage = 'Ошибка при обработке ответа от OAuth провайдера.'
  } else if (error === 'OAuthCreateAccount') {
    errorMessage = 'Не удалось создать учетную запись OAuth.'
  } else if (error === 'OAuthAccountNotLinked') {
    errorMessage = 'Адрес электронной почты уже используется с другим аккаунтом.'
  } else if (error === 'EmailCreateAccount') {
    errorMessage = 'Не удалось создать учетную запись с помощью электронной почты.'
  } else if (error === 'Callback') {
    errorMessage = 'Ошибка в обратном вызове OAuth.'
  } else if (error === 'AccessDenied') {
    errorTitle = 'Доступ запрещен'
    errorMessage = 'У вас нет прав доступа к этой странице.'
  } else if (error === 'Configuration') {
    errorMessage = 'Ошибка в конфигурации сервера.'
  }
  
  return (
    <div className="container flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">{errorTitle}</CardTitle>
          <CardDescription>
            {errorMessage}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground">
            Если проблема не устраняется, пожалуйста, свяжитесь с администратором сайта.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Link 
            href="/login" 
            className="text-primary hover:underline"
          >
            Вернуться к входу
          </Link>
          <Link 
            href="/" 
            className="text-muted-foreground hover:underline"
          >
            На главную
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 