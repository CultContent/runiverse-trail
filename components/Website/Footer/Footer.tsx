import packageInfo from '../../../package.json'
import { useRouter } from 'next/router';


export default function Footer() {
    
  const router = useRouter();
  const { pathname } = router;
  const bgColorMap: { [key: string]: string } = {
    '/': 'bg-[#622aff]',
    '/profile': 'bg-[#fdb060]',
    '/store': 'bg-[#32cd32]',
    '/game': 'bg-[#1e90ff]',
    '/team': 'bg-[#353e75]',
    '/char_creation': 'bg-[#1c9f49]',
    '/adventure': 'bg-[#28248c]'
  };
  
  const bgColor = bgColorMap[pathname] || 'bg-[#622aff]';
  const currentYear = new Date().getFullYear();
  const currentName = packageInfo.name;
  const currentVersion = packageInfo.version;

  return (
    <div className={`${bgColor} p-4`}>
    <div className="w-full flex flex-col items-center justify-center pt-16 pb-6 text-sm text-center md:text-left fade-in">
        <a className="text-gray-100 no-underline hover:no-underline" href="#">&copy; {currentName} {currentYear}</a> Running Version: {currentVersion}
    </div>
    </div>
  );
}