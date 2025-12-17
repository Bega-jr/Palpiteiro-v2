import { Hero } from '../components/Hero';
import { DailyTip } from '../components/DailyTip';
import Generator from '../components/Generator'; // Importação corrigida
import { Features } from '../components/Features';

export function Home() {
  return (
    <>
      <Hero />
      <DailyTip />
      <Generator />
      <Features />
    </>
  );
}
