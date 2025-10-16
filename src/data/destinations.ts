import type { Destination } from '../types/destination';

export const destinations: Destination[] = [
  {
    id: 'maldives',
    name: '马尔代夫',
    category: 'island',
    shortDescription: '印度洋上的度假天堂',
    description: '清澈海水与白沙滩，适合蜜月与潜水，最佳季节 11 月到 4 月。',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    bestSeason: '11-04',
    basePrice: 8500,
    tags: ['海岛','蜜月','潜水']
  },
  {
    id: 'kyoto',
    name: '京都',
    category: 'culture',
    shortDescription: '古韵与现代交织的文化之都',
    description: '寺庙庭院与四季景色，春樱秋枫，文化旅行佳选。',
    imageUrl: 'https://images.unsplash.com/photo-1554797589-7241bb691973',
    bestSeason: '03-04 / 10-11',
    basePrice: 6200,
    tags: ['文化','历史','四季']
  },
  {
    id: 'interlaken',
    name: '因特拉肯',
    category: 'mountain',
    shortDescription: '湖泊与雪山融合的户外圣地',
    description: '滑雪、徒步、跳伞等活动丰富，适合冒险与自然爱好者。',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    bestSeason: '06-09 / 12-02',
    basePrice: 7800,
    tags: ['山地','户外','运动']
  }
];
