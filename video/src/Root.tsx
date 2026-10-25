import React from 'react';
import {Composition} from 'remotion';
import {PRODUCTS} from './brand';
import {ProductAd} from './videos/ProductAd';
import {MixAd} from './videos/MixAd';
import {ForgeADEUI} from './ui/ForgeADEUI';
import {KendaliAIUI} from './ui/KendaliAIUI';
import {RakitKodeUI} from './ui/RakitKodeUI';
import {PanduJevUI} from './ui/PanduJevUI';

const FPS = 30;
const DURATION = 1890; // 63.0s — minimum 60s brief

const ForgeAd: React.FC = () => <ProductAd p={PRODUCTS.ForgeADE} UI={ForgeADEUI} />;
const KendaliAd: React.FC = () => <ProductAd p={PRODUCTS.KendaliAI} UI={KendaliAIUI} />;
const RakitAd: React.FC = () => <ProductAd p={PRODUCTS.RakitKode} UI={RakitKodeUI} />;
const PanduAd: React.FC = () => <ProductAd p={PRODUCTS.PanduJev} UI={PanduJevUI} />;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ForgeADE" component={ForgeAd} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
      <Composition id="KendaliAI" component={KendaliAd} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
      <Composition id="RakitKode" component={RakitAd} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
      <Composition id="PanduJev" component={PanduAd} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
      <Composition id="Mix" component={MixAd} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    </>
  );
};
