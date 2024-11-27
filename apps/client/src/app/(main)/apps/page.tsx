'use client';

import Cookies from 'js-cookie';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAccount } from '@/hooks/use-auth';

import CardDue from './resources/_components/CardDue';
// import { io } from 'socket.io-client';
import Header from './resources/_components/Header';
import LowAccQuiz from './resources/_components/LowAccQuiz';
import NoteRevision from './resources/_components/NoteRevision';
import Achieve from './resources/(actions)/_components/Achieve';
import CalendarDashboard from './resources/(actions)/_components/CalendarDashboard';
import Maxim from './resources/(actions)/_components/Maxim';
import Performance from './resources/(actions)/_components/Performance';
import ShortSession from './resources/(actions)/_components/ShortSession';
import Total from './resources/(actions)/_components/Total';
// import { useStatisticsQuery } from '@/service/rootApi';

const Main = () => {
  const router = useRouter();
  const { data, error, isLoading } = useAccount();
  // const [socket, setSocket] = useState<any>(null);
  // const [statistics, setStatistics] = useState({});

  // const response = useStatisticsQuery(data?.data.user);

  // useEffect(() => {
  //   if (data?.data?.user) {
  //     if (response.isSuccess) {
  //       console.log('response: ', response.data);
  //       setStatistics(response.data);
  //     }
  //     // Khởi tạo kết nối Socket.IO với token trong header
  //     const newSocket = io('http://localhost:3000', {
  //       auth: {
  //         token: Cookies.get('access_token'), // Token lưu trong cookie
  //       },
  //       transports: ['websocket'], // Chỉ dùng WebSocket
  //       reconnection: true,
  //       reconnectionAttempts: 10,
  //       reconnectionDelay: 3000,
  //     });
  //     // console.log("access", Cookies.get('access_token'))
  //     newSocket.on('connect', () => {
  //       console.log('Connected to server via Socket.IO');
  //       // setStatistics(statistic);
  //       // console.log("successfull!")
  //     });

  //     newSocket.on('update-user-statistic', (updatedStatistics: any) => {
  //       console.log('Received updated statistics:', updatedStatistics);
  //       setStatistics(updatedStatistics);
  //     });

  //     newSocket.on('disconnect', () => {
  //       console.log('Disconnected from server.');
  //     });

  //     setSocket(newSocket);

  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   }
  // }, [data, response.isSuccess]);
  // console.log('statistic: ', statistics);

  useEffect(() => {
    if (error) {
      Cookies.remove('access_token');
      router.push('/login');
      toast('Unauthorized', {
        description: 'Please login to continue',
        position: 'top-right'
      });
    }
  }, [error, data, router]);

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center bg-primary-100">
        <LoaderCircle className="size-16 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 flex h-screen bg-primary-50 flex-col box-border">
      <Header username={data.data.user.username} />
      <div className="flex flex-1 gap-4 w-full  px-10 pb-7">
        <div className=" w-3/4 max-h-full  grid grid-cols-3 grid-rows-5 gap-4 box-border ">
          <ShortSession />
          <CardDue />
          <NoteRevision />
          <div className="element-dashboard row-span-2 ">4</div>
          <LowAccQuiz />
          <Achieve />
          <Maxim />
          <Performance />
        </div>
        <div className=" w-1/4 h-full flex flex-col gap-4  box-border">
          <Total username={data.data.user.username} />
          <CalendarDashboard />
        </div>
      </div>

      {/* <div className="grid lg:grid-cols-4 gap-4 w-full h-[calc(100%-72px)] px-4 md:grid-cols-2 grid-cols-1 [&>*]:h-[172px] overflow-auto"></div> */}
    </div>
  );
};

export default Main;
