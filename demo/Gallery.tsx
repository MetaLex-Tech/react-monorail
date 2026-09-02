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
import { type ReactElement, type ReactNode, useState } from "react";
import { Monorail, MonorailCar, type MonorailCarProps } from "react-monorail";
import { cn } from "../src/lib/cn";

const phases = [
  { key: "one", label: "Phase 1", value: "12 items" },
  { key: "two", label: "Phase 2", value: "8 items" },
  { key: "three", label: "Phase 3", value: "4 items" },
] as const;

const statusExamples = [
  { key: "empty", active: [] as string[] },
  { key: "draft-review", active: ["draft", "review"] },
  { key: "all", active: ["draft", "review", "approved", "published"] },
  { key: "blocked", active: ["draft"], blocked: true },
] as const;

export function Gallery() {
  const [controlledIndex, setControlledIndex] = useState(0);
  const [activePhaseKey, setActivePhaseKey] = useState("two");

  const activePhaseIndex = phases.findIndex(
    (car) => car.key === activePhaseKey,
  );

  return (
    <div className="flex flex-col gap-12">
      <GallerySection
        description="Click a car to activate it. Hover inactive cars to reveal their labels."
        title="Hover to reveal"
      >
        <Monorail>
          <MonorailCar isButton={false}>{() => "Phases"}</MonorailCar>
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
            className="bg-[#2f3317] hover:bg-[#000000] text-brand-white"
            icon={<Search size={14} />}
          >
            {(itemState) => (
              <span
                className={cn({
                  "text-highlight-500": itemState.isHovered,
                })}
              >
                Research
              </span>
            )}
          </MonorailCar>
          <MonorailCar icon={<Settings2 size={14} />}>
            {(itemState) =>
              itemState.isActive && (
                <span
                // className={cn({
                //   "text-highlight-500": itemState.isActive,
                // })}
                >
                  Design
                </span>
              )
            }
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
            {(itemState) => (
              <span
                className={cn({
                  "text-highlight-500": itemState.isActive,
                })}
              >
                Always visible
              </span>
            )}
          </MonorailCar>
          <MonorailCar hasHoverEffect isButton={false}>
            {() => <span>Hover highlight</span>}
          </MonorailCar>
          <MonorailCar onClick={(index) => setControlledIndex(index)}>
            {(itemState) =>
              itemState.isActive && (
                <span
                  className={cn({
                    "text-highlight-500": itemState.isHovered,
                  })}
                >
                  + Add note
                </span>
              )
            }
          </MonorailCar>
          <MonorailCar
            icon={<Code2 size={14} />}
            onClick={(index) => setControlledIndex(index)}
          >
            {(itemState) =>
              itemState.isActive && (
                <span
                  className={cn({
                    "text-highlight-500": itemState.isHovered,
                  })}
                >
                  Run
                </span>
              )
            }
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection title="Single car">
        <Monorail>
          <MonorailCar>{() => <span>One car</span>}</MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Override tokens with CSS or Tailwind. Default vs [--monorail-active-bg:var(--neutral-500)]."
        title="Color"
      >
        <Monorail>
          <MonorailCar>
            {(itemState) => (
              <span
                className={cn({
                  "text-highlight-500": itemState.isActive,
                })}
              >
                Highlight
              </span>
            )}
          </MonorailCar>
          <MonorailCar>
            {(itemState) => (
              <span
                className={cn({
                  "text-highlight-500": itemState.isActive,
                })}
              >
                Active
              </span>
            )}
          </MonorailCar>
        </Monorail>
        <Monorail className="[--monorail-active-bg:var(--neutral-500)] [--monorail-color:var(--neutral-500)]">
          <MonorailCar>
            {(itemState) => (
              <span
                className={cn({
                  "text-neutral-500": itemState.isActive,
                })}
              >
                Neutral
              </span>
            )}
          </MonorailCar>
          <MonorailCar>
            {(itemState) => (
              <span
                className={cn({
                  "text-neutral-500": itemState.isActive,
                })}
              >
                Active
              </span>
            )}
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection description="default vs large." title="Size">
        <Monorail>
          <MonorailCar>{() => <span>Default</span>}</MonorailCar>
          <MonorailCar>{() => <span>Size</span>}</MonorailCar>
        </Monorail>
        <Monorail>
          <MonorailCar size="large">{() => <span>Large</span>}</MonorailCar>
          <MonorailCar size="large">{() => <span>Size</span>}</MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Cars are not buttons. activeIndex={-1} so none is selected."
        title="Status only"
      >
        <Monorail activeIndex={-1}>
          <MonorailCar isButton={false} icon={<FileText size={14} />}>
            {() => <span className="text-brand-white/60">Draft</span>}
          </MonorailCar>
          <MonorailCar isButton={false} icon={<Code2 size={14} />}>
            {() => <span className="text-brand-white/60">Publish</span>}
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
      className={
        blocked
          ? "[--monorail-active-bg:var(--neutral-500)] [--monorail-color:var(--neutral-500)]"
          : undefined
      }
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
                  className={cn("text-brand-white/60", {
                    "text-highlight-500": isDone && !blocked,
                    "text-neutral-500": isDone && blocked,
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
