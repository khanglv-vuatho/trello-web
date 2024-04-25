import axios from 'axios'

export async function generateMetadata({ params }: { params: { boardId: string } }) {
  const boardDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/boards/${params.boardId}`, { cache: 'no-cache' }).then((res) => res.json())
  return {
    title: boardDetails.title,
    description: '',
  }
}

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
