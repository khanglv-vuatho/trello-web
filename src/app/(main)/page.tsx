import { currentUser } from '@clerk/nextjs'
import { MainPage } from './index'

const Page = async () => {
  const user = await currentUser()

  return <MainPage />
}

export default Page
