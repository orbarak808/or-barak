import { PhotographyImage } from "@/lib/types/photography";
import { PhotoTag } from "../enums/photo-tags.enum";

// Google Drive's `uc?export=view` endpoint serves the full-resolution original.
// For large files (30+ MP / tens of MB) Next's image optimizer fails to process
// them, so the image never renders. The thumbnail endpoint returns a pre-resized
// version instead — 2000px wide is plenty for web display and loads much faster.
const DRIVE_THUMBNAIL_WIDTH = 2000;
// The lightbox shows one photo across most of the screen, so it asks Drive
// for a larger rendition than the grids do
const DRIVE_LIGHTBOX_WIDTH = 2400;

export const driveThumbnail = (
  id: string,
  width: number = DRIVE_THUMBNAIL_WIDTH
): string => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

// Extract the file id from a Drive `...&id=<fileId>` URL; null for non-Drive srcs.
export const driveFileId = (src: string): string | null =>
  src.match(/[?&]id=([A-Za-z0-9_-]+)/)?.[1] ?? null;

// The lightbox's large version of an image; non-Drive srcs are used as-is
export const lightboxSrc = (image: PhotographyImage): string => {
  const id = driveFileId(image.src);
  return id ? driveThumbnail(id, DRIVE_LIGHTBOX_WIDTH) : image.src;
};

// Rewrite a Drive `...&id=<fileId>` URL to the thumbnail endpoint. Any src that
// doesn't carry a Drive file id (e.g. non-Drive hosts) is returned unchanged.
const toThumbnailSrc = (image: PhotographyImage): PhotographyImage => {
  const id = driveFileId(image.src);
  return id ? { ...image, src: driveThumbnail(id) } : image;
};

const catalogImages: PhotographyImage[] = [
  {
    id: "catalog-2",
    src: "https://drive.google.com/uc?export=view&id=1E8aTkQvD0n81GN5-WLt2X4kaMx40Doeo",
    width: 2000,
    height: 1333,
    alt: "Catalog image 2",
    title: "Catalog image 2",
    category: PhotoTag.ART
  },

  {
    id: "catalog-3",
    src: "https://drive.google.com/uc?export=view&id=1pjf2IVEi-S5_18C28yPDjkqA7up6dhQY",
    width: 2000,
    height: 1468,
    alt: "Catalog image 3",
    title: "Catalog image 3",
    category: PhotoTag.ART
  },
  {
    id: "catalog-4",
    src: "https://drive.google.com/uc?export=view&id=1m4KKsT2bjGvRi3wz7u7GFo7qp-wyoAe6",
    width: 2000,
    height: 1333,
    alt: "Catalog image 4",
    title: "Image 4",
    category: PhotoTag.ART
  },
  {
    id: "catalog-5",
    src: "https://drive.google.com/uc?export=view&id=1RiPz1h56bXE06YCS0l4aMRLY72ETH9gp",
    width: 2000,
    height: 1333,
    alt: "Catalog image 5",
    title: "Image 5",
    category: PhotoTag.ART
  },
  {
    id: "catalog-6",
    src: "https://drive.google.com/uc?export=view&id=1L4PubWpKmE1DuddLiL9ceaadJyPgiXXY",
    width: 2000,
    height: 1333,
    alt: "Catalog image 6",
    title: "Image 6",
    category: PhotoTag.ART
  },
  {
    id: "catalog-7",
    src: "https://drive.google.com/uc?export=view&id=1AzAgbaTKPf3YrjEvWXENj_a-ytdkbbbI",
    width: 2000,
    height: 1333,
    alt: "Catalog image 7",
    title: "Image 7",
    category: PhotoTag.ART
  },
  {
    id: "catalog-8",
    src: "https://drive.google.com/uc?export=view&id=1VvTsWeb24zsKtIMU1_P6ZkbXQ6NUGKOD",
    width: 2000,
    height: 1333,
    alt: "Catalog image 8",
    title: "Image 8",
    category: PhotoTag.ART
  },
  {
    id: "catalog-9",
    src: "https://drive.google.com/uc?export=view&id=1hY7VlteLsPl21-aJyPuXtbY2zQ-BBEqG",
    width: 2000,
    height: 1333,
    alt: "Catalog image 9",
    title: "Image 9",
    category: PhotoTag.ART
  },
  {
    id: "catalog-10",
    src: "https://drive.google.com/uc?export=view&id=1TVboq8bkDNgN40A5cOcmBdvwSfQ3hWX7",
    width: 2000,
    height: 1587,
    alt: "Catalog image 10",
    title: "Image 10",
    category: PhotoTag.ART
  },
  {
    id: "catalog-11",
    src: "https://drive.google.com/uc?export=view&id=1jwovvOOt3UbCX4-mzlqFL-RMCtUVDHl1",
    width: 2000,
    height: 2876,
    alt: "Catalog image 11",
    title: "Image 11",
    category: PhotoTag.ART
  },
  {
    id: "catalog-12",
    src: "https://drive.google.com/uc?export=view&id=11kPAVyJWxevAalAyjJNyeu85ijRJLsdo",
    width: 2000,
    height: 1333,
    alt: "Catalog image 12",
    title: "Image 12",
    category: PhotoTag.ART
  },
  {
    id: "catalog-13",
    src: "https://drive.google.com/uc?export=view&id=1qf9zjBskwztaClDivmWcuBSxsNccjIBE",
    width: 2000,
    height: 1333,
    alt: "Catalog image 13",
    title: "Image 13",
    category: PhotoTag.ART
  },
  {
    id: "catalog-14",
    src: "https://drive.google.com/uc?export=view&id=1mb2z3tfiUdN4ngyANjpwenpTC2YSlnni",
    width: 2000,
    height: 1333,
    alt: "Catalog image 14",
    title: "Image 14",
    category: PhotoTag.ART
  },
  {
    id: "catalog-15",
    src: "https://drive.google.com/uc?export=view&id=1EqgHjURKVtuBeYkhrpKghzDadNxYvFkD",
    width: 2000,
    height: 1333,
    alt: "Catalog image 15",
    title: "Image 15",
    category: PhotoTag.ART
  },
  {
    id: "catalog-16",
    src: "https://drive.google.com/uc?export=view&id=1F7x0jOVisaTFV-Puj4O_7XVOKfedKNlv",
    width: 2000,
    height: 1333,
    alt: "Catalog image 16",
    title: "Image 16",
    category: PhotoTag.ART
  },
  {
    id: "catalog-19",
    src: "https://drive.google.com/uc?export=view&id=1K2o_PMESpR1L-KoYLodV-UTBibp_phO_",
    width: 2000,
    height: 1333,
    alt: "Catalog image 19",
    title: "Image 19",
    category: PhotoTag.ART
  },
  {
    id: "catalog-18",
    src: "https://drive.google.com/uc?export=view&id=1E2uKrlkv6BhZTY2YaVu9DArJ1tjMMOOx",
    width: 2000,
    height: 1066,
    alt: "Catalog image 18",
    title: "Image 18",
    category: PhotoTag.ART
  },
  {
    id: "catalog-taxi",
    src: "https://drive.google.com/uc?export=view&id=1i1dE9jQ8OEOR30Nc6bd5n1fk7mWG3usJ",
    width: 2000,
    height: 2588,
    alt: "Selected work 4",
    title: "Architecture",
    category: PhotoTag.ARCHITECTURE
  },
  {
    id: "catalog-20",
    src: "https://drive.google.com/uc?export=view&id=1ndKpQHKZQNMJQRkdKUo22cYxrARMZkZ1",
    width: 2000,
    height: 1333,
    alt: "Catalog image 20",
    title: "Image 20",
    category: PhotoTag.ART
  }
].map(toThumbnailSrc);

// Placeholder images - Replace with actual image paths
// You can use Unsplash, local images, or any image source
const generateCatalogImages = (
  count: number,
  prefix: string
): PhotographyImage[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    src: `https://images.unsplash.com/photo-${
      1500000000000 + i
    }?w=800&h=600&fit=crop`,
    alt: `Photography image ${i + 1}`,
    title: `Image ${i + 1}`,
    width: 800,
    height: 600
  }));
};

// Selected Works - First section (smaller images)
export const selectedWorks: PhotographyImage[] = [
  {
    id: "selected-10",
    featured: true,
    src: "https://drive.google.com/uc?export=view&id=1qRMQDcI9tBBADMxpW2Q0shHOUU_Flp9R",
    width: 2000,
    height: 1300,
    alt: "Selected work 10",
    title: "10",
    category: PhotoTag.PERSON
  },
  {
    id: "selected-11",
    src: "https://drive.google.com/uc?export=view&id=17eBF5tzDlUTfDr4zd_ycoEXAdUDQktcr",
    width: 2000,
    height: 1333,
    alt: "Selected work 11",
    title: "11",
    category: PhotoTag.NATURE
  },
  {
    id: "selected-3",
    featured: true,
    src: "https://drive.google.com/uc?export=view&id=1zoZGwEdVS8Zf20UNpPYfcZT5Flj7UWOm",
    width: 2000,
    height: 1153,
    alt: "Selected work 3",
    title: "Neon Sign",
    category: PhotoTag.NATURE
  },
  {
    id: "selected-1",
    src: "https://drive.google.com/uc?export=view&id=1gYayUlxow6NzLqXGD_g0wrHmPxayizZQ",
    width: 2000,
    height: 3000,
    alt: "Selected work 1",
    title: "The Set",
    category: PhotoTag.PRODUCTION
  },
  {
    id: "selected-2",
    src: "https://drive.google.com/uc?export=view&id=1orUU-ajY_Qrmeosxp1SvbECsxxAJNAU0",
    width: 2000,
    height: 1333,
    alt: "Selected work 2",
    title: "Street Photography",
    category: PhotoTag.STREET
  },
  {
    id: "selected-5",
    src: "https://drive.google.com/uc?export=view&id=1AvsLz_VIYS8Oys8awTOSqPZk7AXihiTM",
    width: 2000,
    height: 1333,
    alt: "Selected work 5",
    title: "Landscape",
    category: PhotoTag.LANDSCAPE
  },
  {
    id: "selected-6",
    src: "https://drive.google.com/uc?export=view&id=1iSJx7X3RS4JZfLkLBdSolBb-9GFSyM4z",
    width: 2000,
    height: 1613,
    alt: "Selected work 6",
    title: "Architecture",
    category: PhotoTag.ARCHITECTURE
  },
  {
    id: "selected-7",
    src: "https://drive.google.com/uc?export=view&id=1NR2yacxhVrDqZJdYnOLmPHH4OYsowieh",
    width: 2000,
    height: 1125,
    alt: "Selected work 7",
    title: "Nature",
    category: PhotoTag.NATURE
  },
  {
    id: "selected-8",
    src: "https://drive.google.com/uc?export=view&id=1ejjVlETM9VMJmjcdUnQIAe5FGGE8KSTq",
    width: 2000,
    height: 1125,
    alt: "Selected work 8",
    title: "Architecture",
    category: PhotoTag.ARCHITECTURE
  },
  {
    id: "selected-9",
    featured: true,
    src: "https://drive.google.com/uc?export=view&id=1JyVbdkyeOZgbnFU2B--4VHQhSg5bkoZt",
    width: 2000,
    height: 1333,
    alt: "Selected work 9",
    title: "Architecture",
    category: PhotoTag.ARCHITECTURE
  },
  {
    id: "selected-12",
    featured: true,
    src: "https://drive.google.com/uc?export=view&id=1P8L7SCxXFuJxaL6w2HzEaNOwLzMXdJqx",
    width: 2000,
    height: 1333,
    alt: "Selected work 12",
    title: "12",
    category: PhotoTag.ARCHITECTURE
  },
  {
    id: "selected-13",
    src: "https://drive.google.com/uc?export=view&id=1yLfdPqtiTdXUaF5-iY_Y6KzrEJr5I3YP",
    width: 2000,
    height: 1333,
    alt: "Selected work 13",
    title: "13",
    category: PhotoTag.ARCHITECTURE
  }
].map(toThumbnailSrc);

// Top 20 - Second section (bigger images)
export const topImages: PhotographyImage[] = [
  {
    id: "top-1",
    src: "https://drive.google.com/uc?export=view&id=1H3puLKuWLAuF85YJTypbhf-kxu1FCpbG",
    width: 2000,
    height: 1350,
    alt: "Top image 1",
    title: "Portrait Series"
  },
  {
    id: "top-2",
    src: "https://drive.google.com/uc?export=view&id=1wbcs2TAkt2kGRlzPDZatB_sBeDnPx8GI",
    width: 2000,
    height: 1333,
    alt: "Top image 2",
    title: "Urban Life"
  },
  {
    id: "top-3",
    src: "https://drive.google.com/uc?export=view&id=1-2afLOGUJDKEJBg2ALK0swDwVCFMH7xa",
    width: 2000,
    height: 1333,
    alt: "Basketball Game",
    title: "Basketball Game"
  },
  {
    id: "top-4",
    src: "https://drive.google.com/uc?export=view&id=16Akoaax5HOoasIHgv--BpaiK1_fvhxEa",
    width: 2000,
    height: 1473,
    alt: "Top image 4",
    title: "City Lights"
  },
  {
    id: "top-5",
    featured: true,
    src: "https://drive.google.com/uc?export=view&id=1u_51A0PFAum3mlvCH_tNi6dtChD-N054",
    width: 2000,
    height: 1414,
    alt: "Top image 5",
    title: "Ocean View"
  },
  {
    id: "top-6",
    src: "https://drive.google.com/uc?export=view&id=13BEwG7YX99Tu1_k_wABCYklKwXbSgXxW",
    width: 2000,
    height: 1447,
    alt: "Top image 6",
    title: "Forest Path"
  },
  {
    id: "top-7",
    src: "https://drive.google.com/uc?export=view&id=1q8QLTOfxJaVLOYUdXh0bHpqyJD1LeRf8",
    width: 2000,
    height: 1333,
    alt: "Top image 7",
    title: "Desert Sunset"
  },
  {
    id: "top-8",
    src: "https://drive.google.com/uc?export=view&id=1tNhUZVRbNBr_IiUesxqIAwSGOBsU8aFI",
    width: 2000,
    height: 1333,
    alt: "Top image 8",
    title: "Abstract Forms"
  },
  {
    id: "top-9",
    src: "https://drive.google.com/uc?export=view&id=1x-DfwWI9FXmI157VSwcTH38Og6ZJ25jW",
    width: 2000,
    height: 1165,
    alt: "Top image 9",
    title: "Minimalist"
  },
  {
    id: "top-10",
    src: "https://drive.google.com/uc?export=view&id=11vhfYHPkLzM22tHfYFNxFhr9VG2DQWTQ",
    width: 2000,
    height: 1185,
    alt: "Top image 10",
    title: "Textures"
  },
  {
    id: "top-11",
    src: "https://drive.google.com/uc?export=view&id=1g7Mo_UTQWymXI4L8ZNMWPiP5IW8a0K5J",
    width: 2000,
    height: 1124,
    alt: "Top image 11",
    title: "Portrait Study"
  },
  {
    id: "top-12",
    src: "https://drive.google.com/uc?export=view&id=1QsV3nYjbxopPbSYIrzZ4YcJ6Tb42YqcR",
    width: 2000,
    height: 1125,
    alt: "Top image 12",
    title: "Street Scene"
  },
  {
    id: "top-13",
    src: "https://drive.google.com/uc?export=view&id=1zfmH2QAhpwIDcMCkaqjx43TmGG4ac-qr",
    width: 2000,
    height: 3557,
    alt: "Top image 13",
    title: "Mountain Peak"
  },
  {
    id: "top-14",
    featured: true,
    src: "https://drive.google.com/uc?export=view&id=1hR1yIlHnSe6Mi3Sjvrd9c62SDGrF3y1-",
    width: 2000,
    height: 1125,
    alt: "Top image 14",
    title: "Night City"
  },
  {
    id: "top-15",
    src: "https://drive.google.com/uc?export=view&id=1mnHKpanBI1B7uBg-P09baqYuD29a9G4K",
    width: 2000,
    height: 1362,
    alt: "Top image 15",
    title: "Coastal"
  },
  {
    id: "top-16",
    src: "https://drive.google.com/uc?export=view&id=15RMrSp881WXFle4PJ2AZIqjsIEqLXp_z",
    width: 2000,
    height: 1333,
    alt: "Top image 16",
    title: "Golden Hour"
  },
  {
    id: "top-17",
    src: "https://drive.google.com/uc?export=view&id=1cg7clN7sCEzF1vnbzDNgFHiyPmAhoKgk",
    width: 2000,
    height: 1333,
    alt: "Top image 17",
    title: "Urban Geometry"
  },
  {
    id: "top-18",
    src: "https://drive.google.com/uc?export=view&id=15U4oaQAremdiezd_d3XT72PHRaFXF4aM",
    width: 2000,
    height: 1333,
    alt: "Top image 18",
    title: "Serenity"
  },
  {
    id: "top-19",
    src: "https://drive.google.com/uc?export=view&id=1bCrFR64Ax6lK-4njTbf4qTe1LxdwvnwH",
    width: 2000,
    height: 1333,
    alt: "Top image 19",
    title: "Dramatic Light"
  },
  {
    id: "top-20",
    src: "https://drive.google.com/uc?export=view&id=1l_2rWzueuAtsvsBSMcrI7VspwTSM1LAm",
    width: 2000,
    height: 1333,
    alt: "Top image 20",
    title: "Wilderness"
  }
  // {
  //   id: "top-21",
  //   src: "https://drive.google.com/uc?export=view&id=1DWD1luBjS7sDJd3HcDYGmP1r79YaPVcs",
  //   alt: "Top image 21",
  //   title: "Washington"
  // }
].map(toThumbnailSrc);

// Full Catalog - Third section (varied sizes)
// Generate more images for the full catalog (excluding selectedWorks and topImages to avoid duplicates)
export const fullCatalog: PhotographyImage[] = generateCatalogImages(
  catalogImages.length,
  "catalog"
).map((img, index) => ({
  ...catalogImages[index]
}));

// Get all images for lightbox navigation (includes all sections without duplicates)
export function getAllPhotographyImages(): PhotographyImage[] {
  return [...selectedWorks, ...topImages, ...fullCatalog];
}

// Landing page photography teaser — any image from any group can be featured.
// Display order is set here, independent of array order; a featured image
// missing from this list sorts to the end.
const featuredPhotoOrder = [
  "selected-3",
  "top-5",
  "selected-10",
  "selected-9",
  "selected-12",
  "top-14"
];

const featuredRank = (image: PhotographyImage): number => {
  const rank = featuredPhotoOrder.indexOf(image.id);
  return rank === -1 ? featuredPhotoOrder.length : rank;
};

export const featuredPhotos: PhotographyImage[] = getAllPhotographyImages()
  .filter((image) => image.featured === true)
  .sort((a, b) => featuredRank(a) - featuredRank(b));

// Frames printed on the contact section's film strips
const filmStripPhotoIds = [
  ...featuredPhotoOrder,
  "selected-1",
  "selected-2",
  "selected-6",
  "top-1"
];

export const filmStripPhotos: PhotographyImage[] = filmStripPhotoIds
  .map((id) => getAllPhotographyImages().find((image) => image.id === id))
  .filter((image): image is PhotographyImage => !!image);
