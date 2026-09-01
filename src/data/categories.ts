import { ProductCategory } from '../types';

export interface CategoryInfo {
  name: ProductCategory;
  slug: string;
  tagline: string;
  image: string;
  itemCount: number;
}

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    name: 'Thời trang',
    slug: 'thoi-trang',
    tagline: 'Phom dáng may đo & chất liệu tự nhiên',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    itemCount: 3
  },
  {
    name: 'Giày',
    slug: 'giay',
    tagline: 'Đẳng cấp bước chân từ da Nappa Ý',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    itemCount: 1
  },
  {
    name: 'Đồng hồ',
    slug: 'dong-ho',
    tagline: 'Kiệt tác thời gian & bộ máy tinh xảo',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
    itemCount: 1
  },
  {
    name: 'Túi & Ví',
    slug: 'tui-vi',
    tagline: 'Chế tác da thủ công đỉnh cao',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    itemCount: 3
  },
  {
    name: 'Công nghệ',
    slug: 'cong-nghe',
    tagline: 'Hi-Fi Audio & Thiết bị thông minh',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    itemCount: 2
  },
  {
    name: 'Phụ kiện',
    slug: 'phu-kien',
    tagline: 'Trang sức Bạc 925 & Kính mát cao cấp',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
    itemCount: 2
  }
];
