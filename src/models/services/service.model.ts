import { ObjectId } from "mongodb";

export interface Service {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  category: string;
  tags: string[];
  images: {
    thumbnail: string;
    gallery: string[];
  };
  links: {
    liveDemo?: string;
    youtubeDemo?: string;
    githubRepo?: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  deliveryTimeDays: number;
  features: string[];
  technologies: string[];
  requirements: {
    businessName: boolean;
    businessType: boolean;
    pagesCount: boolean;
    contentProvided: boolean;
    referenceWebsites: boolean;
    domainHosting: boolean;
  };
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt?: Date;
}

export interface ServiceFilters {
  category?: string;
  status?: string;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
}