import { Loader2 } from "lucide-react"

function PageLoading() {
  return (
    <div className="flex justify-center items-center gap-x-4 h-screen font-quickSand">
        <Loader2 size={20} />
        <span className="text-lg">Loading...</span>
    </div>
  )
}

export default PageLoading