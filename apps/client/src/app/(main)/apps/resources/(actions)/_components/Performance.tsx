import type { IUserStatistic } from '@/service/rootApi';

import DetailPerform from './performance/DetailPerform';
import HeatMap from './performance/HeatMap';

const Performance = ({ statistics }: { statistics: IUserStatistic }) => {
  return (
    <div className=" bg-white rounded-lg py-1 px-2 row-span-2 col-span-3 flex flex-col items-center ">
      <p className="text-primary-950 font-bold text-lg">Your Perfromance</p>
      <div className="w-full px-10">
        <DetailPerform statistics={statistics} />
      </div>
      <HeatMap />
    </div>
  );
};

export default Performance;
