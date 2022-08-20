export type TargetedEvent<Target extends EventTarget = EventTarget> = JSX.TargetedEvent<
  Target,
  Event & { target: Target }
>;
