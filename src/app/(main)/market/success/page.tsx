import { Suspense } from 'react'
import Container from '@/components/ui/Container'
import PageWrapper from '@/components/PageWrapper'
import SuccessContent from './SuccessContent'
import SuccessGate from './SuccessGate'

export default function SuccessPage() {
  return (
    <PageWrapper>
      <Container>
        <Suspense fallback={
          <div className="mt-8 mb-16 max-w-3xl mx-auto">
            <div className="p-8 text-center">
              <div className="animate-pulse w-20 h-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
              <div className="animate-pulse h-8 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="animate-pulse h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="animate-pulse h-4 w-4/5 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        }>
          <SuccessGate>
            <SuccessContent />
          </SuccessGate>
        </Suspense>
      </Container>
    </PageWrapper>
  )
} 