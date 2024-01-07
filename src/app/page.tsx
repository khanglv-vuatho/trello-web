import BoardBar from "@/components/BoardBar"
import BoardContent from "@/components/BoardContent"
import Header from "@/components/Header"
import { mockData } from "./constants"

export default function Home() {
  return (
    <>
      <Header />
      <BoardBar board={mockData?.board} />
      <BoardContent board={mockData?.board} />
    </>
  )
}
