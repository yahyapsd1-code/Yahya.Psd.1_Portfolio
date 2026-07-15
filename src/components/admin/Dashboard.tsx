"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Field,
  TextInput,
  TextArea,
  Toggle,
  Slider,
} from "@/components/admin/ui";
import type {
  PortfolioItem,
  Testimonial,
  ThemeData,
  BackgroundData,
  SectionBg,
} from "@/lib/types";

type FieldDef = {
  k: string;
  label: string;
  type: "text" | "textarea" | "bool" | "number" | "list" | "json";
};

const SECTION_ORDER = [
  "settings",
  "hero",
  "about",
  "services",
  "workflow",
  "journey",
  "statistics",
  "social",
  "contact",
  "footer",
  "seo",
] as const;

const SECTION_LABELS: Record<string, string> = {
  settings: "Settings & Brand",
  hero: "Hero",
  about: "About",
  services: "Services",
  workflow: "Workflow",
  journey: "Journey",
  statistics: "Statistics",
  social: "Social Links",
  contact: "Contact",
  footer: "Footer",
  seo: "SEO",
};

const SECTION_FIELDS: Record<string, FieldDef[]> = {
  settings: [
    { k: "brandName", label: "Brand Name", type: "text" },
    { k: "brandInitials", label: "Initials", type: "text" },
    { k: "role", label: "Role", type: "text" },
    { k: "announcement", label: "Announcement", type: "textarea" },
    { k: "customCursor", label: "Custom Cursor", type: "bool" },
    { k: "loader", label: "Loading Screen", type: "bool" },
    { k: "smoothScroll", label: "Smooth Scroll", type: "bool" },
  ],
  hero: [
    { k: "badge", label: "Badge", type: "text" },
    { k: "line1", label: "Headline Line 1", type: "text" },
    { k: "line2", label: "Headline Line 2", type: "text" },
    { k: "highlight", label: "Highlighted Phrase", type: "text" },
    { k: "description", label: "Description", type: "textarea" },
    { k: "primaryCta", label: "Primary Button", type: "text" },
    { k: "secondaryCta", label: "Secondary Button", type: "text" },
    { k: "ratingText", label: "Trust Text", type: "text" },
    { k: "profileImage", label: "Profile Image URL", type: "text" },
    { k: "rating", label: "Stars (1-5)", type: "number" },
    { k: "stats", label: "Floating Stats", type: "json" },
  ],
  about: [
    { k: "eyebrow", label: "Eyebrow", type: "text" },
    { k: "title", label: "Title", type: "text" },
    { k: "paragraphs", label: "Paragraphs", type: "json" },
    { k: "signature", label: "Signature", type: "text" },
    { k: "skills", label: "Skills", type: "json" },
  ],
  services: [
    { k: "eyebrow", label: "Eyebrow", type: "text" },
    { k: "title", label: "Title", type: "text" },
    { k: "subtitle", label: "Subtitle", type: "textarea" },
    { k: "name", label: "Service Name", type: "text" },
    { k: "description", label: "Description", type: "textarea" },
    { k: "features", label: "Features", type: "list" },
    { k: "cta", label: "Button Label", type: "text" },
  ],
  workflow: [
    { k: "eyebrow", label: "Eyebrow", type: "text" },
    { k: "title", label: "Title", type: "text" },
    { k: "subtitle", label: "Subtitle", type: "textarea" },
    { k: "steps", label: "Steps", type: "json" },
  ],
  journey: [
    { k: "eyebrow", label: "Eyebrow", type: "text" },
    { k: "title", label: "Title", type: "text" },
    { k: "subtitle", label: "Subtitle", type: "textarea" },
    { k: "items", label: "Milestones", type: "json" },
  ],
  statistics: [
    { k: "eyebrow", label: "Eyebrow", type: "text" },
    { k: "title", label: "Title", type: "text" },
    { k: "items", label: "Stat Items", type: "json" },
  ],
  social: [
    { k: "instagram", label: "Instagram URL", type: "text" },
    { k: "instagramLabel", label: "Instagram Label", type: "text" },
    { k: "x", label: "X URL", type: "text" },
    { k: "xLabel", label: "X Label", type: "text" },
    { k: "discord", label: "Discord URL", type: "text" },
    { k: "discordLabel", label: "Discord Label", type: "text" },
  ],
  contact: [
    { k: "eyebrow", label: "Eyebrow", type: "text" },
    { k: "title", label: "Title", type: "text" },
    { k: "subtitle", label: "Subtitle", type: "textarea" },
    { k: "email", label: "Email", type: "text" },
    { k: "discord", label: "Discord URL", type: "text" },
    { k: "instagram", label: "Instagram URL", type: "text" },
    { k: "x", label: "X URL", type: "text" },
    { k: "successTitle", label: "Success Title", type: "text" },
    { k: "successText", label: "Success Text", type: "textarea" },
  ],
  footer: [
    { k: "tagline", label: "Tagline", type: "textarea" },
    { k: "copyright", label: "Copyright", type: "text" },
    { k: "signature", label: "Signature", type: "text" },
    { k: "quickLinks", label: "Quick Links", type: "list" },
  ],
  seo: [
    { k: "title", label: "Meta Title", type: "text" },
    { k: "description", label: "Meta Description", type: "textarea" },
    { k: "keywords", label: "Keywords", type: "list" },
    { k: "ogImage", label: "OG Image URL", type: "text" },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

function Feedback({ msg }: { msg: string }) {
  if (!msg) return null;
  const isError = msg.toLowerCase().includes("error") || msg.toLowerCase().includes("invalid");
  return (
    <span className={isError ? "text-sm text-primary" : "text-sm text-emerald-400"}>
      {msg}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content editor                                                            */
/* -------------------------------------------------------------------------- */

function ContentEditor({ initial }: { initial: Record<string, any> }) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, any>>(() =>
    structuredClone(initial),
  );
  const [active, setActive] = useState<string>(SECTION_ORDER[0]);
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [state, setState] = useState({ saving: false, msg: "" });

  const fields = SECTION_FIELDS[active] ?? [];
  const section = data[active] ?? {};

  function setField(k: string, value: any) {
    setData((d) => ({ ...d, [active]: { ...(d[active] || {}), [k]: value } }));
  }

  async function save() {
    setState({ saving: true, msg: "" });
    const merged: Record<string, any> = { ...section };
    for (const f of fields) {
      if (f.type === "json") {
        const id = `${active}.${f.k}`;
        const txt = raw[id] ?? JSON.stringify(section[f.k] ?? null, null, 2);
        try {
          merged[f.k] = JSON.parse(txt);
        } catch {
          setState({ saving: false, msg: `Invalid JSON in ${f.label}` });
          return;
        }
      }
    }
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: { [active]: merged } }),
      });
      if (!res.ok) throw new Error();
      setData((d) => ({ ...d, [active]: merged }));
      setState({ saving: false, msg: "Saved — live on site ✓" });
      router.refresh();
      setTimeout(() => setState((s) => ({ ...s, msg: "" })), 2500);
    } catch {
      setState({ saving: false, msg: "Error saving" });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="flex flex-row flex-wrap gap-2 lg:flex-col">
        {SECTION_ORDER.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              active === key
                ? "bg-primary/15 text-primary"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            {SECTION_LABELS[key]}
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">
            {SECTION_LABELS[active]}
          </h3>
          <Feedback msg={state.msg} />
        </div>
        <div className="grid gap-4">
          {fields.map((f) => {
            const id = `${active}.${f.k}`;
            if (f.type === "json")
              return (
                <Field key={f.k} label={f.label} hint="Editable as JSON">
                  <TextArea
                    rows={7}
                    className="font-mono text-xs"
                    value={raw[id] ?? JSON.stringify(section[f.k] ?? null, null, 2)}
                    onChange={(e) =>
                      setRaw((r) => ({ ...r, [id]: e.target.value }))
                    }
                  />
                </Field>
              );
            if (f.type === "textarea")
              return (
                <Field key={f.k} label={f.label}>
                  <TextArea
                    rows={3}
                    value={section[f.k] ?? ""}
                    onChange={(e) => setField(f.k, e.target.value)}
                  />
                </Field>
              );
            if (f.type === "bool")
              return (
                <div key={f.k} className="rounded-lg border border-white/10 p-3">
                  <Toggle
                    checked={!!section[f.k]}
                    onChange={(v) => setField(f.k, v)}
                    label={f.label}
                  />
                </div>
              );
            if (f.type === "number")
              return (
                <Field key={f.k} label={f.label}>
                  <TextInput
                    type="number"
                    value={section[f.k] ?? 0}
                    onChange={(e) => setField(f.k, Number(e.target.value))}
                  />
                </Field>
              );
            if (f.type === "list")
              return (
                <Field key={f.k} label={f.label} hint="Comma separated">
                  <TextInput
                    value={Array.isArray(section[f.k]) ? section[f.k].join(", ") : ""}
                    onChange={(e) =>
                      setField(
                        f.k,
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </Field>
              );
            return (
              <Field key={f.k} label={f.label}>
                <TextInput
                  value={section[f.k] ?? ""}
                  onChange={(e) => setField(f.k, e.target.value)}
                />
              </Field>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={state.saving}>
            {state.saving ? "Saving…" : "Save Section"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Appearance editor                                                         */
/* -------------------------------------------------------------------------- */

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-xs tabular-nums text-white/70">
          {value}
          {suffix}
        </span>
      </div>
      <Slider value={value} onChange={onChange} min={min} max={max} step={step} />
    </div>
  );
}

function ThemeEditor({ initial }: { initial: ThemeData }) {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeData>(() => structuredClone(initial));
  const [msg, setMsg] = useState("");
  const colorFields: { k: keyof ThemeData; label: string }[] = [
    { k: "primary", label: "Primary" },
    { k: "primarySoft", label: "Primary Soft" },
    { k: "accent", label: "Accent" },
    { k: "background", label: "Background" },
    { k: "surface", label: "Surface" },
    { k: "surfaceLight", label: "Surface Light" },
    { k: "text", label: "Text" },
    { k: "muted", label: "Muted" },
  ];

  async function save() {
    setMsg("");
    const res = await fetch("/api/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    });
    if (res.ok) {
      setMsg("Saved — live ✓");
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } else setMsg("Error");
  }

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Theme Colors</h3>
        <Feedback msg={msg} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {colorFields.map((c) => (
          <Field key={c.k} label={c.label}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={String(theme[c.k] ?? "#000000")}
                onChange={(e) =>
                  setTheme((t) => ({ ...t, [c.k]: e.target.value }))
                }
                className="size-10 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-transparent"
              />
              <TextInput
                value={String(theme[c.k] ?? "")}
                onChange={(e) =>
                  setTheme((t) => ({ ...t, [c.k]: e.target.value }))
                }
              />
            </div>
          </Field>
        ))}
      </div>
      <Field label="Primary Glow (rgba)">
        <TextInput
          value={theme.primaryGlow ?? ""}
          onChange={(e) => setTheme((t) => ({ ...t, primaryGlow: e.target.value }))}
        />
      </Field>
      <div className="mt-6 flex justify-end">
        <Button onClick={save}>Save Theme</Button>
      </div>
    </Card>
  );
}

function SectionBgEditor({
  name,
  bg,
  onChange,
}: {
  name: string;
  bg: SectionBg;
  onChange: (b: SectionBg) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<SectionBg>) => onChange({ ...bg, ...patch });
  return (
    <Card>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <span className="font-display text-sm font-semibold capitalize">
          {name}
        </span>
        <span className="text-xs text-muted">{bg.type}</span>
      </button>
      {open && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Type">
            <select
              value={bg.type}
              onChange={(e) => set({ type: e.target.value as SectionBg["type"] })}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"
            >
              <option value="gradient">Gradient</option>
              <option value="solid">Solid Color</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </Field>
          {bg.type === "gradient" && (
            <div className="sm:col-span-2">
              <Field label="Gradient CSS">
                <TextArea
                  rows={2}
                  value={bg.gradient}
                  onChange={(e) => set({ gradient: e.target.value })}
                />
              </Field>
            </div>
          )}
          {bg.type === "solid" && (
            <Field label="Solid Color">
              <TextInput
                value={bg.solid}
                onChange={(e) => set({ solid: e.target.value })}
              />
            </Field>
          )}
          {bg.type === "image" && (
            <div className="sm:col-span-2">
              <Field label="Image URL (Cloudinary)">
                <TextInput
                  value={bg.imageUrl}
                  onChange={(e) => set({ imageUrl: e.target.value })}
                />
              </Field>
            </div>
          )}
          {bg.type === "video" && (
            <div className="sm:col-span-2">
              <Field label="Video URL (Cloudinary)">
                <TextInput
                  value={bg.videoUrl}
                  onChange={(e) => set({ videoUrl: e.target.value })}
                />
              </Field>
            </div>
          )}

          <div className="rounded-lg border border-white/10 p-3 sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle checked={bg.grid} onChange={(v) => set({ grid: v })} label="Grid" />
              <Toggle checked={bg.overlay} onChange={(v) => set({ overlay: v })} label="Overlay" />
              <Toggle checked={bg.particles} onChange={(v) => set({ particles: v })} label="Particles" />
              <Toggle checked={!!bg.desktopOnly} onChange={(v) => set({ desktopOnly: v })} label="Desktop Only" />
            </div>
          </div>

          <SliderRow label="Grid Opacity" value={bg.gridOpacity} onChange={(v) => set({ gridOpacity: v })} min={0} max={1} step={0.01} />
          <SliderRow label="Overlay Opacity" value={bg.overlayOpacity} onChange={(v) => set({ overlayOpacity: v })} min={0} max={1} step={0.01} />
          <SliderRow label="Blur" value={bg.blur} onChange={(v) => set({ blur: v })} min={0} max={20} step={1} suffix="px" />
          <SliderRow label="Brightness" value={bg.brightness} onChange={(v) => set({ brightness: v })} min={0} max={200} step={5} suffix="%" />
          <SliderRow label="Contrast" value={bg.contrast} onChange={(v) => set({ contrast: v })} min={0} max={200} step={5} suffix="%" />
          <SliderRow label="Saturation" value={bg.saturation} onChange={(v) => set({ saturation: v })} min={0} max={200} step={5} suffix="%" />
          <SliderRow label="Parallax" value={bg.parallax} onChange={(v) => set({ parallax: v })} min={0} max={1} step={0.05} />
          <SliderRow label="Animation Speed" value={bg.animationSpeed} onChange={(v) => set({ animationSpeed: v })} min={0.2} max={3} step={0.1} suffix="x" />

          <div className="sm:col-span-2">
            <Field label="Overlay Color">
              <TextInput
                value={bg.overlayColor}
                onChange={(e) => set({ overlayColor: e.target.value })}
              />
            </Field>
          </div>
        </div>
      )}
    </Card>
  );
}

function BackgroundEditor({ initial }: { initial: BackgroundData }) {
  const router = useRouter();
  const [bg, setBg] = useState<BackgroundData>(() => structuredClone(initial));
  const [msg, setMsg] = useState("");
  const keys = Object.keys(bg.sections ?? {});

  async function save() {
    setMsg("");
    const res = await fetch("/api/background", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bg),
    });
    if (res.ok) {
      setMsg("Saved — live ✓");
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } else setMsg("Error");
  }

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Per-Section Backgrounds</h3>
        <Feedback msg={msg} />
      </div>
      <div className="grid gap-3">
        {keys.map((key) => (
          <SectionBgEditor
            key={key}
            name={key}
            bg={bg.sections[key]}
            onChange={(b) =>
              setBg((prev) => ({
                ...prev,
                sections: { ...prev.sections, [key]: b },
              }))
            }
          />
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={save}>Save Backgrounds</Button>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Portfolio editor                                                          */
/* -------------------------------------------------------------------------- */

function PortfolioEditor({ items }: { items: PortfolioItem[] }) {
  const router = useRouter();
  const [list, setList] = useState<PortfolioItem[]>(items);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Partial<PortfolioItem>>({});
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function startCreate() {
    setDraft({
      title: "",
      description: "",
      imageUrl: "",
      publicId: "",
      tags: [],
      category: "YouTube Thumbnail",
      order: list.length + 1,
      featured: false,
      published: true,
    });
    setEditingId("new");
  }
  function startEdit(it: PortfolioItem) {
    setDraft({ ...it });
    setEditingId(it.id);
  }
  function cancel() {
    setEditingId(null);
    setDraft({});
  }

  async function persist() {
    setMsg("");
    const payload = {
      title: draft.title || "Untitled",
      description: draft.description || "",
      imageUrl: draft.imageUrl || "",
      publicId: draft.publicId || null,
      tags: draft.tags ?? [],
      category: draft.category || "YouTube Thumbnail",
      order: Number(draft.order ?? 0),
      featured: !!draft.featured,
      published: draft.published !== false,
    };
    try {
      if (editingId === "new") {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = (await res.json()) as PortfolioItem;
        setList((l) => [...l, created]);
        setMsg("Created ✓");
      } else if (typeof editingId === "number") {
        const res = await fetch(`/api/portfolio/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = (await res.json()) as PortfolioItem;
        setList((l) => l.map((it) => (it.id === editingId ? updated : it)));
        setMsg("Saved ✓");
      }
      cancel();
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Error saving");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this thumbnail?")) return;
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    setList((l) => l.filter((it) => it.id !== id));
    router.refresh();
  }

  async function quickToggle(it: PortfolioItem, key: "published" | "featured") {
    const payload = { ...it, [key]: !it[key] };
    const res = await fetch(`/api/portfolio/${it.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = (await res.json()) as PortfolioItem;
    setList((l) => l.map((x) => (x.id === it.id ? updated : x)));
    router.refresh();
  }

  async function move(id: number, dir: -1 | 1) {
    const idx = list.findIndex((x) => x.id === id);
    const swapWith = idx + dir;
    if (idx < 0 || swapWith < 0 || swapWith >= list.length) return;
    const a = list[idx];
    const b = list[swapWith];
    await Promise.all([
      fetch(`/api/portfolio/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, order: b.order }),
      }),
      fetch(`/api/portfolio/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, order: a.order }),
      }),
    ]);
    setList((l) => {
      const next = [...l];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next.map((x, i) => ({ ...x, order: i + 1 }));
    });
    router.refresh();
  }

  async function upload(file: File) {
    setMsg("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = (await res.json()) as { url?: string; publicId?: string; error?: string };
    if (res.ok && json.url) {
      setDraft((d) => ({ ...d, imageUrl: json.url, publicId: json.publicId }));
      setMsg("Uploaded ✓");
    } else {
      setMsg(json.error || "Upload failed — paste a URL instead");
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">
          Portfolio ({list.length})
        </h3>
        <div className="flex items-center gap-3">
          <Feedback msg={msg} />
          <Button onClick={startCreate}>+ Add Thumbnail</Button>
        </div>
      </div>

      {editingId !== null && (
        <Card className="mb-5">
          <h4 className="mb-4 font-display font-semibold">
            {editingId === "new" ? "New Thumbnail" : "Edit Thumbnail"}
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={draft.title ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
            </Field>
            <Field label="Category">
              <TextInput
                value={draft.category ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <TextArea
                  rows={2}
                  value={draft.description ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Image URL" hint="Cloudinary URL or upload below">
                <TextInput
                  value={draft.imageUrl ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, imageUrl: e.target.value }))
                  }
                />
              </Field>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs font-semibold text-primary hover:underline"
              >
                Upload to Cloudinary
              </button>
            </div>
            <Field label="Public ID">
              <TextInput
                value={draft.publicId ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, publicId: e.target.value }))
                }
              />
            </Field>
            <Field label="Tags" hint="Comma separated">
              <TextInput
                value={(draft.tags ?? []).join(", ")}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </Field>
            <Field label="Order">
              <TextInput
                type="number"
                value={draft.order ?? 0}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, order: Number(e.target.value) }))
                }
              />
            </Field>
            <div className="flex items-center gap-6">
              <Toggle
                checked={!!draft.featured}
                onChange={(v) => setDraft((d) => ({ ...d, featured: v }))}
                label="Featured"
              />
              <Toggle
                checked={draft.published !== false}
                onChange={(v) => setDraft((d) => ({ ...d, published: v }))}
                label="Published"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={cancel}>
              Cancel
            </Button>
            <Button onClick={persist}>Save Thumbnail</Button>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {list.map((it) => (
          <Card key={it.id} className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.imageUrl}
              alt={it.title}
              className="size-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-display text-sm font-semibold">
                  {it.title}
                </span>
                {it.featured && (
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    Featured
                  </span>
                )}
                {!it.published && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted">
                    Hidden
                  </span>
                )}
              </div>
              <div className="truncate text-xs text-muted">
                {it.category} · {it.tags?.length ?? 0} tags
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" onClick={() => move(it.id, -1)}>
                ↑
              </Button>
              <Button variant="ghost" onClick={() => move(it.id, 1)}>
                ↓
              </Button>
              <Button variant="ghost" onClick={() => startEdit(it)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={() => quickToggle(it, "published")}
              >
                {it.published ? "Hide" : "Show"}
              </Button>
              <Button variant="danger" onClick={() => remove(it.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-muted">No thumbnails yet.</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonials editor                                                       */
/* -------------------------------------------------------------------------- */

function TestimonialEditor({ items }: { items: Testimonial[] }) {
  const router = useRouter();
  const [list, setList] = useState<Testimonial[]>(items);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Partial<Testimonial>>({});

  function startCreate() {
    setDraft({
      name: "",
      role: "",
      rating: 5,
      review: "",
      order: list.length + 1,
      published: true,
    });
    setEditingId("new");
  }
  function cancel() {
    setEditingId(null);
    setDraft({});
  }

  async function persist() {
    const payload = {
      name: draft.name || "Anonymous",
      role: draft.role || "",
      avatar: draft.avatar || null,
      rating: Number(draft.rating ?? 5),
      review: draft.review || "",
      order: Number(draft.order ?? 0),
      published: draft.published !== false,
    };
    if (editingId === "new") {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = (await res.json()) as Testimonial;
      setList((l) => [...l, created]);
    } else if (typeof editingId === "number") {
      const res = await fetch(`/api/testimonials/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = (await res.json()) as Testimonial;
      setList((l) => l.map((t) => (t.id === editingId ? updated : t)));
    }
    cancel();
    router.refresh();
  }

  async function remove(id: number) {
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setList((l) => l.filter((t) => t.id !== id));
    router.refresh();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">
          Testimonials ({list.length})
        </h3>
        <Button onClick={startCreate}>+ Add Review</Button>
      </div>

      {editingId !== null && (
        <Card className="mb-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <TextInput
                value={draft.name ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </Field>
            <Field label="Role">
              <TextInput
                value={draft.role ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Review">
                <TextArea
                  rows={3}
                  value={draft.review ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, review: e.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Rating (1-5)">
              <TextInput
                type="number"
                min={1}
                max={5}
                value={draft.rating ?? 5}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, rating: Number(e.target.value) }))
                }
              />
            </Field>
            <div className="flex items-end gap-6">
              <Toggle
                checked={draft.published !== false}
                onChange={(v) => setDraft((d) => ({ ...d, published: v }))}
                label="Published"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={cancel}>
              Cancel
            </Button>
            <Button onClick={persist}>Save</Button>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {list.map((t) => (
          <Card key={t.id} className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold">{t.name}</span>
                <span className="text-xs text-primary">{"★".repeat(t.rating)}</span>
                {!t.published && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted">
                    Hidden
                  </span>
                )}
              </div>
              <div className="text-xs text-muted">{t.role}</div>
              <p className="mt-1 line-clamp-2 text-sm text-white/80">{t.review}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                onClick={() => {
                  setDraft({ ...t });
                  setEditingId(t.id);
                }}
              >
                Edit
              </Button>
              <Button variant="danger" onClick={() => remove(t.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inbox                                                                     */
/* -------------------------------------------------------------------------- */

interface MessageLike {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string | Date;
}

function Inbox({ messages }: { messages: MessageLike[] }) {
  const router = useRouter();
  const [list, setList] = useState<MessageLike[]>(messages);

  async function markRead(id: number, read: boolean) {
    await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    setList((l) => l.map((m) => (m.id === id ? { ...m, read } : m)));
  }
  async function remove(id: number) {
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setList((l) => l.filter((m) => m.id !== id));
  }

  return (
    <div>
      <h3 className="mb-5 font-display text-lg font-bold">Inbox ({list.length})</h3>
      <div className="grid gap-3">
        {list.map((m) => (
          <Card
            key={m.id}
            className={!m.read ? "border-primary/40 bg-primary/[0.04]" : ""}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold">
                    {m.subject}
                  </span>
                  {!m.read && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      New
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted">
                  {m.name} · {m.email} · {new Date(m.createdAt).toLocaleString()}
                </div>
                <p className="mt-2 text-sm text-white/80">{m.message}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <Button variant="ghost" onClick={() => markRead(m.id, !m.read)}>
                  {m.read ? "Unread" : "Read"}
                </Button>
                <Button variant="danger" onClick={() => remove(m.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboard shell                                                           */
/* -------------------------------------------------------------------------- */

type Tab = "overview" | "content" | "appearance" | "portfolio" | "testimonials" | "inbox";

export function Dashboard({
  initial,
}: {
  initial: {
    content: Record<string, any>;
    portfolio: PortfolioItem[];
    testimonials: Testimonial[];
    messages: MessageLike[];
    name: string;
    email: string;
  };
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "content", label: "Content" },
    { id: "appearance", label: "Appearance" },
    { id: "portfolio", label: "Portfolio" },
    { id: "testimonials", label: "Testimonials" },
    { id: "inbox", label: "Inbox" },
  ];

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const theme = (initial.content.theme ?? {}) as ThemeData;
  const background = (initial.content.background ?? {}) as BackgroundData;

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(800px 500px at 80% 0%, rgba(193,18,31,0.10), transparent 60%)",
        }}
      />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 font-display text-sm font-extrabold text-primary ring-1 ring-primary/20">
              {initial.content.settings?.brandInitials ?? "AR"}
            </span>
            <div>
              <div className="font-display text-sm font-bold">Studio Dashboard</div>
              <div className="text-[11px] text-muted">{initial.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/60 hover:text-primary"
            >
              View Site ↗
            </a>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-2 no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary/15 text-primary"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              {t.label}
              {t.id === "inbox" && initial.messages.filter((m) => !m.read).length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary px-1.5 text-[10px] text-white">
                  {initial.messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {tab === "overview" && (
          <Overview
            counts={{
              portfolio: initial.portfolio.length,
              testimonials: initial.testimonials.length,
              messages: initial.messages.length,
              unread: initial.messages.filter((m) => !m.read).length,
            }}
            name={initial.name}
            onJump={setTab}
          />
        )}
        {tab === "content" && <ContentEditor initial={initial.content} />}
        {tab === "appearance" && (
          <div className="grid gap-6">
            <ThemeEditor initial={theme} />
            <BackgroundEditor initial={background} />
          </div>
        )}
        {tab === "portfolio" && <PortfolioEditor items={initial.portfolio} />}
        {tab === "testimonials" && (
          <TestimonialEditor items={initial.testimonials} />
        )}
        {tab === "inbox" && <Inbox messages={initial.messages} />}
      </main>
    </div>
  );
}

function Overview({
  counts,
  name,
  onJump,
}: {
  counts: {
    portfolio: number;
    testimonials: number;
    messages: number;
    unread: number;
  };
  name: string;
  onJump: (t: Tab) => void;
}) {
  const cards: { label: string; value: number; tab: Tab; accent?: boolean }[] = [
    { label: "Thumbnails", value: counts.portfolio, tab: "portfolio" },
    { label: "Testimonials", value: counts.testimonials, tab: "testimonials" },
    { label: "Messages", value: counts.messages, tab: "inbox" },
    { label: "Unread", value: counts.unread, tab: "inbox", accent: true },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">
        Welcome back, {name.split(" ")[0]} 👋
      </h2>
      <p className="mt-1 text-sm text-muted">
        Manage every part of your site. Changes save to PostgreSQL and go live
        instantly — no redeploy required.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button key={c.label} onClick={() => onJump(c.tab)} className="text-left">
            <Card
              className={c.accent ? "border-primary/40 bg-primary/[0.05]" : ""}
            >
              <div className="font-display text-4xl font-extrabold text-gradient-red">
                {c.value}
              </div>
              <div className="mt-1 text-sm text-muted">{c.label}</div>
            </Card>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          { t: "Content", d: "Edit hero, about, services, social, contact, footer, SEO.", tab: "content" as Tab },
          { t: "Appearance", d: "Theme colors & per-section backgrounds.", tab: "appearance" as Tab },
          { t: "Portfolio", d: "Add, reorder, feature & hide thumbnails.", tab: "portfolio" as Tab },
        ].map((x) => (
          <button key={x.t} onClick={() => onJump(x.tab)} className="text-left">
            <Card className="h-full transition-colors hover:border-primary/40">
              <div className="font-display font-bold">{x.t}</div>
              <div className="mt-1 text-sm text-muted">{x.d}</div>
              <div className="mt-3 text-sm font-semibold text-primary">Manage →</div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
