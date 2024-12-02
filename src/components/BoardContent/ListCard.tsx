import { CardContent } from '@/components/BoardContent'
import { ICard } from '@/types'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import './BoardContent.css'

const ListCard = ({ cards }: { cards: ICard[] }) => {
  const dndKitCards = cards.map((item) => item._id)
  return (
    <SortableContext strategy={verticalListSortingStrategy} items={dndKitCards}>
      <div className='card'>
        <div style={{ gap: cards.some((card) => card?.FE_PlaceholderCard) && cards.length < 2 ? '0' : '0.5rem' }} className='flex flex-col px-2'>
          {cards?.length ? cards.map((card, index) => <CardContent key={index} card={card} />) : <></>}
        </div>
      </div>
    </SortableContext>
  )
}

export default ListCard
