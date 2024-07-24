// pages/game.tsx
import React from 'react';
import GameInterface from '../components/Game/GameInterface';
import { Image } from '@nextui-org/image';
import styles from '@/app/pixelbutton.module.css'

const GamePage: React.FC = () => {
  return (
    <div className="relative bg-[#353e75] h-full">
      <div className="absolute flex-col gap-3 w-full h-[40%] flex items-center justify-center">
        <h1 className="font-upheav text-9xl w-[800px] text-center leading-[80px]">RUNIVERSE TRAIL</h1>
        <p className="font-vcr text-2xl">Meet the team behind this awesome game!</p>
      </div>
        <img className="w-full" src="/img/teambg.png" alt="teambg"/> 
        <div className="bg-[#1c050f] h-full">
          <h1 className="text-center text-6xl">Developer</h1>
          <div className="h-full flex flex-row justify-center p-10 gap-12">
            <div className="w-[350px] h-fit flex flex-col gap-3">
              <Image className="rounded-none" src="/img/team1.png" alt="team1" width={350}/>
              <h1 className="font-thaleahfat text-5xl">Bill Gains</h1>
              <div className="w-fit">
              <button className={styles.pixel_button}>FOLLOW</button>
              <p className="mt-5 font-thaleahfat text-2xl leading-none">A beacon of light and wisdom to the younger wizard generation in a time of such instability. Unfortunately he cannot cook. (Does not even know how to make himself a sandwich).</p>
              </div>
            </div>
            <div className="w-[350px] h-fit flex flex-col gap-3">
              <Image className="rounded-none" src="/img/team2.png" alt="team1" width={350}/>
              <h1 className="font-thaleahfat text-5xl">Pleasures</h1>
              <div className="w-fit">
              <button className={styles.pixel_button}>FOLLOW</button>
              <p className="mt-5 font-thaleahfat text-2xl leading-none">Wants to be recognized as the undisputed lord and master of dark magic, but there is no such thing as dark magic. Only magic. His favorite color is peach, he has a rare phobia of pasta, and his mom still refers to him by his real name: "Pleasures".</p>
              </div>
            </div><div className="w-[350px] h-fit flex flex-col gap-3">
              <Image className="rounded-none" src="/img/team3.png" alt="team1" width={350}/>
              <h1 className="font-thaleahfat text-5xl">Notmokk</h1>
              <div className="w-fit">
              <button className={styles.pixel_button}>FOLLOW</button>
              <p className="mt-5 font-thaleahfat text-2xl leading-none">Bad at magic. Loves pickles, hates to be tickled. Sometimes thinks a pickle is a wand. He always wants his pet owl to protect him from scary monsters, wolves, and bears.</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default GamePage;
