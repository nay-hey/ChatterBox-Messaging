
'use client';
import { useUserContext } from '../context/userContext';
import ChatsPage from './chat/page';
import LoginAndRegister from './login/page';

export default function HomePage() {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    return <LoginAndRegister />;
  }

  return <ChatsPage />;
}