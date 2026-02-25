import React from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { useGetPlatformUpdatesQuery } from '../store/slices/platformApiSlice';
import RichTextMessage from './RichTextMessage';

const bannerClass = (priority) => {
  if (priority === 'high') return 'border-red-500/35 bg-red-500/10 text-red-100';
  if (priority === 'medium') return 'border-cyan-500/35 bg-cyan-500/10 text-cyan-100';
  return 'border-amber-500/35 bg-amber-500/10 text-amber-100';
};

const PlatformUpdatesBanner = ({ audience }) => {
  const { data, isLoading, isError } = useGetPlatformUpdatesQuery({ audience }, { skip: !audience });
  const updates = data?.updates || [];

  if (isLoading || isError || updates.length === 0) return null;

  return (
    <div className="space-y-2">
      {updates.map((update) => (
        <div
          key={update._id}
          className={`rounded-xl border px-4 py-3 ${bannerClass(update.priority)}`}
        >
          <p className="text-xs uppercase tracking-wider font-black inline-flex items-center gap-2">
            <FaBullhorn />
            Platform Update
          </p>
          <p className="font-black mt-1">{update.title}</p>
          <RichTextMessage text={update.message} className="text-sm mt-1 opacity-95" />
        </div>
      ))}
    </div>
  );
};

export default PlatformUpdatesBanner;
