import {
  Check,
  Code2,
  FileText,
  Pencil,
  Rocket,
  Search,
  Settings2,
  User,
} from "lucide-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import { Monorail, MonorailCar } from "react-monorail";
import { cn } from "../src/lib/cn";

const statusExamples = [
  { key: "empty", active: [] as string[] },
  { key: "draft-review", active: ["draft", "review"] },
  { key: "all", active: ["draft", "review", "approved", "published"] },
  { key: "blocked", active: ["draft"], blocked: true },
] as const;

export function Gallery() {
  const [controlledIndex, setControlledIndex] = useState(0);

  return (
    <div className="flex flex-col gap-12">
      <GallerySection
        description="Click a car to activate it. Hover inactive cars to reveal their labels."
        title="Hover to reveal"
      >
        <Monorail>
          <MonorailCar isActive isButton={false}>{() => "Phases"}</MonorailCar>
          <MonorailCar icon={<Settings2 size={14} />}>
            {(itemState) =>
              (itemState.isActive || itemState.isHovered) && "Design"
            }
          </MonorailCar>
          <MonorailCar icon={<FileText size={14} />}>
            {(itemState) =>
              (itemState.isActive || itemState.isHovered) && "Build"
            }
          </MonorailCar>
          <MonorailCar icon={<Rocket size={14} />}>
            {(itemState) =>
              (itemState.isActive || itemState.isHovered) && "Launch"
            }
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Each car can have it's own state behaviour and style."
        title="Car Customization"
      >
        <Monorail>
          <MonorailCar
            className="bg-[#33b0ff] hover:bg-[#000000] text-white"
            icon={<Search size={14} />}
          >
            {() => "Research"}
          </MonorailCar>
          <MonorailCar icon={<Settings2 size={14} />}>
            {(itemState) => itemState.isActive && <span>Design</span>}
          </MonorailCar>
          <MonorailCar>
            {(itemState) => itemState.isActive && <span>Build</span>}
          </MonorailCar>
          <MonorailCar>
            {(itemState) => itemState.isActive && <span>Review</span>}
          </MonorailCar>
          <MonorailCar>
            {() => (
              <div className="inline-flex h-[18px] items-center gap-1">
                <Rocket size={14} />
                Launch
              </div>
            )}
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Width changes snap instead of animating."
        title="Disabled transitions"
      >
        <Monorail disableTransitions>
          <MonorailCar icon={<User size={14} />}>
            {() => <span>Disabled transitions</span>}
          </MonorailCar>
          <MonorailCar icon={<Rocket size={14} />}>
            {(itemState) => itemState.isActive && <span>Launch</span>}
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Parent owns activeIndex. Some cars are not buttons."
        title="Controlled"
      >
        <Monorail activeIndex={controlledIndex}>
          <MonorailCar icon={<User size={14} />} isButton={false}>
            {() => <span>Always visible</span>}
          </MonorailCar>
          <MonorailCar hasHoverEffect isButton={false}>
            {() => <span>Hover highlight</span>}
          </MonorailCar>
          <MonorailCar onClick={(index) => setControlledIndex(index)}>
            {(itemState) => itemState.isActive && <span>+ Add note</span>}
          </MonorailCar>
          <MonorailCar
            icon={<Code2 size={14} />}
            onClick={(index) => setControlledIndex(index)}
          >
            {(itemState) => itemState.isActive && <span>Run</span>}
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Override tokens with CSS or Tailwind. Default vs [--monorail-active-bg:51_176_255]."
        title="Color"
      >
        <Monorail>
          <MonorailCar>{() => "Default"}</MonorailCar>
          <MonorailCar>{() => "Active"}</MonorailCar>
        </Monorail>
        <Monorail
          style={
            {
              "--monorail-active-bg": "51 176 255",
              "--monorail-text": "218 255 0",
            } as CSSProperties
          }
        >
          <MonorailCar>{() => "Override"}</MonorailCar>
          <MonorailCar>{() => "Active"}</MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Default 28px vs className h-[38px] and h-[50px]."
        title="Size"
      >
        <Monorail>
          <MonorailCar>{() => <span>Default</span>}</MonorailCar>
          <MonorailCar>{() => <span>Size</span>}</MonorailCar>
        </Monorail>
        <Monorail>
          <MonorailCar className="h-[38px] text-sm">
            {() => <span>38px</span>}
          </MonorailCar>
          <MonorailCar className="h-[38px] text-sm">
            {() => <span>Size</span>}
          </MonorailCar>
        </Monorail>
        <Monorail>
          <MonorailCar className="h-[50px] text-sm">
            {() => <span>50px</span>}
          </MonorailCar>
          <MonorailCar className="h-[50px] text-sm">
            {() => <span>Size</span>}
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Cars are not buttons. activeIndex={-1} so none is selected."
        title="Status only"
      >
        <Monorail activeIndex={-1}>
          <MonorailCar isButton={false} icon={<FileText size={14} />}>
            {() => <span className="text-monorail-text/60">Draft</span>}
          </MonorailCar>
          <MonorailCar isButton={false} icon={<Code2 size={14} />}>
            {() => <span className="text-monorail-text/60">Publish</span>}
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Non-interactive cars showing completed steps. Labels collapse when a later step is blocked."
        title="Multi-step status"
      >
        {statusExamples.map((example) => (
          <StatusRail
            key={example.key}
            activeSteps={example.active}
            blocked={"blocked" in example && example.blocked}
          />
        ))}
      </GallerySection>
    </div>
  );
}

function StatusRail({
  activeSteps,
  blocked = false,
}: {
  activeSteps: readonly string[];
  blocked?: boolean;
}) {
  const steps = [
    {
      key: "draft",
      icon: <Pencil size={14} />,
      label: "Draft",
      doneLabel: "Drafted",
    },
    {
      key: "review",
      icon: <FileText size={14} />,
      label: "Review",
      doneLabel: "In review",
    },
    {
      key: "approved",
      icon: <Check size={14} />,
      label: "Approve",
      doneLabel: "Approved",
    },
    {
      key: "published",
      icon: <Rocket size={14} />,
      label: "Publish",
      doneLabel: "Published",
    },
  ];

  return (
    <Monorail
      activeIndex={-1}
      className={blocked ? "[--monorail-active-bg:51_176_255]" : undefined}
    >
      {steps.map((step) => {
        const isDone = activeSteps.includes(step.key);
        const hideLabel = blocked && step.key !== "draft";
        return (
          <MonorailCar
            key={step.key}
            isButton={false}
            isActive={isDone}
            icon={step.icon}
          >
            {() =>
              hideLabel ? null : (
                <span
                  className={cn("text-monorail-text/60", {
                    "text-monorail-active-text": isDone,
                  })}
                >
                  {isDone ? step.doneLabel : step.label}
                </span>
              )
            }
          </MonorailCar>
        );
      })}
    </Monorail>
  );
}

function GallerySection({
  className,
  title,
  description,
  children,
}: {
  className?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{title}</h2>
        {description ? <p className="text-xs">{description}</p> : null}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
