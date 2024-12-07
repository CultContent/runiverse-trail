// CharNavBar.tsx
import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import CustomConnectButton from './CustomConnectButton'
import { FaTwitter } from "react-icons/fa";
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
    '/char_creation': 'bg-[#1c9f49]',
    '/adventure': 'bg-[#28248c]',
    '/map': 'bg-black'
  };

  const bgColor = bgColorMap[pathname] || 'bg-[#622aff]';
  return (
    <NextUINavbar className="bg-black p-4" maxWidth="2xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-atirose text-white text-2xl">Runiverse Trail</p>
          </NextLink>
        </NavbarBrand>
        
      </NavbarContent>

      <div className="hidden lg:flex gap-10 justify-center ml-2 font-parkin font-medium">
            <NavbarItem>
              <NextLink
                href="/profile"
                className='text-sm uppercase hover:text-yellow'
              >
                Create Your Character
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink
                href="/trainer"
                className='text-sm uppercase hover:text-yellow'
              >
                Trainer
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink
                href="/store"
                className='text-sm uppercase hover:text-yellow'
              >
                Store
              </NextLink>
            </NavbarItem>
            {/* <NavbarItem>
              <NextLink
                href="/store"
                className='text-sm uppercase'
              >
                Store
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink
                href="/game"
                className='text-sm uppercase'
              >
                Game
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink
                href="/team"
                className='text-sm uppercase'
              >
                Team
              </NextLink>
            </NavbarItem> */}
        </div>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href="">
            <FaTwitter className="text-white text-2xl"/>
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
