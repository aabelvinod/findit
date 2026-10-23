// Form validation + input sanitation helpers.

import type { ReportType } from "../types";

export const TEXT_LIMITS = {
  title: 80,
  description: 600,
  location: 80,
  color: 40,
  instructions: 300,
  reporterName: 40,
};

export const MAX_IMAGE_BYTES = 1_500_000; // ~1.5MB original upload limit
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Strips any HTML tags and collapses whitespace so stored text is always plain. */
export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
}

export function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export interface ReportFormValues {
  title: string;
  category: string;
  description: string;
  location: string;
  eventDate: string;
  color?: string;
  instructions?: string;
  handedToStaff?: boolean;
  valuable?: boolean;
  reporterName?: string;
}

export function validateReportForm(values: ReportFormValues, type: ReportType): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.title || sanitizeText(values.title).length < 2) {
    errors.title = "Please enter the item name (at least 2 characters).";
  } else if (values.title.length > TEXT_LIMITS.title) {
    errors.title = `Item name must be under ${TEXT_LIMITS.title} characters.`;
  }

  if (!values.category) {
    errors.category = "Please select a category.";
  }

  if (!values.description || sanitizeText(values.description).length < 10) {
    errors.description = "Please add a short description (at least 10 characters).";
  } else if (values.description.length > TEXT_LIMITS.description) {
    errors.description = `Description must be under ${TEXT_LIMITS.description} characters.`;
  }

  if (!values.location || sanitizeText(values.location).length < 2) {
    errors.location = "Please enter an approximate location.";
  } else if (values.location.length > TEXT_LIMITS.location) {
    errors.location = `Location must be under ${TEXT_LIMITS.location} characters.`;
  }

  if (!values.eventDate) {
    errors.eventDate = `Please choose the date ${type === "lost" ? "lost" : "found"}.`;
  } else {
    const chosen = new Date(values.eventDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (Number.isNaN(chosen.getTime())) {
      errors.eventDate = "That date doesn't look valid.";
    } else if (chosen > today) {
      errors.eventDate = "The date can't be in the future.";
    }
  }

  if (values.color && values.color.length > TEXT_LIMITS.color) {
    errors.color = `Keep this under ${TEXT_LIMITS.color} characters.`;
  }

  if (values.instructions && values.instructions.length > TEXT_LIMITS.instructions) {
    errors.instructions = `Keep instructions under ${TEXT_LIMITS.instructions} characters.`;
  }

  if (values.reporterName && values.reporterName.length > TEXT_LIMITS.reporterName) {
    errors.reporterName = `Keep your name under ${TEXT_LIMITS.reporterName} characters.`;
  }

  return errors;
}

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, or WEBP image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image is too large. Please choose a file under 1.5MB.";
  }
  return null;
}

/**
 * Resizes and compresses an image file into a small base64 data URL
 * so it is safe to store in localStorage.
 */
export function compressImageToDataUrl(file: File, maxDimension = 480, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not process the image file."));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Image processing is not supported in this browser."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
