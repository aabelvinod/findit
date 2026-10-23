import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Gem, ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { CATEGORIES } from "../types";
import type { ReportType, Report } from "../types";
import { useReports } from "../hooks/useReports";
import { useToast } from "../hooks/useToast";
import {
  sanitizeText,
  truncate,
  validateReportForm,
  validateImageFile,
  compressImageToDataUrl,
  TEXT_LIMITS,
} from "../utils/validation";
import { pointsForReport } from "../utils/rewards";

interface ReportFormProps {
  type: ReportType;
}

const today = new Date().toISOString().slice(0, 10);

export default function ReportForm({ type }: ReportFormProps) {
  const { addReport } = useReports();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(today);
  const [color, setColor] = useState("");
  const [instructions, setInstructions] = useState("");
  const [handedToStaff, setHandedToStaff] = useState(false);
  const [valuable, setValuable] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Report | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
  }

  function resetForm() {
    setTitle("");
    setCategory("");
    setDescription("");
    setLocation("");
    setEventDate(today);
    setColor("");
    setInstructions("");
    setHandedToStaff(false);
    setValuable(false);
    setReporterName("");
    removeImage();
    setErrors({});
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return; // guard against accidental double submission

    const values = {
      title,
      category,
      description,
      location,
      eventDate,
      color,
      instructions,
      handedToStaff,
      valuable,
      reporterName,
    };
    const validationErrors = validateReportForm(values, type);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      let image: string | null = null;
      if (imageFile) {
        image = await compressImageToDataUrl(imageFile);
      }

      const report = addReport({
        type,
        title: truncate(sanitizeText(title), TEXT_LIMITS.title),
        category,
        description: truncate(sanitizeText(description), TEXT_LIMITS.description),
        location: truncate(sanitizeText(location), TEXT_LIMITS.location),
        eventDate,
        image,
        color: color ? truncate(sanitizeText(color), TEXT_LIMITS.color) : undefined,
        instructions:
          type === "lost" && instructions ? truncate(sanitizeText(instructions), TEXT_LIMITS.instructions) : undefined,
        handedToStaff: type === "found" ? handedToStaff : undefined,
        valuable: type === "found" ? valuable : undefined,
        reporterName: type === "found" && reporterName ? truncate(sanitizeText(reporterName), TEXT_LIMITS.reporterName) : undefined,
      });

      setCreated(report);
      showToast(`Report submitted — +${pointsForReport(report)} honesty points.`, "success");
      resetForm();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong while saving your report.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    const earned = pointsForReport(created);
    return (
      <div className="glass-panel anim-pop flex flex-col items-center gap-4 p-8 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--color-success-soft)", color: "var(--color-success)" }}
        >
          <CheckCircle2 size={28} />
        </div>
        <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
          Report submitted!
        </h2>
        {earned > 0 && (
          <span
            className="badge badge-valuable anim-pop"
            style={{ fontSize: "0.78rem", textTransform: "none", letterSpacing: 0 }}
          >
            <Sparkles size={13} /> +{earned} honesty points earned
          </span>
        )}
        <p className="max-w-md text-sm" style={{ color: "var(--color-text-soft)" }}>
          Your {type} report <strong>{created.title}</strong> has been saved with report ID{" "}
          <strong>{created.id}</strong>. You can track it anytime from "My Reports".
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to={`/item/${created.id}`} className="btn btn-primary">
            View report
          </Link>
          <Link to="/rewards" className="btn btn-gold">
            <Gem size={15} /> See my rewards
          </Link>
          <Link to="/my-reports" className="btn btn-secondary">
            Go to My Reports
          </Link>
          <button type="button" className="btn btn-ghost" onClick={() => setCreated(null)}>
            Report another item
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-panel flex flex-col gap-5 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="field-label">
            Item name *
          </label>
          <input
            id="title"
            className={`input-field ${errors.title ? "has-error" : ""}`}
            value={title}
            maxLength={TEXT_LIMITS.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === "lost" ? "e.g. Blue water bottle" : "e.g. Maths notebook"}
            aria-invalid={!!errors.title}
          />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category" className="field-label">
            Category *
          </label>
          <select
            id="category"
            className={`input-field ${errors.category ? "has-error" : ""}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-invalid={!!errors.category}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="field-error">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="field-label">
          Description *
        </label>
        <textarea
          id="description"
          className={`input-field ${errors.description ? "has-error" : ""}`}
          rows={4}
          maxLength={TEXT_LIMITS.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the item, any marks, stickers, or distinguishing details..."
          aria-invalid={!!errors.description}
        />
        <div className="flex justify-between">
          {errors.description ? <p className="field-error">{errors.description}</p> : <span />}
          <span className="field-hint">{description.length}/{TEXT_LIMITS.description}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="field-label">
            Approximate location *
          </label>
          <input
            id="location"
            className={`input-field ${errors.location ? "has-error" : ""}`}
            value={location}
            maxLength={TEXT_LIMITS.location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. School library, Classroom 9-A"
            aria-invalid={!!errors.location}
          />
          {errors.location && <p className="field-error">{errors.location}</p>}
        </div>

        <div>
          <label htmlFor="eventDate" className="field-label">
            Date {type === "lost" ? "lost" : "found"} *
          </label>
          <input
            id="eventDate"
            type="date"
            max={today}
            className={`input-field ${errors.eventDate ? "has-error" : ""}`}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            aria-invalid={!!errors.eventDate}
          />
          {errors.eventDate && <p className="field-error">{errors.eventDate}</p>}
        </div>
      </div>

      {type === "lost" && (
        <div>
          <label htmlFor="color" className="field-label">
            Color / distinguishing features
          </label>
          <input
            id="color"
            className={`input-field ${errors.color ? "has-error" : ""}`}
            value={color}
            maxLength={TEXT_LIMITS.color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Blue with a black cap"
          />
          {errors.color && <p className="field-error">{errors.color}</p>}
        </div>
      )}

      {type === "lost" ? (
        <div>
          <label htmlFor="instructions" className="field-label">
            Safe recovery instructions (optional)
          </label>
          <textarea
            id="instructions"
            className={`input-field ${errors.instructions ? "has-error" : ""}`}
            rows={2}
            maxLength={TEXT_LIMITS.instructions}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Please hand it to the class teacher or school office"
          />
          <p className="field-hint">Avoid sharing phone numbers or home addresses here.</p>
        </div>
      ) : (
        <div
          className="glass-panel p-5"
          style={{ borderColor: "color-mix(in srgb, var(--color-gold) 28%, transparent)" }}
        >
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            <Gem size={15} style={{ color: "var(--color-gold)" }} /> Honesty reward details
          </p>

          <div className="flex flex-col gap-3">
            <CheckRow
              checked={valuable}
              onChange={setValuable}
              label="This is something valuable"
              hint="Phones, wallets, keys, jewellery, calculators — valuable finds earn a bonus."
              gold
            />
            <CheckRow
              checked={handedToStaff}
              onChange={setHandedToStaff}
              label="Already handed to a teacher or the office"
              hint="Keeps the search safe for everyone."
            />
          </div>

          <div className="mt-4">
            <label htmlFor="reporterName" className="field-label">
              Your name for the honour board (optional)
            </label>
            <input
              id="reporterName"
              className={`input-field ${errors.reporterName ? "has-error" : ""}`}
              value={reporterName}
              maxLength={TEXT_LIMITS.reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Aabel Vinod · 10-A"
              aria-invalid={!!errors.reporterName}
            />
            {errors.reporterName ? (
              <p className="field-error">{errors.reporterName}</p>
            ) : (
              <p className="field-hint">Shown to your school community on the rewards board. Leave blank to stay anonymous.</p>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="field-label">Optional photo</label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview of uploaded item" className="h-32 w-32 rounded-xl object-cover" />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-white shadow"
              style={{ background: "var(--color-danger)" }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-xs"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-soft)" }}
          >
            <ImagePlus size={22} />
            Add photo
          </label>
        )}
        <input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
        {imageError && <p className="field-error">{imageError}</p>}
        <p className="field-hint">JPG, PNG, or WEBP under 1.5MB. Never upload photos of IDs or confidential documents.</p>
      </div>

      <button type="submit" className="btn btn-primary mt-1 self-start" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Submitting...
          </>
        ) : (
          `Submit ${type === "lost" ? "lost" : "found"} report`
        )}
      </button>
    </form>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  hint,
  gold,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint: string;
  gold?: boolean;
}) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
      style={{ background: checked ? "var(--color-gold-soft)" : "transparent" }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded"
        style={{ accentColor: gold ? "var(--color-gold)" : "var(--color-primary)" }}
      />
      <span>
        <span className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
          {label}
        </span>
        <span className="block text-xs" style={{ color: "var(--color-text-soft)" }}>
          {hint}
        </span>
      </span>
    </label>
  );
}
