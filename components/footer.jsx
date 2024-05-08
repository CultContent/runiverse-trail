import packageInfo from '../package.json'

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const currentName = packageInfo.name;
    const currentVersion = packageInfo.version;

    return (
        <div class="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
            <a class="text-gray-500 no-underline hover:no-underline" href="#">&copy; {currentName} {currentYear}</a> Running Version: {currentVersion}
        </div>
    );
}