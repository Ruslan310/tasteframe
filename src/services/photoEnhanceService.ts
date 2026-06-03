import { ENV } from "../config/env";

export const BUSINESS_STYLE = {
  restaurant: "high-end restaurant menu photography, elegant lighting, premium look",
  cafe: "cozy cafe aesthetic, warm tones, soft shadows",
  fastfood: "bright, high contrast, vibrant colors, eye-catching",
  delivery: "clear, sharp, high contrast, optimized for mobile apps",
  bakery: "soft, warm, creamy tones, delicate textures",
  realtorHouse:
    "house listing: natural daylight, true-to-life colors, preserve ceiling lights, outlets, and floor exactly as photographed; exposure balance only — no staging makeover",
  realtorApartment:
    "apartment listing: natural window light, true-to-life wall and floor colors, preserve ceiling fixtures and electrical outlets exactly; exposure balance only — no bright re-render or added lamps"
} as const;

export type BusinessType = keyof typeof BUSINESS_STYLE;
export type QualityPreset = "low" | "medium" | "high";

function isRealEstateBusinessType(type: BusinessType): boolean {
  return type === "realtorHouse" || type === "realtorApartment";
}

type EnhanceFoodPhotosParams = {
  files: File[];
  businessType: BusinessType;
  qualityPreset?: QualityPreset;
  userInput?: string;
  apiBaseUrl?: string;
};

type EnhanceImagePayload = {
  images: Array<{ imageBase64: string; mimeType: string }>;
  prompt: string;
  qualityPreset?: QualityPreset;
  /** Tells the API to use strict listing-preservation rules (realtor presets). */
  realEstateListing?: boolean;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const commaIndex = result.indexOf(",");
      if (commaIndex === -1) {
        reject(new Error("Could not convert file to base64"));
        return;
      }
      resolve(result.slice(commaIndex + 1));
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

function buildEnhancementPrompt({
  businessType,
  userInput
}: {
  businessType: BusinessType;
  userInput: string;
}): string {
  const style = BUSINESS_STYLE[businessType];
  const extras = userInput.trim() || "none";

  if (isRealEstateBusinessType(businessType)) {
    return `
You are a professional real estate listing photographer and retoucher.

TOP PRIORITY (overrides style and marketing goals):
- This is documentary listing evidence, not a redesign. If unsure, leave the source pixels unchanged.
- NEVER add ceiling lights, recessed cans, pendants, tracks, cords, chandeliers, flush mounts, or LED panels that are not in the source image.
- NEVER add, remove, or move electrical outlets, switch plates, sockets, or wall ports; keep their exact count, size, and position.
- NEVER change floor material, color, sheen, plank/tile size, pattern, grout lines, wood grain direction, or transitions between surfaces.
- The Style section below must NOT justify new fixtures, outlets, or floor finishes — only global tone and exposure.

Your task is to enhance property photos for marketing while preserving the real layout, architecture, materials, and scene content with MAXIMUM fidelity.

NON-NEGOTIABLE (property listing integrity):
- Do NOT add, remove, relocate, replace, merge, or "clean up" ANY visible object: furniture, built-ins, appliances, range hoods, sinks, faucets, decor, plants, vehicles, people, pets, signs, light switches, outlets, door hardware, window frames, blinds, curtains, mirrors, art, rugs, trash bins, small clutter, or outdoor elements.
- Do NOT change the number, shape, length, or position of any light fixture or ceiling detail (including spots, panels, and bare ceiling areas); do not remove a fixture or invent a new one.
- Do NOT repaint, brighten, or "upgrade" ceilings in a way that implies new lighting was installed.
- Do NOT change floor material, tile size, grout lines, wood grain direction, transitions between surfaces, or thresholds; no warmer/cooler wood tone unless it is clearly the same floor under corrected white balance only.
- Do NOT alter wall/ceiling planes, room corners, window count, door count, or cabinet layout.
- Do NOT invent staging, fake views through windows, or altered square footage impressions.
- Do NOT replace backgrounds or "re-render" regions — no hallucinated pixels where objects exist.

ALLOWED (subtle technical polish only):
- Exposure, highlight/shadow recovery, white balance, gentle global contrast, mild clarity/sharpening that preserves edges and texture
- Very cautious verticals correction ONLY if it does not warp fixtures, cabinets, or straight lines of the scene
- Mild noise reduction that does not erase real texture (wood grain, tile, fabric)

If any instruction (including Style or Additional instructions) would risk changing ceiling lights, outlets, or flooring, SKIP that change and leave the area identical to the source photo.

OUTPUT:
Return only the enhanced image.

The "${businessType}" option describes the intended listing channel (houses vs apartments), not a label inferred from the image. Apply Style only where it does not conflict with TOP PRIORITY and NON-NEGOTIABLE rules.

Enhance this property photo for a ${businessType} context.

Style:
${style}

Additional instructions:
${extras}

Make the photo clearer and well exposed without altering what is actually in the space.
`.trim();
  }

  return `
You are a professional food photographer and retoucher.

Your task is to enhance food images to look like high-end studio photography while preserving the original dish, ingredients, and composition.

STRICT RULES:
- Do NOT change the structure, ingredients, or arrangement of the dish
- Do NOT add or remove objects
- Do NOT hallucinate new elements
- Keep the original composition intact
- Only improve lighting, shadows, color balance, contrast, sharpness, and overall presentation

GOALS:
- Make the dish look fresh, appetizing, and premium
- Improve lighting to soft studio quality
- Add natural shadows and depth
- Enhance textures (crispy, creamy, juicy, glossy)
- Clean the background if needed, but do not replace it entirely
- Remove visual noise and distractions

STYLE:
- Realistic, not artificial
- No over-processing
- No plastic or fake look
- Suitable for professional restaurant menus

OUTPUT:
Return only the enhanced image.

The "${businessType}" option describes the desired visual treatment for the intended use case (e.g. app thumbnails vs printed menu), not a label inferred from the image content. Apply the style below while respecting all strict rules above.

Enhance this food image for a ${businessType} context.

Style:
${style}

Additional instructions:
${extras}

Make the dish look more visually appealing and professionally photographed.
`.trim();
}

function getApiBaseUrl(customApiBaseUrl?: string): string {
  if (!customApiBaseUrl) {
    return ENV.apiBaseUrl;
  }
  const trimmed = customApiBaseUrl.trim();
  return trimmed || ENV.apiBaseUrl;
}

export async function enhanceFoodPhotos(params: EnhanceFoodPhotosParams): Promise<Blob> {
  const {
    files,
    businessType = "restaurant",
    qualityPreset = "low",
    userInput = "",
    apiBaseUrl
  } = params;

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Please select at least one image");
  }
  if (files.length > ENV.maxImages) {
    throw new Error(`Too many images. Maximum is ${ENV.maxImages}`);
  }

  const images = await Promise.all(
    files.map(async (file) => ({
      imageBase64: await fileToBase64(file),
      mimeType: file.type || "image/jpeg"
    }))
  );

  const payload: EnhanceImagePayload = {
    images,
    prompt: buildEnhancementPrompt({ businessType, userInput }),
    qualityPreset,
    realEstateListing: isRealEstateBusinessType(businessType)
  };

  const baseUrl = getApiBaseUrl(apiBaseUrl);
  const response = await fetch(`${baseUrl}${ENV.analyzeImageEndpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Keep default message when response body isn't JSON.
    }
    throw new Error(message);
  }

  return response.blob();
}

export function downloadZip(blob: Blob, filename = ENV.downloadFilename): void {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}
