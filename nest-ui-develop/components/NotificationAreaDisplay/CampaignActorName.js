import { format } from 'date-fns'


export default function CampaignActorName({ time, name, id }) {
  const timeDiff = Date.now() - new Date(time).getTime()

  // convert ms to hours
  const hoursBetweenDates = timeDiff / (60 * 60 * 1000)

  const lessThan24hrs = hoursBetweenDates < 24

  const lessThan1hr = hoursBetweenDates < 1

  const timeText = lessThan1hr
    ? format(timeDiff, 'm') + 'm'
    : lessThan24hrs
    ? format(timeDiff, 'H') + 'h'
    : format(new Date(time), 'MMM d')

  return (
    <div className="flex">
      <span className="mt-[10px] text-black text-[15px]">
      <div
                  className="hover:underline hover:cursor-pointer flex justify-between"
                 
                >
      <span className="hover:underline text-black hover:cursor-pointer">{name} Commented on your Campaign</span>
      <span className="ml-[15px] text-black relative">{timeText}</span>
      </div>
      </span>
    </div>
  )
}
