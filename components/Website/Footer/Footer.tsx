import packageInfo from '../../../package.json'
import { useRouter } from 'next/router';


export default function Footer() {
    
  const router = useRouter();
  const { pathname } = router;


  const currentYear = new Date().getFullYear();
  const currentName = packageInfo.name;
  const currentVersion = packageInfo.version;

  return (
    <div className="p-6">
    <div className="w-full flex flex-col items-center justify-center text-sm text-center md:text-left fade-in">
        <a className="text-gray-100 no-underline hover:no-underline font-ocra uppercase" href="#">&copy; {currentName} {currentYear}</a> 
        <p className="text-gray-100 font-ocra text-xs uppercase">Running Version: <span className="text-yellow">{currentVersion}</span></p>
    </div>
    </div>
  );
}