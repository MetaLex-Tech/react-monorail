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
          <MonorailCar>
            {(itemState) => (
              <div className="inline-flex h-[18px] items-center gap-1">
                <span
                  className={cn({
                    "text-highlight-500": itemState.isActive,
                  })}
                >
                  Research
                </span>
              </div>
            )}
          </MonorailCar>
          <MonorailCar>
            {(itemState) =>
              (itemState.isActive || itemState.isHovered) && (
                <div className="inline-flex h-[18px] items-center gap-1">
                  <Settings2 size={14} />
                  <span
                    className={itemState.isActive ? "text-highlight-500" : ""}
                  >
                    Design
                  </span>
                </div>
              )
            }
          </MonorailCar>
          <MonorailCar>
            {(itemState) =>
              (itemState.isActive || itemState.isHovered) && (
                <div className="inline-flex h-[18px] items-center gap-1">
                  <FileText size={14} />
                  <span
                    className={itemState.isActive ? "text-highlight-500" : ""}
                  >
                    Build
                  </span>
                </div>
              )
            }
          </MonorailCar>
          <MonorailCar>
            {(itemState) => (
              <div className="inline-flex h-[18px] items-center gap-1">
                <Rocket size={14} />
                <span
                  className={cn({
                    "text-highlight-500": itemState.isActive,
                  })}
                >
                  Launch
                </span>
              </div>
            )}
          </MonorailCar>
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Icons sit in the car; labels expand only on the active car."
        title="Icons and labels"
      >
        <Monorail>
          <MonorailCar icon={<Search size={14} />}>
            {(itemState) => (
              <span
                className={cn({
                  "text-highlight-500": itemState.isActive,
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
                  className={cn({
                    "text-highlight-500": itemState.isActive,
                  })}
                >
                  Design
                </span>
              )
            }
          </MonorailCar>
          <MonorailCar>
            {(itemState) =>
              itemState.isActive && (
                <span className="text-highlight-500">Build</span>
              )
            }
          </MonorailCar>
          <MonorailCar icon={<FileText size={14} />}>
            {(itemState) =>
              itemState.isActive && (
                <span className="text-highlight-500">Review</span>
              )
            }
          </MonorailCar>
          <MonorailCar>
            {(itemState) => (
              <div className="inline-flex h-[18px] items-center gap-1">
                <Rocket size={14} />
                <span
                  className={cn({
                    "text-highlight-500": itemState.isActive,
                  })}
                >
                  Launch
                </span>
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
        description="highlight (default) vs neutral."
        title="Color"
      >
        <Monorail color="highlight">
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
        <Monorail color="neutral">
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
        <Monorail activeIndex={-1} color="highlight">
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

      <GallerySection
        description="Large cars with a trailing action. Parent owns the selected key."
        title="Trailing action"
      >
        <Monorail
          activeIndex={activePhaseIndex >= 0 ? activePhaseIndex : 0}
          disableTransitions
        >
          {
            [
              ...phases.map((car) => {
                const isActive = car.key === activePhaseKey;
                return (
                  <MonorailCar
                    key={car.key}
                    hasHoverEffect={!isActive}
                    size="large"
                    onClick={() => setActivePhaseKey(car.key)}
                  >
                    {({ isHovered }) => (
                      <span
                        className={cn(
                          "inline-flex h-full items-center gap-2 text-sm",
                          {
                            "text-highlight-500": isHovered && !isActive,
                          },
                        )}
                      >
                        <span className="font-medium">{car.label}</span>
                        <span className="text-brand-white/[0.24]">|</span>
                        <span>{car.value}</span>
                      </span>
                    )}
                  </MonorailCar>
                );
              }),
              <MonorailCar
                key="add-phase"
                className="pl-2"
                hasHoverEffect
                icon={<span className="w-3 text-lg text-highlight-500">+</span>}
                size="large"
                onClick={() => {}}
              >
                {({ isHovered }) => (
                  <span
                    className={cn("text-muted-foreground", {
                      "text-highlight-500": isHovered,
                    })}
                  >
                    Add phase
                  </span>
                )}
              </MonorailCar>,
            ] as unknown as ReactElement<MonorailCarProps>
          }
        </Monorail>
      </GallerySection>

      <GallerySection
        description="Two non-button cars used as a compact info strip."
        title="Info strip"
      >
        <Monorail
          className="h-7 w-full text-xs"
          activeIndex={-1}
          color="highlight"
        >
          <MonorailCar isButton={false} icon={<Search size={16} />}>
            {() => (
              <span className="ml-1 text-xs text-brand-white/80">
                Preview only
              </span>
            )}
          </MonorailCar>
          <MonorailCar isButton={false}>
            {() => (
              <span className="text-xs text-highlight-500">Read-only</span>
            )}
          </MonorailCar>
        </Monorail>
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
    <Monorail activeIndex={-1} color={blocked ? "neutral" : "highlight"}>
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
        <h2 className="text-sm font-medium text-brand-white">{title}</h2>
        {description ? (
          <p className="text-xs text-brand-white/60">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
