import { useChatStore } from "../store/useChatStore";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedUser } = useChatStore();
 
 
  return (
  <div className="h-screen pt-20 px-4 bg-base-200 flex items-center justify-center">
    <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] flex overflow-hidden">
      <SideBar />
      <div className="flex-1 h-full">
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  </div>

  )
}

export default HomePage