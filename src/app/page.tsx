import HomePageClient from './home-page-client';
import { getMotivationalTips } from '@/lib/actions';
import type { MotivationalTipsOutput } from '@/lib/types';

export default async function Home() {
  const topics = ['fitness', 'diet', 'lifestyle', 'posture'];
  let initialTips: MotivationalTipsOutput['tips'] = [];

  try {
    const result = await getMotivationalTips({ topics });
    if (result && result.tips) {
      initialTips = result.tips;
    }
  } catch (error) {
    console.error("Failed to fetch motivational tips:", error);
    // Silently fail and proceed with an empty array for tips
  }

  return <HomePageClient initialTips={initialTips} />;
}
