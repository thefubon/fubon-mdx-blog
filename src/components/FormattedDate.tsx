import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

interface FormattedDateProps {
  date: string
  className?: string
}

export default function FormattedDate({ date, className }: FormattedDateProps) {
  return (
    <time
      dateTime={date}
      className={className}>
      {format(parseISO(date), 'd MMMM yyyy', { locale: ru })}
    </time>
  )
}
