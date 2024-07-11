// CharNavBar.tsx
import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import CustomConnectButton from './CustomConnectButton'
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image"
import NextLink from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

const CharNavBar: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const characterUrl = `https://www.forgottenrunes.com/api/art/wizards/${selectedCharacter?.id}`;
  const router = useRouter();
  const { pathname } = router;

  const bgColorMap: { [key: string]: string } = {
    '/': 'bg-[#622aff]',
    '/profile': 'bg-[#fdb060]',
    '/store': 'bg-[#32cd32]',
    '/game': 'bg-[#1e90ff]',
    '/team': 'bg-[#353e75]',
  };

  const bgColor = bgColorMap[pathname] || 'bg-[#622aff]';
  return (
    <NextUINavbar className={`${bgColor} p-4`} maxWidth="2xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-white text-2xl">Runiverse Trail</p>
          </NextLink>
        </NavbarBrand>
        
      </NavbarContent>

      <div className="hidden lg:flex gap-6 justify-center ml-2">
            <NavbarItem>
              <NextLink
                href="/profile"
                className='text-2xl'
              >
                Profile
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink
                href="/store"
                className='text-2xl'
              >
                Store
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink
                href="/game"
                className='text-2xl'
              >
                Game
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink
                href="/team"
                className='text-2xl'
              >
                Team
              </NextLink>
            </NavbarItem>
        </div>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href="">
            <Image src="/img/twitter.webp" alt="twitter" width={40} className='rounded-none'/>
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <CustomConnectButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
            <NavbarMenuItem>
              <Link
                href="#"
                size="lg"
              >
                Home
              </Link>
            </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default CharNavBar;
